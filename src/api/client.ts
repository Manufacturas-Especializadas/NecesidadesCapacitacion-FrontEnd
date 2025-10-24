import { API_CONFIG } from "../config/api";

class ApiClient {
    private baseUrl: string;
    private isRefreshing = false;
    private refreshQueue: (() => void)[] = [];

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("token");
        return token ? { "Authorization": `Bearer ${token}` } : {};
    }

    private async refreshAccessToken(): Promise<boolean> {
        if (this.isRefreshing) {
            await new Promise<void>((resolve) => this.refreshQueue.push(resolve));
            return true;
        }

        this.isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token disponible");

            const response = await fetch(`${this.baseUrl}/Auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) throw new Error("No se pudo refrescar el token");

            const data = await response.json();

            localStorage.setItem("token", data.token);
            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            }

            this.isRefreshing = false;
            this.refreshQueue.forEach((resolve) => resolve());
            this.refreshQueue = [];

            return true;
        } catch (error) {
            console.error("Error al refrescar token:", error);
            this.isRefreshing = false;
            this.refreshQueue.forEach((resolve) => resolve());
            this.refreshQueue = [];

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return false;
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retry = true
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        const headers = new Headers({
            "Content-Type": "application/json",
            ...authHeaders,
            ...options.headers,
        });

        if (options.body instanceof FormData) {
            headers.delete("Content-Type");
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401 && retry) {
            const refreshed = await this.refreshAccessToken();
            if (refreshed) {
                return this.request<T>(endpoint, options, false);
            } else {
                throw new Error("Sesión expirada");
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: `Error HTTP: ${response.status}`,
            }));
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return null as unknown as T;
        }

        return response.json() as Promise<T>;
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: "GET" });
    }

    post<T>(endpoint: string, data: any): Promise<T> {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return this.request<T>(endpoint, {
            method: "POST",
            body: body,
        });
    }

    put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }

    downloadFile(endpoint: string, filename: string): Promise<void> {
        const url = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        const headers = new Headers({
            ...authHeaders,
        });

        return fetch(url, {
            method: "GET",
            headers,
        })
            .then(async (response) => {
                if (response.status === 401) {
                    const refreshed = await this.refreshAccessToken();
                    if (refreshed) {
                        await this.downloadFile(endpoint, filename);
                        return;
                    } else {
                        throw new Error("Sesión expirada");
                    }
                }

                if (!response.ok) {
                    const errorData = await response
                        .json()
                        .catch(() => ({ message: `Error HTTP: ${response.status}` }));
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }

                return response.blob();
            })
            .then((blob) => {
                if (!blob) return;
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
            });
    }

}

export const apiClient = new ApiClient();
