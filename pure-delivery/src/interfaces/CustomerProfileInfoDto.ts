export interface CustomerProfileInfoDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    preferredPaymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}