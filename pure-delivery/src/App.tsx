import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore } from './store/themeStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.scss';

export function App() {
    const { theme, setTheme } = useThemeStore();

    // Инициализируем тему при загрузке
    useEffect(() => {
        setTheme(theme);
    }, [theme, setTheme]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Главная страница с переключателем темы */}
                    <Route path="/" element={<HomePage />} />

                    {/* Страницы аутентификации */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Перенаправление на главную для неизвестных путей */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}