import React from 'react';
import clsx from 'clsx';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  size = 'md',
                                                  fullWidth = false,
                                                  isLoading = false,
                                                  className,
                                                  children,
                                                  disabled,
                                                  ...props
                                              }) => {
    return (
        <button
            className={clsx(
                'btn',
                `btn--${variant}`,
                `btn--${size}`,
                {
                    'btn--full-width': fullWidth,
                    'btn--loading': isLoading,
                },
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};