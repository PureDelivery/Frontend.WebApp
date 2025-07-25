import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react"

const LoginPage: React.FC = () => {
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
                    className="auth-card"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>

                    <form className="auth-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="auth-button">
                            Sign In
                        </button>
                    </form>

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
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoginPage;
