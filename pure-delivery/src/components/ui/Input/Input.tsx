import React, { forwardRef } from 'react';
import clsx from 'clsx';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
                                                                   label,
                                                                   error,
                                                                   hint,
                                                                   className,
                                                                   id,
                                                                   ...props
                                                               }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={clsx('input-group', className)}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={inputId}
                className={clsx('input-field', {
                    'input-field--error': error
                })}
                {...props}
            />

            {error && (
                <span className="input-error">{error}</span>
            )}

            {hint && !error && (
                <span className="input-hint">{hint}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';