
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { useAuthStore } from '../../../store/authStore';
import ApiService from '../../../services/apiService';

export const UnauthorizedModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { clearSession } = useAuthStore();

    useEffect(() => {
        // Устанавливаем обработчик для 401 ошибок
        ApiService.setUnauthorizedHandler(() => {
            setIsOpen(true);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        clearSession();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <h3>Session Expired</h3>
                <p>Your session has expired. Please log in again to continue.</p>
                <div className="modal-actions">
                    <Button variant="primary" onClick={handleConfirm}>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};