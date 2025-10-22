import { API_CONFIG } from "../../config/api";
import type { Roles } from "../../interfaces/Roles";
import { apiClient } from "../client";

class AuthService {
    private authLoginEndpoint = API_CONFIG.endpoints.auth.login;
    private authRegisterEndpoint = API_CONFIG.endpoints.auth.register;
    private rolesEndpoint = API_CONFIG.endpoints.auth.roles;

    async getRoles(): Promise<Roles[]> {
        return apiClient.get<Roles[]>(this.rolesEndpoint);
    };

    async login(payRollNumber: number, password: string): Promise<any> {
        return apiClient.post(this.authLoginEndpoint, { payRollNumber, password });
    };

    async register(name: string, payRollNumber: number, password: string, roleName: string): Promise<any> {
        return apiClient.post(this.authRegisterEndpoint, { name, payRollNumber, password, roleName });
    };
};

export const authService = new AuthService();