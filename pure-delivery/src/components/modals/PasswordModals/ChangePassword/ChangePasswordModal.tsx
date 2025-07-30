import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../ui/Button/Button';
import { Input } from '../../../ui/Input/Input';
import { authService } from '../../../../services/authService';
import toast from 'react-hot-toast';
import './ChangePasswordModal.scss';
import {useAuthStore} from "../../../../store/authStore";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                        }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const customerId = useAuthStore().customer?.id ?? '';
    // Form data
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required';
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

        if (currentPassword && newPassword && currentPassword === newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await authService.changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
                customerId
            });

            if (result.isSuccess) {
                toast.success('Password changed successfully!');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                toast.error(result.error || 'Failed to change password');
                // If current password is wrong, highlight that field
                if (result.error?.toLowerCase().includes('current') || result.error?.toLowerCase().includes('wrong')) {
                    setErrors({ currentPassword: 'Current password is incorrect' });
                }
            }
        } catch (error) {
            toast.error('Error changing password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    className="change-password-modal simple"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e: Event) => e.stopPropagation()}
                >
                    <div className="modal-header simple">
                        <h3>Change Password</h3>
                        <button className="close-button" onClick={handleClose} disabled={isLoading}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="modal-content">
                        <div className="form-icon">
                            <Lock size={48} />
                        </div>

                        <p>Enter your current password and choose a new one.</p>

                        <div className="form-fields">
                            <div className="password-field">
                                <Input
                                    label="Current Password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    error={errors.currentPassword}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <div className="password-field">
                                <Input
                                    label="New Password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    error={errors.newPassword}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <div className="password-field">
                                <Input
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <div className="modal-actions">
                            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleChangePassword}
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};