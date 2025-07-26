export interface CreateCustomerRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
}