import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button/Button';
import { OtpInput } from '../../ui/OtpInput/OtpInput';
import './OtpVerificationForm.scss';
import { OTP_CONFIG } from '../../../config/otp';

interface OtpVerificationFormProps {
    onSubmit: (otpCode: string) => void;
    onResendCode: () => void;
    isLoading?: boolean;
    isResending?: boolean;
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
                                                                            onSubmit,
                                                                            onResendCode,
                                                                            isLoading = false,
                                                                            isResending = false
                                                                        }) => {
    const [canResend, setCanResend] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [countdown, setCountdown] = useState(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleSubmit = () => {
        if (otpCode.length === OTP_CONFIG.CODE_LENGTH) {
            onSubmit(otpCode);
        }
    };

    const handleResend = () => {
        if (canResend && !isResending) {
            onResendCode();
            setCanResend(false);
            setCountdown(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
        }
    };

    const handleOtpComplete = (value: string) => {
        if (OTP_CONFIG.AUTO_SUBMIT) {
            onSubmit(value);
        }
    };

    const isCodeComplete = otpCode.length === OTP_CONFIG.CODE_LENGTH;

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="otp-form">
            <motion.div
                className="otp-input-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <OtpInput
                    length={OTP_CONFIG.CODE_LENGTH}
                    value={otpCode}
                    onChange={setOtpCode}
                    disabled={isLoading}
                    autoSubmit={OTP_CONFIG.AUTO_SUBMIT}
                    onComplete={handleOtpComplete}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    disabled={!isCodeComplete || isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
            </motion.div>

            <motion.div
                className="resend-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p className="resend-text">
                    Didn't receive the code?{' '}
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="resend-link"
                        >
                            {isResending ? 'Sending...' : 'Resend code'}
                        </button>
                    ) : (
                        <span className="countdown">
                            Resend in {countdown}s
                        </span>
                    )}
                </p>
            </motion.div>
        </form>
    );
};