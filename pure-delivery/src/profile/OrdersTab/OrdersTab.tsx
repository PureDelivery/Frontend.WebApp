import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { CustomerSessionDto } from '../../store/authStore';

interface OrdersTabProps {
    customer: CustomerSessionDto | null;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ customer }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="orders-tab"
        >
            <h2>My Orders</h2>
            <Card className="empty-state">
                <ShoppingBag size={48} />
                <h3>No orders yet</h3>
                <p>Your order history will appear here once you make your first order</p>
            </Card>
        </motion.div>
    );
};