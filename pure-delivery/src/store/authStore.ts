import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Типы из вашего бэкенда
interface CustomerSessionDto {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    loyaltyPoints: number;
    defaultAddress?: CustomerAddressSessionDto;
}

interface CustomerAddressSessionDto {
    id: string;
    label: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    building: string;
    apartment: string;
    floor: string;
}

interface AuthState {
    // Состояние сессии
    isAuthenticated: boolean;
    sessionId: string | null;
    customer: CustomerSessionDto | null;
    isEmailConfirmed: boolean;
    pendingVerificationEmail: string | null;

    // Действия
    setSession: (sessionId: string, customer: CustomerSessionDto, isEmailConfirmed: boolean) => void;
    clearSession: () => void;
    updateCustomer: (customerData: Partial<CustomerSessionDto>) => void;
    setEmailConfirmed: (confirmed: boolean) => void;
    setPendingVerificationEmail: (email: string | null) => void;

    // Проверка сессии
    checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Начальное состояние
            isAuthenticated: false,
            sessionId: null,
            customer: null,
            isEmailConfirmed: false,
            pendingVerificationEmail: null,

            // Устанавливаем сессию после успешного логина
            setSession: (sessionId, customer, isEmailConfirmed) => {
                set({
                    isAuthenticated: true,
                    sessionId,
                    customer,
                    isEmailConfirmed,
                    pendingVerificationEmail: null,
                });
            },

            // Очищаем сессию при логауте
            clearSession: () => {
                set({
                    isAuthenticated: false,
                    sessionId: null,
                    customer: null,
                    isEmailConfirmed: false,
                    pendingVerificationEmail: null,
                });

                // Очищаем cookie сессии (если используется)
                document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            },

            // Обновляем данные клиента
            updateCustomer: (customerData) => {
                const currentCustomer = get().customer;
                if (currentCustomer) {
                    set({ customer: { ...currentCustomer, ...customerData } });
                }
            },

            // Подтверждаем email
            setEmailConfirmed: (confirmed) => {
                set({ isEmailConfirmed: confirmed });
            },

            // Email ожидающий подтверждения
            setPendingVerificationEmail: (email) => {
                set({ pendingVerificationEmail: email });
            },

            // Проверка валидности сессии на сервере
            checkSession: async () => {
                const { sessionId } = get();
                if (!sessionId) return false;

                try {
                    // Здесь будет запрос к вашему API для проверки сессии
                    // const response = await fetch('/api/v1/session/validate', {
                    //   headers: {
                    //     'X-Session-Id': sessionId
                    //   }
                    // });

                    // Временно возвращаем true для демо
                    return true;
                } catch (error) {
                    console.error('Session validation failed:', error);
                    get().clearSession();
                    return false;
                }
            },
        }),
        {
            name: 'auth-session-storage',
            // Сохраняем только необходимые поля
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                sessionId: state.sessionId,
                customer: state.customer,
                isEmailConfirmed: state.isEmailConfirmed,
                pendingVerificationEmail: state.pendingVerificationEmail,
            }),
        }
    )
);