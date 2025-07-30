import React from 'react';
import { Gift, ShoppingBag, Star } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { CustomerProfileDto } from '../../../interfaces/CustomerProfileDto';
import { StatCard } from '../../ui/StatCard/StatCard';
import { ColorVariant } from '../../../types/ui';
import './QuickStats.scss';
import {CustomerSummaryDto} from "../../../interfaces/CustomerSummaryDto";

interface StatItem {
    icon: typeof Gift;
    value: string | number;
    label: string;
    color: ColorVariant;
}

interface QuickStatsProps {
    customerSummary: CustomerSummaryDto | null;
    isLoading: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ customerSummary, isLoading }) => {
    const { customer } = useAuthStore();

    const stats: StatItem[] = [
        {
            icon: Gift,
            value: isLoading ? '...' : (customerSummary?.loyaltyPoints || customer?.loyaltyPoints || 0),
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
            value: isLoading ? '...' : (customerSummary?.userGrade ? customerSummary.userGrade.toFixed(1) : '0.0'),
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