import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Button } from '../components/ui/Button/Button';
import {ThemeToggle} from "../components/ui/ThemeToggle/ThemeToggle";
import MainLogo from '../components/MainLogo/MainLogo';

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
                <MainLogo theme={theme}/>

                <ThemeToggle/>
                <div className="auth-links">
                    <Link to="/login">
                        <Button variant="primary">
                            Login
                        </Button>
                    </Link>

                    <Link to="/register">
                        <Button variant="outline">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default HomePage;