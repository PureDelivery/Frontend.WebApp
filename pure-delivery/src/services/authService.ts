import { API_CONFIG } from '../config/api';
import {CreateCustomerRequest} from "../interfaces/CreateCustomerRequest";
import {BaseResponse} from "../interfaces/BaseResponse";
import {CreateCustomerResultDto} from "../interfaces/CreateCustomerResultDto";


export interface RegisterFormData extends CreateCustomerRequest {
    confirmPassword: string;
}

export const authService = {
    async createCustomer(data: CreateCustomerRequest): Promise<BaseResponse<CreateCustomerResultDto>> {
        try {
            const requestData = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || undefined,
                dateOfBirth: data.dateOfBirth || undefined
            };

            const cleanedData = Object.fromEntries(
                Object.entries(requestData).filter(([_, v]) => v !== undefined)
            );

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_CUSTOMER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedData)
            });

            const result: BaseResponse<CreateCustomerResultDto> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async verifyOtp(email: string, otpCode: string): Promise<BaseResponse<any>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otpCode })
            });

            const result: BaseResponse<any> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async resendOtp(email: string): Promise<BaseResponse<any>> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEND_OTP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result: BaseResponse<any> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    }
};


