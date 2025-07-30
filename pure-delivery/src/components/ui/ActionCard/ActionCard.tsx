import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '../Card/Card';
import { ColorVariant } from '../../../types/ui';
import './ActionCard.scss';

interface ActionCardProps {
    icon: LucideIcon;
    label: string;
    description: string;
    path: string;
    color?: Exclude<ColorVariant, 'yellow'>; // Исключаем yellow для ActionCard
    delay?: number;
}

export const ActionCard: React.FC<ActionCardProps> = ({
                                                          icon: IconComponent,
                                                          label,
                                                          description,
                                                          path,
                                                          color = 'blue',
                                                          delay = 0
                                                      }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
        >
            <Link to={path} className="action-card-link">
                <Card className={`action-card action-card--${color}`}>
                    <div className="action-icon">
                        <IconComponent size={24} />
                    </div>
                    <div className="action-content">
                        <h3>{label}</h3>
                        <p>{description}</p>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
};