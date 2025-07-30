// components/modals/EditAddressModal/EditAddressModal.tsx

import React from 'react';
import {CustomerAddressDto} from "../../../../interfaces/CustomerProfileDto";
import {BaseAddressFormData, BaseAddressModal} from "../BaseAddressModal";

interface EditAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: BaseAddressFormData) => Promise<void>;
    address: CustomerAddressDto | null;
}

export const EditAddressModal: React.FC<EditAddressModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onSave,
                                                                      address
                                                                  }) => {
    const getInitialData = (): BaseAddressFormData => {
        if (!address) {
            return {
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
        }

        return {
            label: address.label || '',
            fullAddress: address.fullAddress || '',
            city: address.city || '',
            postalCode: address.postalCode || '',
            building: address.building || '',
            apartment: address.apartment || '',
            floor: address.floor || '',
            latitude: address.latitude || undefined,
            longitude: address.longitude || undefined,
            deliveryInstructions: address.deliveryInstructions || '',
        };
    };

    return (
        <BaseAddressModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={onSave}
            title="Edit Address"
            submitButtonText="Save Changes"
            initialData={getInitialData()}
        >
            {/* Никаких дополнительных полей для редактирования */}
        </BaseAddressModal>
    );
};