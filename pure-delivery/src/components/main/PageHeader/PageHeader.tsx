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

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showThemeToggle?: boolean;
    showLogout?: boolean;
    showLogo?: boolean;
    showAvatar?: boolean;
    profile?: CustomerProfileDto | null;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          showThemeToggle = false,
                                                          showLogout = false,
                                                          showLogo = true,
                                                          showAvatar = false,
                                                          profile = null
                                                      }) => {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const { customer } = useAuthStore();
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
                        src={profile?.avatarUrl}
                        alt={`${customer?.fullName} avatar`}
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