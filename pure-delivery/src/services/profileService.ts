import { API_CONFIG } from '../config/api';
import { BaseResponse } from '../interfaces/BaseResponse';
import {CustomerWithProfileDto,
    CustomerProfileDto,
    UpdateProfileRequest,
    CustomerAddressDto
}
    from '../interfaces/CustomerProfileDto';
import {CreateAddressRequest, UpdateAddressRequest} from "../interfaces/AddressRequests";
import ApiService from './apiService';
import {CustomerSummaryDto} from "../interfaces/CustomerSummaryDto";
import {CustomerProfileInfoDto} from "../interfaces/CustomerProfileInfoDto";
import {CustomerLoyaltyDto} from "../interfaces/CustomerLoyaltyDto";
import {CreateCustomerResultDto} from "../interfaces/CreateCustomerResultDto";

export const profileService = {
    // Helper для добавления Authorization header
    getHeaders(includeContentType: boolean = true): Record<string, string> {
        const sessionId = localStorage.getItem('sessionId');
        const headers: Record<string, string> = {};

        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }

        if (sessionId) {
            headers['Authorization'] = `Bearer ${sessionId}`;
        }

        return headers;
    },

    async getCustomerSummary(customerId: string): Promise<BaseResponse<CustomerSummaryDto>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_CUSTOMER_SUMMARY(customerId)}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result: BaseResponse<CustomerSummaryDto> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    // Profile methods

    async updateProfile(customerId: string, data: UpdateProfileRequest): Promise<BaseResponse<boolean>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_PROFILE(customerId)}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            const result: BaseResponse<boolean> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async uploadAvatar(customerId: string, formData: FormData): Promise<BaseResponse<string>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_AVATAR(customerId)}`, {
                method: 'POST',
                headers: this.getHeaders(false), // Не добавляем Content-Type для FormData
                body: formData,
            });

            const result: BaseResponse<string> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    // Address methods
    async getCustomerAddresses(customerId: string): Promise<BaseResponse<CustomerAddressDto[]>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_CUSTOMER_ADDRESSES(customerId)}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result: BaseResponse<CustomerAddressDto[]> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async addAddress(customerId: string, data: CreateAddressRequest): Promise<BaseResponse<CustomerAddressDto>> {
        try {
            console.log(data)
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_ADDRESS(customerId)}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            const result: BaseResponse<CustomerAddressDto> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<BaseResponse<boolean>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_ADDRESS(addressId)}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            const result: BaseResponse<boolean> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async deleteAddress(addressId: string): Promise<BaseResponse<boolean>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_ADDRESS(addressId)}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            const result: BaseResponse<boolean> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async setDefaultAddress(customerId: string, addressId: string): Promise<BaseResponse<boolean>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SET_DEFAULT_ADDRESS(customerId, addressId)}`, {
                method: 'PUT',
                headers: this.getHeaders(),
            });

            const result: BaseResponse<boolean> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async getCustomerLoyalty(customerId: string): Promise<BaseResponse<CustomerLoyaltyDto>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_CUSTOMER_LOYALTY(customerId)}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result: BaseResponse<CustomerLoyaltyDto> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async getCustomerProfileInfo(customerId: string): Promise<BaseResponse<CustomerProfileInfoDto>> {
        try {
            const response = await ApiService.request(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_CUSTOMER_PROFILE_INFO(customerId)}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result: BaseResponse<CustomerProfileInfoDto> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },

    async deleteCustomer(customerId: string): Promise<BaseResponse<boolean>> {
        try {

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_CUSTOMER(customerId)}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const result: BaseResponse<boolean> = await response.json();
            return result;
        } catch (error) {
            return {
                isSuccess: false,
                error: 'Network error occurred'
            };
        }
    },
};