export const OTP_CONFIG = {
    RESEND_COOLDOWN_SECONDS: Number(process.env.REACT_APP_OTP_RESEND_COOLDOWN) || 60,
    CODE_LENGTH: Number(process.env.REACT_APP_OTP_CODE_LENGTH) || 6,
    AUTO_SUBMIT: true,
    SHOW_PASTE_HINT: true
};