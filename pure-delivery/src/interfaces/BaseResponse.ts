export interface BaseResponse<T> {
    isSuccess: boolean;
    data?: T;
    message?: string;
    error?: string;
}