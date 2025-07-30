import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Target } from 'lucide-react';
import { Card } from '../../components/ui/Card/Card';
import { CustomerSessionDto } from '../../store/authStore';
import './AchievementsTab.scss';

interface AchievementsTabProps {
    customer: CustomerSessionDto | null;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ customer }) => {

    // TODO: Replace with actual achievements data from the backend or store
    const upcomingAchievements = [
        {
            icon: Trophy,
            title: 'First Order',
            description: 'Place your first order',
            progress: 0,
            total: 1,
            reward: '50 bonus points'
        },
        {
            icon: Star,
            title: 'Loyal Customer',
            description: 'Complete 10 orders',
            progress: 0,
            total: 10,
            reward: '200 bonus points'
        },
        {
            icon: Target,
            title: 'Big Spender',
            description: 'Spend $500 total',
            progress: 0,
            total: 500,
            reward: 'VIP status'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="achievements-tab"
        >
            <h2>Achievements</h2>

            <div style={{color: "red"}}>TEST ACHIEVEMENTS FROM FRONTEND</div>

            {/* No achievements yet */}
            <Card className="empty-state">
                <Award size={48} />
                <h3>No achievements yet</h3>
                <p>Complete orders and activities to unlock achievements</p>
            </Card>

            {/* Upcoming Achievements */}
            <div className="upcoming-section">
                <h3>Upcoming Achievements</h3>

                <div className="achievements-grid">
                    {upcomingAchievements.map((achievement, index) => {
                        const IconComponent = achievement.icon;
                        const progressPercent = (achievement.progress / achievement.total) * 100;

                        return (
                            <Card key={index} className="achievement-card upcoming">
                                <div className="achievement-icon">
                                    <IconComponent size={24} />
                                </div>
                                <div className="achievement-content">
                                    <h4>{achievement.title}</h4>
                                    <p>{achievement.description}</p>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-text">
                                        {achievement.progress} / {achievement.total}
                                    </div>
                                    <div className="reward">
                                        Reward: {achievement.reward}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};