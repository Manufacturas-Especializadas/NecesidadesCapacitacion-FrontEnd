import { API_CONFIG } from "../config/api";

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    };

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("token");
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        const headers = new Headers({
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        });

        if (options.body instanceof FormData) {
            headers.delete('Content-Type');
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = '/login';
            }
            const errorData = await response.json().catch(() => ({ message: `Error HTTP: ${response.status}` }));
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return null as unknown as T;
        }

        return response.json() as Promise<T>;
    };

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    };

    post<T>(endpoint: string, data: any): Promise<T> {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body,
        });
    };

    put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    };

    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    };
}

export const apiClient = new ApiClient();