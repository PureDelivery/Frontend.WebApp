import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card/Card';
import { RegisterForm } from '../components/forms/RegisterForm/RegisterForm';
import {authService} from "../services/authService";
import toast from "react-hot-toast";
import { RegisterFormData } from '../services/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterFormData) => {
        // Проверка паролей
        if (data.password !== data.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        const loadingToast = toast.loading('Creating account...');

        const { confirmPassword, ...requestData } = data;

        const result = await authService.createCustomer(requestData);

        toast.dismiss(loadingToast);

        if (result.isSuccess) {
            toast.success('Account created! Check your email for verification code.');
            navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } else {
            toast.error(result.error || 'Registration failed');
        }
    };

    return (
        <motion.div
            className="page auth-page"
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
                            <h1>Create Account</h1>
                            <p>Join Pure Delivery and start ordering</p>
                        </div>

                        {/* Форма */}
                        <RegisterForm
                            onSubmit={handleRegister}
                            isLoading={false}
                        />

                        {/* Футер */}
                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link-text">
                                    Sign in
                                </Link>
                            </p>
                            <Link to="/" className="back-link">
                                ← Back to Home
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RegisterPage;