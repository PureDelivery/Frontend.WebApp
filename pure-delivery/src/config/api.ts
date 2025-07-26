export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:7155/api/v1',
    ENDPOINTS: {
        ADD_CUSTOMER: '/customer/register',
        AUTH: '/auth',
        VERIFY_OTP: '/customer/confirm-email',
        RESEND_OTP: '/customer/resend-otp',
    }
};