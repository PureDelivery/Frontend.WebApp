import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Edit, Trash2, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { CustomerSessionDto } from '../../store/authStore';
import { profileService } from '../../services/profileService';
import {
    AddAddressFormData,
    AddAddressModal
} from '../../components/modals/AddressModals/AddAddressModal/AddAddressModal';
import toast from 'react-hot-toast';
import './AddressesTab.scss';
import {CreateAddressRequest, UpdateAddressRequest} from "../../interfaces/AddressRequests";
import {CustomerAddressDto} from "../../interfaces/CustomerProfileDto";
import {EditAddressModal} from "../../components/modals/AddressModals/EditAddressModal/EditAddressModal";
import {BaseAddressFormData} from "../../components/modals/AddressModals/BaseAddressModal";

interface AddressesTabProps {
    customer: CustomerSessionDto | null;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const AddressesTab: React.FC<AddressesTabProps> = ({ customer }) => {
    const [addresses, setAddresses] = useState<CustomerAddressDto[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [isDeletingAddress, setIsDeletingAddress] = useState<string | null>(null);
    const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingAddress, setEditingAddress] = useState<CustomerAddressDto | null>(null);

    // Confirmation modal state
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        addressId: string | null;
    }>({ isOpen: false, addressId: null });

    useEffect(() => {
        loadAddresses();
    }, [customer?.id]);

