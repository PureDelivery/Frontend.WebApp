export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:7155/api/v1',
    ENDPOINTS: {
        ADD_CUSTOMER: '/auth/register',
        AUTHENTICATE: '/auth/login',
        VERIFY_OTP: '/auth/confirm-email',
        RESEND_OTP: '/auth/resend-otp',
        LOGOUT: '/auth/logout',
        REQUEST_FORGOT_PASSWORD: '/auth/request-forgot-password',
        FORGOT_PASSWORD: '/auth/change-password-with-otp',
        CHANGE_PASSWORD_SIMPLE: '/auth/change-password',

        CHECK_EMAIL_AVAILABILITY: (email: string) => `/auth/email-availability/${email}`,

        DELETE_CUSTOMER: (customerId: string) => `/auth/${customerId}`,

        GET_CUSTOMER_SUMMARY: (customerId: string) => `/Customer/${customerId}`,

        GET_CUSTOMER_LOYALTY: (customerId: string) => `/Customer/${customerId}/loyalty`,
        GET_CUSTOMER_PROFILE_INFO: (customerId: string) => `/Customer/${customerId}/profile-info`,

        GET_CUSTOMER_WITH_PROFILE: (customerId: string) => `/Customer/${customerId}/profile`,
        GET_CUSTOMER_FULL: (customerId: string) => `/Customer/${customerId}/full`,
        GET_CUSTOMER_WITH_ADDRESSES: (customerId: string) => `/Customer/${customerId}/addresses`,

        // Profile endpoints
        UPDATE_PROFILE: (customerId: string) => `/CustomerProfile/${customerId}`,
        UPLOAD_AVATAR: (customerId: string) => `/CustomerProfile/${customerId}/upload-avatar`,
        LOYALTY_POINTS_BALANCE: (customerId: string) => `/CustomerProfile/${customerId}/loyalty-points/balance`,

        // Address endpoints
        GET_CUSTOMER_ADDRESSES: (customerId: string) => `/CustomerAddress/customer/${customerId}`,
        GET_ADDRESS: (addressId: string) => `/CustomerAddress/${addressId}`,
        GET_DEFAULT_ADDRESS: (customerId: string) => `/CustomerAddress/customer/${customerId}/default`,
        ADD_ADDRESS: (customerId: string) => `/CustomerAddress/customer/${customerId}`,
        UPDATE_ADDRESS: (addressId: string) => `/CustomerAddress/${addressId}`,
        DELETE_ADDRESS: (addressId: string) => `/CustomerAddress/${addressId}`,
        SET_DEFAULT_ADDRESS: (customerId: string, addressId: string) =>
            `/CustomerAddress/customer/${customerId}/default/${addressId}`,
    }
};