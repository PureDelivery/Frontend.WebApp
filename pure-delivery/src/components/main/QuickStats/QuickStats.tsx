import React from 'react';
import { Gift, ShoppingBag, Star } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { CustomerProfileDto } from '../../../interfaces/CustomerProfileDto';
import { StatCard } from '../../ui/StatCard/StatCard';
import { ColorVariant } from '../../../types/ui';
import './QuickStats.scss';

interface StatItem {
    icon: typeof Gift;
    value: string | number;
    label: string;
    color: ColorVariant;
}

interface QuickStatsProps {
    profile: CustomerProfileDto | null;
    isLoading: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ profile, isLoading }) => {
    const { customer } = useAuthStore();

    const stats: StatItem[] = [
        {
            icon: Gift,
            value: isLoading ? '...' : (profile?.loyaltyPoints || customer?.loyaltyPoints || 0),
            label: 'Loyalty Points',
            color: 'orange'
        },
        {
            icon: ShoppingBag,
            value: isLoading ? '...' : 0, // TODO: Get from orders service
            label: 'Total Orders',
            color: 'blue'
        },
        {
            icon: Star,
            value: isLoading ? '...' : (profile?.userGrade ? profile.userGrade.toFixed(1) : '0.0'),
            label: 'Your Rating',
            color: 'yellow'
        }
    ];

    return (
        <div className="quick-stats">
            {stats.map((stat, index) => (
                <StatCard
                    key={stat.label}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    color={stat.color}
                    delay={index * 0.1}
                />
            ))}
        </div>
    );
};