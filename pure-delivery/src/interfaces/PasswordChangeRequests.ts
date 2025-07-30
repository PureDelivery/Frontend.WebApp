export interface RequestPasswordChangeRequest {
    email: string;
}

export interface ChangePasswordWithOtpRequest {
    email: string;
    otpCode: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    newPassword: string;
    currentPassword: string;
    customerId: string;
    confirmPassword: string;
}
