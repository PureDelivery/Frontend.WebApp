export interface CustomerProfileDto {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    loyaltyPoints: number;
    lastOrderDate?: string;
    preferredPaymentMethod?: string;
    userGrade: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerWithProfileDto {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    profile?: CustomerProfileDto;
}

export interface CustomerAddressDto {
    id: string;
    label: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    building: string;
    apartment: string;
    floor: string;
    isDefault: boolean;
    deliveryInstructions: string
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    preferredPaymentMethod?: string;
}