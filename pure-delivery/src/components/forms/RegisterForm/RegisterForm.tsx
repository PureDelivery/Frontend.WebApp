import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import {RegisterFormData} from "../../../services/authService";

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => void;
    isLoading?: boolean;
    error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
                                                              onSubmit,
                                                              isLoading = false,
                                                              error
                                                          }) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });

    const [validationErrors, setValidationErrors] = useState<Partial<RegisterFormData>>({});

    const handleChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));

        // Очищаем ошибку для этого поля
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validate = (): boolean => {
        const errors: Partial<RegisterFormData> = {};

        if (!formData.firstName) errors.firstName = 'First name is required';  // Добавь
        if (!formData.lastName) errors.lastName = 'Last name is required';    // Добавь
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const isFormValid = formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        formData.firstName &&
        formData.lastName;

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="form-row">
                <Input
                    label="First Name"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    disabled={isLoading}
                    error={validationErrors.firstName}
                    required={true}
                />

                <Input
                    label="Last Name"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    disabled={isLoading}
                    error={validationErrors.lastName}
                    required={true}
                />
            </div>

            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                disabled={isLoading}
                error={validationErrors.email}
            />

            <Input
                label="Phone (optional)"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange('phone')}
                disabled={isLoading}
                error={validationErrors.phone}
            />

            <Input
                label="Date of Birth (optional)"  // Добавь эту строку
                type="date"
                placeholder="Date of Birth (optional)"
                value={formData.dateOfBirth || ''}
                onChange={handleChange('dateOfBirth')}
                max={new Date().toISOString().split('T')[0]}
            />
            <Input
                label="Password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange('password')}
                required
                disabled={isLoading}
                error={validationErrors.password}
            />

            <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                disabled={isLoading}
                error={validationErrors.confirmPassword}
            />

            <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={!isFormValid}
            >
                Create Account
            </Button>
        </form>
    );
};