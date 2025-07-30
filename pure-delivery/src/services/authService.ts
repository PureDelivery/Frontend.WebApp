import { API_CONFIG } from '../config/api';
import {CreateCustomerRequest} from "../interfaces/CreateCustomerRequest";
import {BaseResponse} from "../interfaces/BaseResponse";
import {CreateCustomerResultDto} from "../interfaces/CreateCustomerResultDto";
import {AuthenticateRequest} from "../interfaces/AuthenticateRequest";
import {AuthDto} from "../interfaces/AuthDto";
import toast from "react-hot-toast";
import {useAuthStore} from "../store/authStore";
import {
    ChangePasswordRequest,
    ChangePasswordWithOtpRequest,
    RequestPasswordChangeRequest
} from "../interfaces/PasswordChangeRequests";


export interface RegisterFormData extends CreateCustomerRequest {
    confirmPassword: string;
}

export const authService = {

    async authenticate(data: AuthenticateRequest): Promise<BaseResponse<AuthDto>> {
        try {
            console.log('Authenticating user with data:', data)
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.AUTHENTICATE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });


            const result: BaseResponse<AuthDto> = await response.json();

            if (result.isSuccess && result.data?.sessionId) {
                localStorage.setItem('sessionId', result.data.sessionId);
                console.log('💾 SessionId saved to localStorage:', result.data.sessionId);
            }

            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async createCustomer(data: CreateCustomerRequest): Promise<BaseResponse<CreateCustomerResultDto>> {
        try {
            const requestData = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || undefined,
                dateOfBirth: data.dateOfBirth || undefined
            };

            const cleanedData = Object.fromEntries(
                Object.entries(requestData).filter(([_, v]) => v !== undefined)
            );

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.ADD_CUSTOMER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedData)
            });

            const result: BaseResponse<CreateCustomerResultDto> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async verifyOtp(email: string, otpCode: string): Promise<BaseResponse<any>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.VERIFY_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otpCode })
            });

            const result: BaseResponse<any> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async resendOtp(email: string): Promise<BaseResponse<any>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.RESEND_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result: BaseResponse<any> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async checkEmailAvailability(email: string): Promise<BaseResponse<boolean>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.CHECK_EMAIL_AVAILABILITY(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            const result: BaseResponse<any> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }    },

    async logout(): Promise<boolean> {
        try {
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                console.warn('No session found for logout');
                // Все равно очищаем локальное состояние
                useAuthStore.getState().clearSession();
                return true;
            }

            // Вызываем API для logout
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.LOGOUT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionId}`,
                }
            });

            const result: BaseResponse<boolean> = await response.json();

            if (result.isSuccess) {
                // Очищаем локальное состояние
                localStorage.removeItem('sessionId');
                useAuthStore.getState().clearSession();
                console.log('🚪 Logout successful, session cleared');
                toast.success('Logged out successfully');
                return true;
            } else {
                console.error('Logout failed:', result.error);
                // Даже если API вернул ошибку, очищаем локальное состояние
                localStorage.removeItem('sessionId');
                useAuthStore.getState().clearSession();
                toast.error('Logout failed, but session cleared locally');
                return false;
            }
        } catch (error) {
            console.error('Network error during logout:', error);
            // В случае сетевой ошибки все равно очищаем локальное состояние
            localStorage.removeItem('sessionId');
            useAuthStore.getState().clearSession();
            toast.error('Network error during logout, session cleared locally');
            return false;
        }
    },

    async requestForgotPassword(email: string): Promise<BaseResponse<boolean>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.REQUEST_FORGOT_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email } as RequestPasswordChangeRequest)
            });

            return await response.json();
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async changePasswordWithOtp(data: ChangePasswordWithOtpRequest): Promise<BaseResponse<boolean>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.FORGOT_PASSWORD}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async changePassword(data: ChangePasswordRequest): Promise<BaseResponse<boolean>> {
        try {
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                return {
                    isSuccess: false,
                    error: 'Session not found. Please log in again.'
                };
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.IDENTITY_SERVICE.AUTH_CONTROLLER.CHANGE_PASSWORD_SIMPLE}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionId}`,
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },
};


