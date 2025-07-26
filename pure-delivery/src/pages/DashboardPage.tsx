import React from 'react';
import { useAuthStore } from '../store/authStore';

const DashboardPage: React.FC = () => {
    const { customer, clearSession } = useAuthStore();

    const handleLogout = () => {
        clearSession();
    };

    return (
        <div className="page dashboard-page">
            <div className="dashboard-content">
                <h1>Welcome to Dashboard!</h1>
                <p>Hello, {customer?.fullName || customer?.email}!</p>

                <div className="user-info">
                    <p><strong>Email:</strong> {customer?.email}</p>
                    <p><strong>Phone:</strong> {customer?.phone || 'Not provided'}</p>
                    <p><strong>Loyalty Points:</strong> {customer?.loyaltyPoints || 0}</p>
                </div>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;