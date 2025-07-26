import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button/Button';
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
    const [otpCode, setOtpCode] = useState(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
    const [countdown, setCountdown] = useState(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtpCode = [...otpCode];
        newOtpCode[index] = value;
        setOtpCode(newOtpCode);

        if (value && index < OTP_CONFIG.CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (OTP_CONFIG.AUTO_SUBMIT && newOtpCode.every(digit => digit !== '') && newOtpCode.join('').length === OTP_CONFIG.CODE_LENGTH) {
            onSubmit(newOtpCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === OTP_CONFIG.CODE_LENGTH) {
            const newOtpCode = pastedData.split('');
            setOtpCode(newOtpCode);
            inputRefs.current[OTP_CONFIG.CODE_LENGTH - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const code = otpCode.join('');
        if (code.length === 6) {
            onSubmit(code);
        }
    };

    const handleResend = () => {
        if (canResend && !isResending) {
            onResendCode();
            setCanResend(false);
            setCountdown(OTP_CONFIG.RESEND_COOLDOWN_SECONDS); // Используем конфиг
        }
    };

    const isCodeComplete = otpCode.every(digit => digit !== '');

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="otp-form">
            <div className="otp-input-container">
                <div className="otp-inputs">
                    {otpCode.map((digit, index) => (
                        <motion.input
                            key={index}
                            ref={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
                            type="text"
                            value={digit}
                            onChange={(e: { target: { value: string; }; }) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={`otp-input ${digit ? 'filled' : ''}`}
                            maxLength={1}
                            disabled={isLoading}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        />
                    ))}
                </div>
            </div>

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