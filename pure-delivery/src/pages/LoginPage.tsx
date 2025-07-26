import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card/Card';
import { LoginForm } from '../components/forms/LoginForm/LoginForm';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (data: { email: string; password: string }) => {
        console.log('Login data:', data);
        // Здесь будет логика логина
        navigate('/');
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
                            <h1>Welcome Back</h1>
                            <p>Sign in to your account</p>
                        </div>

                        {/* Форма */}
                        <LoginForm
                            onSubmit={handleLogin}
                            isLoading={false}
                        />

                        {/* Футер */}
                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="auth-link-text">
                                    Sign up
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

export default LoginPage;