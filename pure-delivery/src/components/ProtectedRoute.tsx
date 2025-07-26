import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireEmailConfirmation?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requireEmailConfirmation = false
                                                              }) => {
    const { isAuthenticated, isEmailConfirmed } = useAuthStore();
    const location = useLocation();

    // Если не залогинен - отправляем на логин
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Если требуется подтверждение email, но его нет - на верификацию
    if (requireEmailConfirmation && !isEmailConfirmed) {
        return <Navigate to="/verify-email" replace />;
    }

    // Все хорошо - показываем контент
    return <>{children}</>;
};
