import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
                                                            children,
                                                            redirectTo = '/dashboard'
                                                        }) => {
    const { isAuthenticated, isEmailConfirmed } = useAuthStore();

    // Если уже залогинен И email подтвержден - редирект на дашборд
    if (isAuthenticated && isEmailConfirmed) {
        return <Navigate to={redirectTo} replace />;
    }

    // Если залогинен, но email НЕ подтвержден - разрешаем доступ к публичным страницам
    // (например, к verify-email)

    // Показываем контент
    return <>{children}</>;
};