import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card/Card';
import { LoginForm } from '../components/forms/LoginForm/LoginForm';
import {authService} from "../services/authService";
import toast from "react-hot-toast";
import { useAuthStore } from '../store/authStore';
import { ForgotPasswordModal } from '../components/modals/PasswordModals/ForgotPassword/ForgotPasswordModal';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const setSession = useAuthStore(state => state.setSession);

    const handleLogin = async (data: { email: string; password: string }) => {
        setIsLoading(true);

        const loadingToast = toast.loading('Signing in...');

        const result = await authService.authenticate(data);

        toast.dismiss(loadingToast);
        setIsLoading(false); // Добавь это

        if (result.isSuccess && result.data) {
            // Преобразуем AuthDto в формат для Zustand store
            const customerSessionDto = {
                id: result.data.customerId,
                email: result.data.email,
                fullName: result.data.fullName,
                phone: result.data.profile?.phone || '',
                loyaltyPoints: result.data.profile?.loyaltyPoints || 0,
                defaultAddress: undefined // пока нет
            };

            setSession(
                result.data.sessionId,
                customerSessionDto,
                true // предполагаем что если логин прошел, то email подтвержден
            );

            toast.success('Welcome back! 🎉');
            navigate('/main');
        } else {
            toast.error(result.error || 'Login failed');
        }
    };

    return (
        <motion.div
            className="page-center auth-page"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <div className="auth-container">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <Card className="auth-card">
                        {/* Заголовок */}
                        <div className="auth-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to your account</p>
                        </div>

                        {/* Форма */}
                        <LoginForm
                            onSubmit={handleLogin}
                            isLoading={isLoading}
                        />

                        {/* Футер */}
                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="auth-link-text">
                                    Sign up
                                </Link>
                            </p>
                            <div>
                                <button
                                    type="button"
                                    className="auth-link-text forgot-password-link"
                                    onClick={() => setShowForgotPassword(true)}
                                    >
                                    Forgot your password?
                                </button>
                            </div>

                            <Link to="/" className="back-link">
                                ← Back to Home
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </motion.div>
    );
};

export default LoginPage;