    const loadAddresses = async () => {
        if (!customer?.id) {
            setIsLoadingAddresses(false);
            return;
        }

        try {
            const result = await profileService.getCustomerAddresses(customer.id);
            if (result.isSuccess && result.data) {
                // Сортируем адреса: сначала default, потом остальные
                const sortedAddresses = result.data.sort((a, b) => {
                    if (a.isDefault && !b.isDefault) return -1;
                    if (!a.isDefault && b.isDefault) return 1;
                    return 0;
                });
                setAddresses(sortedAddresses);
            } else {
                setAddresses([]);
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
            setAddresses([]);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        setConfirmationModal({ isOpen: true, addressId });
    };

    const confirmDeleteAddress = async () => {
        const addressId = confirmationModal.addressId;
        if (!addressId) return;

        setConfirmationModal({ isOpen: false, addressId: null });
        setIsDeletingAddress(addressId);

        try {
            const result = await profileService.deleteAddress(addressId);

            if (result.isSuccess) {
                toast.success('Address deleted successfully');
                await loadAddresses();
            } else {
                toast.error(result.error || 'Failed to delete address');
            }
        } catch (error) {
            toast.error('Error deleting address');
            console.error('Error deleting address:', error);
        } finally {
            setIsDeletingAddress(null);
        }
    };

    const handleSetDefaultAddress = async (addressId: string) => {
        if (!customer?.id) return;

        // Проверяем, является ли адрес уже дефолтным
        const address = addresses.find(a => a.id === addressId);
        if (address?.isDefault) {
            toast.error('Cant remove default address. Put other one as default first');
            return; // Выходим без запроса
        }

        setIsSettingDefault(addressId);

        try {
            const result = await profileService.setDefaultAddress(customer.id, addressId);

            if (result.isSuccess) {
                toast.success('Default address updated');
                await loadAddresses();
            } else {
                toast.error(result.error || 'Failed to set default address');
            }
        } catch (error) {
            toast.error('Error setting default address');
            console.error('Error setting default address:', error);
        } finally {
            setIsSettingDefault(null);
        }
    };

    const handleAddAddress = () => {
        setIsAddModalOpen(true);
    };

    const handleEditAddress = (address: CustomerAddressDto) => {
        setEditingAddress(address);
        setIsEditModalOpen(true);
    };

    const handleSaveNewAddress = async (addressData: AddAddressFormData) => {
        if (!customer?.id) return;

        const createRequest: CreateAddressRequest = {
            label: addressData.label,
            fullAddress: addressData.fullAddress,
            city: addressData.city,
            postalCode: addressData.postalCode,
            latitude: addressData.latitude,
            longitude: addressData.longitude,
            building: addressData.building || '',
            apartment: addressData.apartment || '',
            floor: addressData.floor || '',
            isDefault: addressData.isDefault,
            deliveryInstructions: addressData.deliveryInstructions
        };

        const result = await profileService.addAddress(customer.id, createRequest);
        if (result.isSuccess) {
            toast.success('Address added successfully');
            await loadAddresses();
        } else {
            toast.error(result.error || 'Failed to add address');
            throw new Error(result.error);
        }
    };

    const handleSaveEditAddress = async (addressData: BaseAddressFormData) => {
        if (!editingAddress) return;

        const updateRequest: UpdateAddressRequest = {
            label: addressData.label,
            fullAddress: addressData.fullAddress,
            city: addressData.city,
            postalCode: addressData.postalCode,
            latitude: addressData.latitude,
            longitude: addressData.longitude,
            building: addressData.building || '',
            apartment: addressData.apartment || '',
            floor: addressData.floor || '',
            deliveryInstructions: addressData.deliveryInstructions
        };

        const result = await profileService.updateAddress(editingAddress.id, updateRequest);
        if (result.isSuccess) {
            toast.success('Address updated successfully');
            await loadAddresses();
        } else {
            toast.error(result.error || 'Failed to update address');
            throw new Error(result.error);
        }
    };

    if (isLoadingAddresses) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="addresses-tab loading"
            >
                <Card className="loading-card">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <p>Loading addresses...</p>
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="addresses-tab"
        >
            {/* Header */}
            <div className="addresses-header">
                <h2>My Addresses</h2>
                <Button variant="primary" onClick={handleAddAddress}>
                    <Plus size={16} />
                    Add Address
                </Button>
            </div>

            {/* Addresses Grid */}
            <div className="addresses-grid">
                {addresses.length === 0 ? (
                    <Card className="empty-state">
                        <MapPin size={48} />
                        <h3>No addresses yet</h3>
                        <p>Add your first delivery address to get started</p>
                        <Button variant="primary" onClick={handleAddAddress}>
                            <Plus size={16} />
                            Add Address
                        </Button>
                    </Card>
                ) : (
                    addresses.map((address) => (
                        <Card key={address.id} className={`address-card ${address.isDefault ? 'default-address' : ''}`}>
                            <div className="address-header">
                                <h4>{address.label}</h4>
                                <div className="address-badges">
                                    <button
                                        className={`default-toggle ${address.isDefault ? 'active' : ''}`}
                                        onClick={() => handleSetDefaultAddress(address.id)}
                                        disabled={isSettingDefault === address.id}
                                        title={address.isDefault ? 'Default address' : 'Set as default'}
                                    >
                                        <Star size={16} className={address.isDefault ? 'filled' : ''} />
                                        {address.isDefault && <span>Default</span>}
                                        {isSettingDefault === address.id && <div className="mini-spinner"></div>}
                                    </button>
                                </div>
                            </div>

                            <div className="address-content">
                                <p className="address-text">{address.fullAddress}</p>
                                <p className="address-details">
                                    {address.building && `Building: ${address.building}`}
                                    {address.apartment && `, Apt: ${address.apartment}`}
                                    {address.floor && `, Floor: ${address.floor}`}
                                </p>
                                <p className="address-location">
                                    {address.city}, {address.postalCode}
                                </p>
                            </div>

                            <div className="address-actions">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditAddress(address)}
                                >
                                    <Edit size={14} />
                                    Edit
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    isLoading={isDeletingAddress === address.id}
                                    disabled={isDeletingAddress === address.id}
                                    className="delete-button"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Address Modal */}
            <AddAddressModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveNewAddress}
            />

            <EditAddressModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEditAddress}
                address={editingAddress}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ isOpen: false, addressId: null })}
                onConfirm={confirmDeleteAddress}
                title="Delete Address"
                message="Are you sure you want to delete this address? This action cannot be undone."
            />
        </motion.div>
    );
};