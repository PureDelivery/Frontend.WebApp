// components/modals/BaseAddressModal/BaseAddressModal.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { MapPicker } from '../../ui/MapPicker/MapPicker';
import './BaseAddressModal.scss';

export interface BaseAddressFormData {
    label: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    building?: string;
    apartment?: string;
    floor?: string;
    latitude?: number;
    longitude?: number;
    deliveryInstructions?: string;
}

interface BaseAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: any) => Promise<void>;
    title: string;
    submitButtonText: string;
    initialData: BaseAddressFormData;
    children?: React.ReactNode; // Для дополнительных полей
}

export const BaseAddressModal: React.FC<BaseAddressModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onSave,
                                                                      title,
                                                                      submitButtonText,
                                                                      initialData,
                                                                      children
                                                                  }) => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [formData, setFormData] = useState<BaseAddressFormData>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<BaseAddressFormData>>({});

    React.useEffect(() => {
        setFormData(initialData);
        setErrors({});
    }, [initialData, isOpen]);

    const handleInputChange = (field: keyof BaseAddressFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Очищаем ошибку при вводе
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<BaseAddressFormData> = {};

        if (!formData.label.trim()) {
            newErrors.label = 'Label is required';
        }
        if (!formData.fullAddress.trim()) {
            newErrors.fullAddress = 'Full address is required';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving address:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={handleClose}>
                <motion.div
                    className="address-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e: Event) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="modal-header">
                        <div className="header-content">
                            <MapPin size={24} />
                            <h2>{title}</h2>
                        </div>
                        <button
                            className="close-button"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-grid">
                            <div className="form-row">
                                <Input
                                    label="Address Label"
                                    value={formData.label}
                                    onChange={handleInputChange('label')}
                                    placeholder="e.g., Home, Work, Office"
                                    required
                                    error={errors.label}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-row">
                                <Input
                                    label="Full Address"
                                    value={formData.fullAddress}
                                    onChange={handleInputChange('fullAddress')}
                                    placeholder="Street, house number"
                                    required
                                    error={errors.fullAddress}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-row-split">
                                <Input
                                    label="City"
                                    value={formData.city}
                                    onChange={handleInputChange('city')}
                                    placeholder="City name"
                                    required
                                    error={errors.city}
                                    disabled={isLoading}
                                />
                                <Input
                                    label="Postal Code"
                                    value={formData.postalCode}
                                    onChange={handleInputChange('postalCode')}
                                    placeholder="Postal code"
                                    required
                                    error={errors.postalCode}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-row-split">
                                <Input
                                    label="Building"
                                    value={formData.building || ''}
                                    onChange={handleInputChange('building')}
                                    placeholder="Building number"
                                    disabled={isLoading}
                                />
                                <Input
                                    label="Apartment"
                                    value={formData.apartment || ''}
                                    onChange={handleInputChange('apartment')}
                                    placeholder="Apartment number"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-row">
                                <Input
                                    label="Floor"
                                    value={formData.floor || ''}
                                    onChange={handleInputChange('floor')}
                                    placeholder="Floor number"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-row">
                                <Input
                                    label="Delivery Instructions"
                                    value={formData.deliveryInstructions || ''}
                                    onChange={handleInputChange('deliveryInstructions')}
                                    placeholder="Special delivery instructions, gate codes, etc."
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-row">
                                <div className="coordinates-section">
                                    <div className="coordinates-inputs">
                                        <Input
                                            label="Latitude"
                                            type="number"
                                            step="any"
                                            value={formData.latitude || ''}
                                            onChange={handleInputChange('latitude')}
                                            placeholder="0.0000"
                                            disabled={isLoading}
                                        />
                                        <Input
                                            label="Longitude"
                                            type="number"
                                            step="any"
                                            value={formData.longitude || ''}
                                            onChange={handleInputChange('longitude')}
                                            placeholder="0.0000"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsMapOpen(true)}
                                        disabled={isLoading}
                                        className="map-button"
                                    >
                                        <MapPin size={16} />
                                        Select on Map
                                    </Button>
                                </div>
                            </div>

                            {/* Дополнительные поля из children */}
                            {children}
                        </div>

                        {/* Actions */}
                        <div className="modal-actions">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {submitButtonText}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>

            <MapPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={(lat, lng, address) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                        fullAddress: prev.fullAddress || address || prev.fullAddress
                    }));
                }}
                initialLat={formData.latitude}
                initialLng={formData.longitude}
            />
        </AnimatePresence>
    );
};