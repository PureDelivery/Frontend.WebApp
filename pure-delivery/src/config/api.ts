export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:7155/api/v1',
    IDENTITY_SERVICE: {
        AUTH_CONTROLLER: {
            ADD_CUSTOMER: '/identity/auth/register',
            AUTHENTICATE: '/identity/auth/login',
            VERIFY_OTP: '/identity/auth/confirm-email',
            RESEND_OTP: '/identity/auth/resend-otp',
            LOGOUT: '/identity/auth/logout',
            REQUEST_FORGOT_PASSWORD: '/identity/auth/request-forgot-password',
            FORGOT_PASSWORD: '/identity/auth/change-password-with-otp',
            CHANGE_PASSWORD_SIMPLE: '/identity/auth/change-password',
            CHECK_EMAIL_AVAILABILITY: (email: string) => `/identity/auth/email-availability/${email}`,
            DELETE_CUSTOMER: (customerId: string) => `/identity/auth/${customerId}`,
        },

        CUSTOMER_CONTROLLER: {

            GET_CUSTOMER_SUMMARY: (customerId: string) => `/identity/Customer/${customerId}`,
            GET_CUSTOMER_LOYALTY: (customerId: string) => `/identity/Customer/${customerId}/loyalty`,
            GET_CUSTOMER_PROFILE_INFO: (customerId: string) => `/identity/Customer/${customerId}/profile-info`,
        },

        PROFILE_CONTROLLER: {
            UPDATE_PROFILE: (customerId: string) => `/identity/CustomerProfile/${customerId}`,
            UPLOAD_AVATAR: (customerId: string) => `/identity/CustomerProfile/${customerId}/upload-avatar`,
        },

        ADDRESS_CONTROLLER: {
            GET_CUSTOMER_ADDRESSES: (customerId: string) => `/identity/CustomerAddress/customer/${customerId}`,
            ADD_ADDRESS: (customerId: string) => `/identity/CustomerAddress/customer/${customerId}`,
            UPDATE_ADDRESS: (addressId: string) => `/identity/CustomerAddress/${addressId}`,
            DELETE_ADDRESS: (addressId: string) => `/identity/CustomerAddress/${addressId}`,
            SET_DEFAULT_ADDRESS: (customerId: string, addressId: string) =>
                `/identity/CustomerAddress/customer/${customerId}/default/${addressId}`,
        }
    }
};