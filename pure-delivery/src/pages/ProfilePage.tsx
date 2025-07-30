import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { profileService } from '../services/profileService';
import { CustomerProfileDto } from '../interfaces/CustomerProfileDto';
import { ThemeToggle } from '../components/ui/ThemeToggle/ThemeToggle';
import { Button } from '../components/ui/Button/Button';
import { ProfileTabs } from '..//profile/ProfileTabs/ProfileTabs';
import { ProfileTabContent } from '..//profile/ProfileTabContent/ProfileTabContent';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import '../styles/ProfilePage.scss';
import {CustomerProfileInfoDto} from "../interfaces/CustomerProfileInfoDto";

export type TabType = 'profile' | 'addresses' | 'orders' | 'loyalty' | 'achievements';

const ProfilePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { customer, clearSession } = useAuthStore();

    const activeTab = (searchParams.get('tab') as TabType) || 'profile';

    const handleTabChange = (tab: TabType) => {
        setSearchParams({ tab });
    };

    const handleLogout = () => {
        authService.logout();
        clearSession();
        toast.success('Logged out successfully');
        window.location.href = '/';
    };

    return (
        <motion.div
            className="page profile-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-content">
                {/* Header */}
                <div className="profile-header">
                    <div className="header-left">
                        <Link to="/main" className="back-button">
                            <ArrowLeft size={20} />
                            Back to Main
                        </Link>
                        <h1>Profile Settings</h1>
                    </div>

                    <div className="header-right">
                        <ThemeToggle />
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Tab Content */}
                <ProfileTabContent
                    activeTab={activeTab}
                    customer={customer}
                />
            </div>
        </motion.div>
    );
};

export default ProfilePage;