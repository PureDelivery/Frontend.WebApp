import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '../Card/Card';
import { ColorVariant } from '../../../types/ui';
import './StatCard.scss';

interface StatCardProps {
    icon: LucideIcon;
    value: string | number;
    label: string;
    color?: ColorVariant;
    delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
                                                      icon: IconComponent,
                                                      value,
                                                      label,
                                                      color = 'blue',
                                                      delay = 0
                                                  }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
        >
            <Card className={`stat-card stat-card--${color}`}>
                <div className="stat-content">
                    <div className="stat-icon">
                        <IconComponent size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{value}</h3>
                        <p>{label}</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};