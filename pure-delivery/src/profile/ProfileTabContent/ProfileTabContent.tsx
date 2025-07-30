import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TabType } from '../../pages/ProfilePage';
import { CustomerSessionDto } from '../../store/authStore';
import { ProfileInfoTab } from '../ProfileInfoTab/ProfileInfoTab';
import { AddressesTab } from '../AddressesTab/AddressesTab';
import { OrdersTab } from '../OrdersTab/OrdersTab';
import { LoyaltyTab } from '../LoyaltyTab/LoyaltyTab';
import { AchievementsTab } from '../AchievementsTab/AchievementsTab';

interface ProfileTabContentProps {
    activeTab: TabType;
    customer: CustomerSessionDto | null;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
                                                                        activeTab,
                                                                        customer
                                                                    }) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileInfoTab />;
            case 'addresses':
                return <AddressesTab customer={customer} />;
            case 'orders':
                return <OrdersTab customer={customer} />;
            case 'loyalty':
                return <LoyaltyTab />;
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