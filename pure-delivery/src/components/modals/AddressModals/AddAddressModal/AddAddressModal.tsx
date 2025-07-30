// components/modals/AddAddressModal/AddAddressModal.tsx

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { BaseAddressModal, BaseAddressFormData } from '../BaseAddressModal';

export interface AddAddressFormData extends BaseAddressFormData {
    isDefault: boolean;
}

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: AddAddressFormData) => Promise<void>;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
                                                                    isOpen,
                                                                    onClose,
                                                                    onSave
                                                                }) => {
    const [isDefault, setIsDefault] = useState(false);

    const initialData: BaseAddressFormData = {
        label: '',
        fullAddress: '',
        city: '',
        postalCode: '',
        building: '',
        apartment: '',
        floor: '',
        latitude: undefined,
        longitude: undefined,
        deliveryInstructions: '',
    };

    const handleSave = async (baseData: BaseAddressFormData) => {
        const fullData: AddAddressFormData = {
            ...baseData,
            isDefault
        };
        await onSave(fullData);
    };

    const handleClose = () => {
        setIsDefault(false); // Сбрасываем при закрытии
        onClose();
    };

    return (
        <BaseAddressModal
            isOpen={isOpen}
            onClose={handleClose}
            onSave={handleSave}
            title="Add New Address"
            submitButtonText="Add Address"
            initialData={initialData}
        >
            {/* Дополнительное поле для isDefault */}
            <div className="form-row">
                <div className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        id="isDefault"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <label htmlFor="isDefault" className="checkbox-label">
                        <Star size={16} />
                        Set as default address
                    </label>
                </div>
            </div>
        </BaseAddressModal>
    );
};