import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Camera, User, Mail, Gift, Calendar, Star, Phone, CreditCard, ChevronDown, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { UserAvatar } from '../../components/ui/UserAvatar/UserAvatar';
import { CustomerProfileDto, UpdateProfileRequest } from '../../interfaces/CustomerProfileDto';
import { CustomerSessionDto } from '../../store/authStore';
import { profileService } from '../../services/profileService';
import toast from 'react-hot-toast';
import './ProfileInfoTab.scss';
import { ChangePasswordModal } from '../../components/modals/PasswordModals/ChangePassword/ChangePasswordModal';

interface ProfileInfoTabProps {
    profile: CustomerProfileDto | null;
    isLoading: boolean;
    customer: CustomerSessionDto | null;
    onProfileUpdate: (profile: CustomerProfileDto) => void;
    onRefreshProfile: () => Promise<void>;
}

// Dropdown компонент для Payment Method
const PaymentMethodDropdown: React.FC<{
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label?: string;
}> = ({ value, onChange, disabled = false, label }) => {
    const [isOpen, setIsOpen] = useState(false);

    const paymentMethods = [
        { value: '', label: 'Select payment method' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'apple_pay', label: 'Apple Pay' },
        { value: 'google_pay', label: 'Google Pay' },
        { value: 'cash', label: 'Cash on Delivery' },
        { value: 'bank_transfer', label: 'Bank Transfer' }
    ];

    const selectedMethod = paymentMethods.find(method => method.value === value);

    const handleSelect = (methodValue: string) => {
        onChange(methodValue);
        setIsOpen(false);
    };

    return (
        <div className="payment-dropdown-container">
            {label && <label className="dropdown-label">{label}</label>}
            <div className={`payment-dropdown ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}>
                <button
                    type="button"
                    className="dropdown-trigger"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <span className="selected-text">
                        {selectedMethod?.label || 'Select payment method'}
                    </span>
                    <ChevronDown size={16} className={`dropdown-icon ${isOpen ? 'rotated' : ''}`} />
                </button>

                {isOpen && !disabled && (
                    <div className="dropdown-menu">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.value}
                                type="button"
                                className={`dropdown-item ${value === method.value ? 'selected' : ''}`}
                                onClick={() => handleSelect(method.value)}
                            >
                                {method.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
                                                                  profile,
                                                                  isLoading,
                                                                  customer,
                                                                  onProfileUpdate,
                                                                  onRefreshProfile
                                                              }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        preferredPaymentMethod: ''
    });
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    // Инициализация формы при изменении профиля
    React.useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
                dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
                preferredPaymentMethod: profile.preferredPaymentMethod || ''
            });
        }
    }, [profile]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Отменяем изменения
            if (profile) {
                setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    phone: profile.phone || '',
                    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
                    preferredPaymentMethod: profile.preferredPaymentMethod || ''
                });
            }
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: keyof UpdateProfileRequest) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handlePaymentMethodChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            preferredPaymentMethod: value
        }));
    };

    const handleSaveProfile = async () => {
        if (!customer?.id) return;

        setIsUpdating(true);

        try {
            const result = await profileService.updateProfile(customer.id, formData);

            if (result.isSuccess) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                await onRefreshProfile(); // Перезагружаем профиль
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Error updating profile:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !customer?.id) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size cannot exceed 5MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPEG, PNG and WebP images are allowed');
            return;
        }

        setIsUploadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await profileService.uploadAvatar(customer.id, formData);

            if (result.isSuccess) {
                toast.success('Avatar updated successfully!');
                await onRefreshProfile(); // Перезагружаем профиль
            } else {
                toast.error(result.error || 'Failed to upload avatar');
            }
        } catch (error) {
            toast.error('Error uploading avatar');
            console.error('Error uploading avatar:', error);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-info-tab loading"
            >
                <Card className="loading-card">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <p>Loading profile...</p>
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
            className="profile-info-tab"
        >
            {/* Profile Header */}
            <div className="profile-section-header">
                <h2>My Profile</h2>
                <Button
                    variant={isEditing ? "outline" : "primary"}
                    onClick={handleEditToggle}
                    disabled={isUpdating}
                >
                    <Edit size={16} />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
            </div>

            {/* Avatar Section */}
            <Card className="avatar-section">
                <div className="avatar-container">
                    <div className="avatar-wrapper">
                        <UserAvatar
                            src={profile?.avatarUrl}
                            alt={`${customer?.fullName} avatar`}
                            size="xl"
                        />

                        {isEditing && (
                            <label className="avatar-upload">
                                <Camera size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploadingAvatar}
                                    style={{ display: 'none' }}
                                />
                                {isUploadingAvatar && <div className="upload-spinner"></div>}
                            </label>
                        )}
                    </div>

                    <div className="avatar-info">
                        <h3>{profile?.firstName} {profile?.lastName}</h3>
                        <p>{customer?.email}</p>
                        <div className="user-stats">
                            <span className="stat">
                                <Star size={14} />
                                {profile?.userGrade?.toFixed(1) || '0.0'} ({profile?.totalRatings || 0} reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Profile Form */}
            <Card className="profile-form-card">
                <div className="form-grid">
                    <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        disabled={!isEditing || isUpdating}
                        required
                    />

                    <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        disabled={!isEditing || isUpdating}
                        required
                    />

                    <Input
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        disabled={!isEditing || isUpdating}
                    />

                    <Input
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange('dateOfBirth')}
                        disabled={!isEditing || isUpdating}
                    />

                    <PaymentMethodDropdown
                        label="Preferred Payment Method"
                        value={formData.preferredPaymentMethod!}
                        onChange={handlePaymentMethodChange}
                        disabled={!isEditing || isUpdating}
                    />
                </div>

                {isEditing && (
                    <div className="form-actions">
                        <Button
                            onClick={handleSaveProfile}
                            isLoading={isUpdating}
                            disabled={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </Card>

            {/* Account Info */}
            <Card className="account-info-card">
                <h4>Account Information</h4>
                <div className="info-grid">
                    <div className="info-item">
                        <Mail size={16} />
                        <span>Email: {customer?.email}</span>
                    </div>
                    <div className="info-item">
                        <Gift size={16} />
                        <span>Loyalty Points: {profile?.loyaltyPoints || 0}</span>
                    </div>
                    <div className="info-item">
                        <Calendar size={16} />
                        <span>Member since: {formatDate(profile?.createdAt)}</span>
                    </div>
                    <div className="info-item">
                        <Calendar size={16} />
                        <span>Last order: {formatDate(profile?.lastOrderDate)}</span>
                    </div>
                    <div className="account-actions">
                        <Button
                            variant="outline"
                            onClick={() => setIsChangePasswordModalOpen(true)}
                        >
                            <Lock size={16} />
                            Change Password
                        </Button>
                    </div>
                </div>
            </Card>
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />
        </motion.div>
    );
};