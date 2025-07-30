import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './OtpInput.scss';

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
    autoSubmit?: boolean;
    onComplete?: (value: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
                                                      length = 6,
                                                      value,
                                                      onChange,
                                                      disabled = false,
                                                      error,
                                                      autoSubmit = false,
                                                      onComplete
                                                  }) => {
    const [otpCode, setOtpCode] = useState(() => {
        const initialArray = Array(length).fill('');
        if (value) {
            const digits = value.split('').slice(0, length);
            digits.forEach((digit, index) => {
                initialArray[index] = digit;
            });
        }
        return initialArray;
    });

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Синхронизируем внутреннее состояние с внешним value
    useEffect(() => {
        const newArray = Array(length).fill('');
        if (value) {
            const digits = value.split('').slice(0, length);
            digits.forEach((digit, index) => {
                newArray[index] = digit;
            });
        }
        setOtpCode(newArray);
    }, [value, length]);

    const handleInputChange = (index: number, inputValue: string) => {
        if (!/^\d*$/.test(inputValue)) return;

        const newOtpCode = [...otpCode];
        newOtpCode[index] = inputValue;
        setOtpCode(newOtpCode);

        const newValue = newOtpCode.join('');
        onChange(newValue);

        // Переходим к следующему полю
        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Автоподтверждение при заполнении всех полей
        if (autoSubmit && newOtpCode.every(digit => digit !== '') && newValue.length === length) {
            onComplete?.(newValue);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            const currentValue = otpCode.join('');
            if (currentValue.length === length) {
                onComplete?.(currentValue);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === length) {
            const newOtpCode = pastedData.split('');
            setOtpCode(newOtpCode);
            onChange(pastedData);
            inputRefs.current[length - 1]?.focus();

            if (autoSubmit) {
                onComplete?.(pastedData);
            }
        }
    };

    return (
        <div className="otp-input-wrapper">
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
                            className={`otp-input ${digit ? 'filled' : ''} ${error ? 'error' : ''}`}
                            maxLength={1}
                            disabled={disabled}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        />
                    ))}
                </div>
            </div>
            {error && (
                <motion.div
                    className="otp-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};