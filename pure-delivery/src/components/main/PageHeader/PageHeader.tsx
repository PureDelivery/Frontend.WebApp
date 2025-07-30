import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../../store/themeStore';
import { useAuthStore } from '../../../store/authStore';
import { ThemeToggle } from '../../ui/ThemeToggle/ThemeToggle';
import { Button } from '../../ui/Button/Button';
import { UserAvatar } from '../../ui/UserAvatar/UserAvatar';
import MainLogo from '../../MainLogo/MainLogo';
import { CustomerProfileDto } from '../../../interfaces/CustomerProfileDto';
import { authService } from '../../../services/authService';
import './PageHeader.scss';
import {CustomerSummaryDto} from "../../../interfaces/CustomerSummaryDto";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showThemeToggle?: boolean;
    showLogout?: boolean;
    showLogo?: boolean;
    showAvatar?: boolean;
    customerSummary?: CustomerSummaryDto | null;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          showThemeToggle = false,
                                                          showLogout = false,
                                                          showLogo = true,
                                                          showAvatar = false,
                                                          customerSummary = null
                                                      }) => {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="page-header">
            <div className="header-left">
                {showLogo && <MainLogo theme={theme} />}
            </div>

            <div className="header-right">
                {showAvatar && (
                    <UserAvatar
                        src={customerSummary?.avatarUrl}
                        alt={`${customerSummary?.fullName} avatar`}
                        size="md"
                    />
                )}
                <div className="header-text">
                    <h1>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </div>

                {showThemeToggle && <ThemeToggle />}
                {showLogout && (
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        size="sm"
                        isLoading={isLoggingOut}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                )}
            </div>
        </div>
    );
};