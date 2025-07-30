import {CustomerProfileDto} from "./CustomerProfileDto";

export interface AuthDto {
    customerId: string;
    email: string;
    fullName: string;
    sessionId: string;
    authenticatedAt: string;
    profile?: CustomerProfileDto;
}