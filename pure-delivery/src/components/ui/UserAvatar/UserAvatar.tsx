import React from 'react';
import { User } from 'lucide-react';
import './UserAvatar.scss';

interface UserAvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
                                                          src,
                                                          alt = 'User avatar',
                                                          size = 'md',
                                                          className = ''
                                                      }) => {
    const getSizeClass = () => {
        switch (size) {
            case 'sm': return 'user-avatar--sm';
            case 'md': return 'user-avatar--md';
            case 'lg': return 'user-avatar--lg';
            case 'xl': return 'user-avatar--xl';
            default: return 'user-avatar--md';
        }
    };

    return (
        <div className={`user-avatar ${getSizeClass()} ${className}`}>
            {src ? (
                <img src={src} alt={alt} />
            ) : (
                <User size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 28 : 36} />
            )}
        </div>
    );
};