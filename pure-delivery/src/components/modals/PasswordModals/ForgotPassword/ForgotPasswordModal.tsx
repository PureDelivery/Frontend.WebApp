import React, {useRef, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../ui/Button/Button';
import { Input } from '../../../ui/Input/Input';
import { authService } from '../../../../services/authService';
import toast from 'react-hot-toast';
import './ForgotPasswordModal.scss';
import {OtpInput} from "../../../ui/OtpInput/OtpInput";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'email' | 'verify' | 'success';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
                                                                            isOpen,
                                                                            onClose
                                                                        }) => {
    const [step, setStep] = useState<Step>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form data
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const newPasswordRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setStep('email');
        setEmail('');
        setOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateEmail = () => {
        const newErrors: {[key: string]: string} = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        if (!validateEmail()) return;

        setIsLoading(true);
        try {
            const result = await authService.requestForgotPassword(email);

            if (result.isSuccess) {
                toast.success('Reset code sent to your email');
                setStep('verify');
            } else {
                toast.error(result.error || 'Failed to send reset code');
            }
        } catch (error) {
            toast.error('Error sending reset code');
        } finally {
            setIsLoading(false);
        }
    };

    const validateResetForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!otpCode.trim()) {
            newErrors.otpCode = 'Reset code is required';
        } else if (otpCode.length !== 6) {
            newErrors.otpCode = 'Reset code must be 6 digits';
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validateResetForm()) return;

        setIsLoading(true);
        try {
            const result = await authService.changePasswordWithOtp({
                email,
                otpCode,
                newPassword
            });

            if (result.isSuccess) {
                toast.success('Password reset successfully!');
                setStep('success');
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                toast.error(result.error || 'Failed to reset password');
            }
        } catch (error) {
            toast.error('Error resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleOtpInputEnd = (value: string) => {
        setOtpCode(value);

        if (value.length === 6) {
            setTimeout(() => {
                newPasswordRef.current?.focus();
            }, 100);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'email':
                return (
                    <div className="step-content">
                        <div className="step-icon">
                            <Mail size={48} />
                        </div>
                        <h3>Reset Your Password</h3>
                        <p>Enter your email address and we'll send you a verification code to reset your password.</p>

                        <div className="form-fields">
                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                error={errors.email}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="step-actions">
                            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSendOtp}
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Send Reset Code
                            </Button>
                        </div>
                    </div>
                );

            case 'verify':
                return (
                    <div className="step-content">
                        <div className="step-icon">
                            <Lock size={48} />
                        </div>
                        <h3>Enter Reset Code</h3>
                        <p>Enter the 6-digit code sent to <strong>{email}</strong> and create your new password.</p>

                        <div className="form-fields">

                            <OtpInput value={otpCode} onChange={handleOtpInputEnd}/>

                            <div className="password-field">
                                <Input
                                    ref={newPasswordRef}
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    error={errors.newPassword}
                                    disabled={isLoading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <div className="password-field">
                                <Input
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    error={errors.confirmPassword}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="step-actions">
                            <Button variant="outline" onClick={() => setStep('email')} disabled={isLoading}>
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleResetPassword}
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Reset Password
                            </Button>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="step-content success">
                        <div className="step-icon success">
                            <div className="success-checkmark">✓</div>
                        </div>
                        <h3>Password Reset!</h3>
                        <p>Your password has been successfully reset. You can now log in with your new password.</p>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    className="forgot-password-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e: Event) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <div className="step-indicator">
                            <div className={`step ${step === 'email' ? 'active' : 'completed'}`}>1</div>
                            <div className="step-line"></div>
                            <div className={`step ${step === 'verify' ? 'active' : step === 'success' ? 'completed' : ''}`}>2</div>
                            <div className="step-line"></div>
                            <div className={`step ${step === 'success' ? 'active' : ''}`}>3</div>
                        </div>
                        {step !== 'success' && (
                            <button className="close-button" onClick={handleClose} disabled={isLoading}>
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {renderStepContent()}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};