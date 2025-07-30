import React from 'react';
import { User, MapPin, ShoppingBag, Gift, Award } from 'lucide-react';
import { TabType } from '../../pages/ProfilePage';
import './ProfileTabs.scss';

interface Tab {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

interface ProfileTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs: Tab[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'loyalty', label: 'Loyalty', icon: Gift },
    { id: 'achievements', label: 'Achievements', icon: Award }
];

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="profile-tabs">
            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <IconComponent size={18} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};