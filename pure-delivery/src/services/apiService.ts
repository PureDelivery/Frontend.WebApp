
import { useAuthStore } from '../store/authStore';

class ApiService {
    private static showUnauthorizedModal: (() => void) | null = null;

    static setUnauthorizedHandler(handler: () => void) {
        this.showUnauthorizedModal = handler;
    }

    static async request(url: string, options: RequestInit = {}): Promise<Response> {
        const sessionId = localStorage.getItem('sessionId');

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(sessionId && { 'Authorization': `Bearer ${sessionId}` }),
                ...options.headers,
            },
        };

        const response = await fetch(url, config);

        console.log(response)
        console.log(this.showUnauthorizedModal)

        if (response.status === 401 && this.showUnauthorizedModal) {
            console.log("inside if")
            console.log(response)
            this.showUnauthorizedModal();
        }

        return response;
    }
}

export default ApiService;