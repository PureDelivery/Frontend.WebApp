
export interface CreateAddressRequest {
    label: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    building?: string;
    apartment?: string;
    floor?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
    deliveryInstructions?: string;
}

export interface UpdateAddressRequest {
    label: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    building?: string;
    apartment?: string;
    floor?: string;
    latitude?: number;
    longitude?: number;
    deliveryInstructions?: string;
}