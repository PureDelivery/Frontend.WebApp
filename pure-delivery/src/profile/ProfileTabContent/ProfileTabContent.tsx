import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TabType } from '../../pages/ProfilePage';
import { CustomerProfileDto } from '../../interfaces/CustomerProfileDto';
import { CustomerSessionDto } from '../../store/authStore';
import { ProfileInfoTab } from '..//ProfileInfoTab/ProfileInfoTab';
import { AddressesTab } from '..//AddressesTab/AddressesTab';
import { OrdersTab } from '..//OrdersTab/OrdersTab';
import { LoyaltyTab } from '..//LoyaltyTab/LoyaltyTab';
import { AchievementsTab } from '..//AchievementsTab/AchievementsTab';

interface ProfileTabContentProps {
    activeTab: TabType;
    profile: CustomerProfileDto | null;
    isLoading: boolean;
    customer: CustomerSessionDto | null;
    onProfileUpdate: (profile: CustomerProfileDto) => void;
    onRefreshProfile: () => Promise<void>;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
                                                                        activeTab,
                                                                        profile,
                                                                        isLoading,
                                                                        customer,
                                                                        onProfileUpdate,
                                                                        onRefreshProfile
                                                                    }) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <ProfileInfoTab
                        profile={profile}
                        isLoading={isLoading}
                        customer={customer}
                        onProfileUpdate={onProfileUpdate}
                        onRefreshProfile={onRefreshProfile}
                    />
                );
            case 'addresses':
                return (
                    <AddressesTab
                        customer={customer}
                        isLoading={isLoading}
                    />
                );
            case 'orders':
                return <OrdersTab customer={customer} />;
            case 'loyalty':
                return (
                    <LoyaltyTab
                        profile={profile}
                        customer={customer}
                        isLoading={isLoading}
                    />
                );
            case 'achievements':
                return <AchievementsTab customer={customer} />;
            default:
                return null;
        }
    };

    return (
        <div className="tab-content">
            <AnimatePresence mode="wait" key={activeTab}>
                {renderTabContent()}
            </AnimatePresence>
        </div>
    );
};