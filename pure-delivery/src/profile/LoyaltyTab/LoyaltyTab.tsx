import React from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { CustomerSessionDto } from '../../store/authStore';
import { CustomerProfileDto } from '../../interfaces/CustomerProfileDto';
import './LoyaltyTab.scss';

interface LoyaltyTabProps {
    profile: CustomerProfileDto | null;
    customer: CustomerSessionDto | null;
    isLoading: boolean;
}

export const LoyaltyTab: React.FC<LoyaltyTabProps> = ({ profile, customer, isLoading }) => {
    if (isLoading) {
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

            <div style={{color: "red"}}>TEST LOYALTY FROM FRONTEND</div>

            {/* Current Points */}
            <Card className="loyalty-balance-card">
                <div className="balance-header">
                    <Gift size={32} />
                    <div>
                        <h3>Current Balance</h3>
                        <p className="balance-amount">{profile?.loyaltyPoints || 0} points</p>
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
