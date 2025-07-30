// Обновленный src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

// Route Guards
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { Toaster } from 'react-hot-toast';

import './App.scss';
import EmailVerificationPage from "./pages/EmailVerificationPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import {UnauthorizedModal} from "./components/modals/UnauthorizedModal/UnauthorizedModal";

export function App() {
    const { theme, setTheme } = useThemeStore();
    const { isAuthenticated, isEmailConfirmed } = useAuthStore();

    // Применяем тему при загрузке
    useEffect(() => {
        setTheme(theme);
    }, [theme, setTheme]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Главная - доступна всем */}
                    <Route path="/" element={<HomePage />} />

                    {/* Публичные роуты - только для НЕ залогиненных */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/verify-email"
                        element={
                            <PublicRoute>
                                <EmailVerificationPage />
                            </PublicRoute>
                        }
                    />

                    {/* Защищенные роуты - только для залогиненных С подтвержденным email */}
                    <Route path="/main" element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    }/>

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    {/* Fallback редиректы */}
                    <Route
                        path="*"
                        element={
                            // Если залогинен и email подтвержден -> дашборд
                            // Иначе -> Login
                            isAuthenticated && isEmailConfirmed
                                ? <Navigate to="/main" replace />
                                : <Navigate to="/login" replace />
                        }
                    />
                </Routes>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#4ade80',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <UnauthorizedModal />
            </div>
        </Router>
    );
}