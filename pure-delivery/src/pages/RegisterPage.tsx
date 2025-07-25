import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react"

const RegisterPage: React.FC = () => {
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
                    <h1>Create Account</h1>
                    <p>Join Pure Delivery today</p>

                    <form className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone (optional)</label>
                            <input
                                type="tel"
                                placeholder="Your phone number"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Create password"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="auth-button">
                            Create Account
                        </button>
                    </form>

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
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RegisterPage;