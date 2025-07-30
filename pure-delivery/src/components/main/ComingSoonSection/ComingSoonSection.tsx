import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import './ComingSoonSection.scss';

export const ComingSoonSection: React.FC = () => {
    return (
        <motion.div
            className="coming-soon-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
        >
            <Card className="coming-soon-card">
                <h2>🍕 Food Ordering Coming Soon!</h2>
                <p>We're working hard to bring you the best food delivery experience. Stay tuned!</p>
                <Button variant="primary" disabled>
                    Browse Restaurants
                </Button>
            </Card>
        </motion.div>
    );
};