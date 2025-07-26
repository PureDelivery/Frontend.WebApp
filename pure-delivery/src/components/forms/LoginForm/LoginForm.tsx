import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => void;
    isLoading?: boolean;
    error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
                                                        onSubmit,
                                                        isLoading = false,
                                                        error
                                                    }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
            />

            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
            />

            <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={!email || !password}
            >
                Sign In
            </Button>
        </form>
    );
};