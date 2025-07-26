import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card/Card';
import { OtpVerificationForm } from '../components/forms/OtpVerificationForm/OtpVerificationForm';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const EmailVerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleVerifyOtp = async (otpCode: string) => {
        if (!email) return;

        setIsVerifying(true);
        const loadingToast = toast.loading('Verifying code...');

        const result = await authService.verifyOtp(email, otpCode);

        toast.dismiss(loadingToast);
        setIsVerifying(false);

        if (result.isSuccess) {
            toast.success('Email verified successfully! 🎉');
            navigate('/login?verified=true');
        } else {
            toast.error(result.error || 'Invalid verification code');
        }
    };

    const handleResendCode = async () => {
        if (!email || isResending) return;

        setIsResending(true);
        const loadingToast = toast.loading('Sending new code...');

        const result = await authService.resendOtp(email);

        toast.dismiss(loadingToast);
        setIsResending(false);

        if (result.isSuccess) {
            toast.success('Verification code sent again!');
        } else {
            toast.error(result.error || 'Failed to resend code');
        }
    };

    if (!email) return null;

    return (
        <motion.div
            className="page auth-page"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <div className="auth-container">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <Card className="auth-card">
                        <div className="auth-header">
                            <h1>Verify Your Email</h1>
                            <p>We sent a 6-digit verification code to</p>
                            <p><strong>{email}</strong></p>
                            <p className="verification-info">
                                Enter the code below to activate your account
                            </p>
                        </div>

                        <OtpVerificationForm
                            onSubmit={handleVerifyOtp}
                            onResendCode={handleResendCode}
                            isLoading={isVerifying}
                            isResending={isResending}
                        />

                        <div className="auth-footer">
                            <p>
                                Wrong email?{' '}
                                <Link to="/register" className="auth-link-text">
                                    Go back to registration
                                </Link>
                            </p>
                            <Link to="/" className="back-link">
                                ← Back to Home
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EmailVerificationPage;