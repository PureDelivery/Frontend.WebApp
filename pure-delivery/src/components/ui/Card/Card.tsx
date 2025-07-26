import React from 'react';
import clsx from 'clsx';
import './Card.scss';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className,
                                              padding = 'md'
                                          }) => {
    return (
        <div className={clsx('card', `card--padding-${padding}`, className)}>
            {children}
        </div>
    );
};