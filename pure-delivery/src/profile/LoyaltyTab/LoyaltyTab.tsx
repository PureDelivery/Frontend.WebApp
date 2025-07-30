import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { CustomerLoyaltyDto } from '../../interfaces/CustomerLoyaltyDto';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import './LoyaltyTab.scss';
import {profileService} from "../../services/profileService";

interface LoyaltyTabProps {
    isLoading?: boolean;
}

export const LoyaltyTab: React.FC<LoyaltyTabProps> = ({ isLoading: externalLoading }) => {
    const { customer } = useAuthStore();
    const [loyaltyData, setLoyaltyData] = useState<CustomerLoyaltyDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (customer?.id) {
            loadLoyaltyData();
        }
    }, [customer?.id]);

    const loadLoyaltyData = async () => {
        if (!customer?.id) return;

        try {
            setIsLoading(true);
            const response = await profileService.getCustomerLoyalty(customer.id);

            if (response.isSuccess && response.data) {
                setLoyaltyData(response.data);
            } else {
                toast.error('Failed to load loyalty data');
            }
        } catch (error) {
            console.error('Error loading loyalty data:', error);
            toast.error('Failed to load loyalty data');
        } finally {
            setIsLoading(false);
        }
    };

    const loading = isLoading || externalLoading;

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="loyalty-tab loading"
            >
                <Card className="loading-card">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <p>Loading loyalty info...</p>
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
            className="loyalty-tab"
        >
            <h2>Loyalty Program</h2>
            <div style={{color: "red"}}>ADD LOYALTY MICROSERVICE</div>

            {/* Current Points */}
            <Card className="loyalty-balance-card">
                <div className="balance-header">
                    <Gift size={32} />
                    <div>
                        <h3>Current Balance</h3>
                        <p className="balance-amount">{loyaltyData?.loyaltyPoints || 0} points</p>
                    </div>
                </div>
            </Card>

            {/* Loyalty Info */}
            <div className="loyalty-grid">
                <Card className="loyalty-info-card">
                    <TrendingUp size={24} />
                    <h4>How to Earn</h4>
                    <ul>
                        <li>1 point per $1 spent</li>
                        <li>Bonus points on special occasions</li>
                        <li>Referral rewards</li>
                    </ul>
                </Card>

                <Card className="loyalty-info-card">
                    <Award size={24} />
                    <h4>How to Redeem</h4>
                    <ul>
                        <li>100 points = $5 discount</li>
                        <li>500 points = Free delivery for a month</li>
                        <li>1000 points = Special rewards</li>
                    </ul>
                </Card>

                <Card className="loyalty-info-card">
                    <Calendar size={24} />
                    <h4>Recent Activity</h4>
                    <p>No recent activity</p>
                </Card>
            </div>
        </motion.div>
    );
};