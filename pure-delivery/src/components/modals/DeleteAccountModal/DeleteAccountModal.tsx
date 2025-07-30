
import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { useAuthStore } from '../../../store/authStore';
import { profileService } from '../../../services/profileService';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';
import './DeleteAccountModal.scss';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
    const { customer, clearSession } = useAuthStore();
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const handleDeleteAccount = async () => {
        if (!customer?.id) return;

        setIsDeletingAccount(true);

        try {
            const result = await profileService.deleteCustomer(customer.id);

            if (result.isSuccess) {
                toast.success('Account deleted successfully');
                // Логаут и очистка сессии
                await authService.logout();
                clearSession();
                // Редирект на главную
                window.location.href = '/';
            } else {
                toast.error(result.error || 'Failed to delete account');
            }
        } catch (error) {
            toast.error('Error deleting account');
            console.error('Error deleting account:', error);
        } finally {
            setIsDeletingAccount(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="delete-account-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-content">
                        <Trash2 size={24} className="danger-icon" />
                        <h3>Delete Account</h3>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="warning-section">
                        <p className="warning-text">
                            <strong>This action cannot be undone.</strong>
                        </p>
                        <p>
                            Are you sure you want to permanently delete your account?
                            All your data will be permanently removed, including:
                        </p>
                    </div>

                    <ul className="data-list">
                        <li>Profile information and settings</li>
                        <li>Order history and receipts</li>
                        <li>Loyalty points and rewards</li>
                        <li>Saved delivery addresses</li>
                        <li>Payment methods</li>
                    </ul>

                    <p className="final-warning">
                        Once deleted, this data cannot be recovered.
                    </p>
                </div>

                <div className="modal-actions">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeletingAccount}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        isLoading={isDeletingAccount}
                        disabled={isDeletingAccount}
                    >
                        <Trash2 size={16} />
                        Yes, Delete My Account
                    </Button>
                </div>
            </div>
        </div>
    );
};