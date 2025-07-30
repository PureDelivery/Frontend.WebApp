import React from 'react';
import { User, MapPin, ShoppingBag, Award, Gift } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { CustomerProfileDto } from '../../../interfaces/CustomerProfileDto';
import { ActionCard } from '../../ui/ActionCard/ActionCard';
import { ColorVariant } from '../../../types/ui';
import './QuickActions.scss';
import {CustomerSummaryDto} from "../../../interfaces/CustomerSummaryDto";

interface ActionItem {
    icon: typeof User;
    label: string;
    description: string;
    path: string;
    color: Exclude<ColorVariant, 'yellow'>;
}

interface QuickActionsProps {
    customerSummary: CustomerSummaryDto | null;
    isLoading: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ customerSummary, isLoading }) => {
    const { customer } = useAuthStore();

    const actions: ActionItem[] = [
        {
            icon: User,
            label: 'Profile',
            description: 'Manage your personal information',
            path: '/profile',
            color: 'blue'
        },
        {
            icon: MapPin,
            label: 'Addresses',
            description: 'Manage delivery addresses',
            path: '/profile?tab=addresses',
            color: 'green'
        },
        {
            icon: ShoppingBag,
            label: 'My Orders',
            description: 'View order history',
            path: '/profile?tab=orders',
            color: 'purple'
        },
        {
            icon: Gift,
            label: 'Loyalty Points',
            description: isLoading
                ? 'Loading...'
                : `${customerSummary?.loyaltyPoints || customer?.loyaltyPoints || 0} points available`,
            path: '/profile?tab=loyalty',
            color: 'orange'
        },
        {
            icon: Award,
            label: 'Achievements',
            description: 'View your rewards',
            path: '/profile?tab=achievements',
            color: 'red'
        }
    ];

    return (
        <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
                {actions.map((action, index) => (
                    <ActionCard
                        key={action.label}
                        icon={action.icon}
                        label={action.label}
                        description={action.description}
                        path={action.path}
                        color={action.color}
                        delay={index * 0.1}
                    />
                ))}
            </div>
        </div>
    );
};