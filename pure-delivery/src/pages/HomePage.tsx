import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react"
import { useThemeStore } from '../store/themeStore';

const HomePage: React.FC = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <motion.div
            className="page home-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-content">
                <h1>Pure Delivery</h1>
                <p>Fresh food, delivered fast</p>

                <div className="theme-controls">
                    <button onClick={toggleTheme} className="theme-button">
                        Current: {theme} theme
                    </button>
                </div>

                <div className="auth-links">
                    <Link to="/login" className="auth-link">
                        Login
                    </Link>
                    <Link to="/register" className="auth-link">
                        Register
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default HomePage;