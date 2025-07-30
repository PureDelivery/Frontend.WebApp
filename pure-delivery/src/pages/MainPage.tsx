import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { profileService } from '../services/profileService';
import { CustomerProfileDto } from '../interfaces/CustomerProfileDto';
import { PageHeader } from '../components/main/PageHeader/PageHeader';
import { QuickStats } from '../components/main/QuickStats/QuickStats';
import { QuickActions } from '../components/main/QuickActions/QuickActions';
import { ComingSoonSection } from '../components/main/ComingSoonSection/ComingSoonSection';
import '../styles/MainPage.scss';

const MainPage: React.FC = () => {
    const { customer } = useAuthStore();
    const [profile, setProfile] = useState<CustomerProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [customer?.id]);

    const loadProfile = async () => {
        if (!customer?.id) {
            setIsLoading(false);
            return;
        }

        try {
            const result = await profileService.getCustomerWithProfile(customer.id);
            if (result.isSuccess && result.data?.profile) {
                setProfile(result.data.profile);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="page main-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-content">
                <PageHeader
                    title={`Welcome back, ${customer?.fullName.split(' ')[0]}!`}
                    subtitle="What would you like to do today?"
                    showThemeToggle
                    showLogout
                    showAvatar
                    profile={profile}
                />

                <QuickStats
                    profile={profile}
                    isLoading={isLoading}
                />

                <QuickActions
                    profile={profile}
                    isLoading={isLoading}
                />

                <ComingSoonSection />
            </div>
        </motion.div>
    );
};

export default MainPage;