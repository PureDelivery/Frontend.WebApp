import React from 'react';
import logo from '../../assets/logo.png';
import './MainLogo.scss';

interface MainLogoProps {
    theme: string;
}

const MainLogo: React.FC<MainLogoProps> = ({ theme }) => {
    return (
        <div className="login-main-logo-wrapper">
            <div className="login-main-logo-container">
                <img
                    className="login-main-logo-img"
                    src={logo}
                    alt="Pure Delivery"
                />

                <div className="login-main-logo-brand">
                    <h2 className="login-main-logo-title">Pure Delivery</h2>
                    <p className="login-main-logo-subtitle">Fresh food, delivered fast</p>
                </div>
            </div>
        </div>
    );
};

export default MainLogo;