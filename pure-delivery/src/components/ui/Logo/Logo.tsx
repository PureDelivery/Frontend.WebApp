import React from 'react';
import './Logo.scss';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({
                                              size = 'md',
                                              showText = true,
                                              className
                                          }) => {
    return (
        <div className={`logo logo--${size} ${className}`}>
            {/* SVG иконка пиццы/еды */}
            <div className="logo__icon">
                <svg viewBox="0 0 64 64" fill="none">
                    {/* Пицца иконка */}
                    <circle cx="32" cy="32" r="28" fill="url(#gradient)" stroke="var(--text-primary)" strokeWidth="2"/>

                    {/* Кусочки пиццы */}
                    <path d="M32 4 L32 32 L58 20 A28 28 0 0 0 32 4" fill="rgba(255,255,255,0.2)"/>
                    <path d="M32 32 L58 20 L48 48 A28 28 0 0 0 58 20" fill="rgba(255,255,255,0.1)"/>

                    {/* Начинка */}
                    <circle cx="25" cy="25" r="3" fill="#ff6b6b"/>
                    <circle cx="40" cy="28" r="2.5" fill="#4ecdc4"/>
                    <circle cx="30" cy="40" r="2" fill="#ffe66d"/>
                    <circle cx="45" cy="40" r="2.5" fill="#ff6b6b"/>

                    {/* Градиент */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea"/>
                            <stop offset="100%" stopColor="#764ba2"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {showText && (
                <div className="logo__text">
                    <span className="logo__name">Pure Delivery</span>
                    <span className="logo__tagline">Fresh & Fast</span>
                </div>
            )}
        </div>
    );
};