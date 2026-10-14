import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import storageService from './storageService';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  profileImage?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<JwtResponse> {
    const response = await api.post<JwtResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    this.setToken(response.token);
    this.setUser(response);
    return response;
  }

  async register(userData: RegisterRequest): Promise<JwtResponse> {
    const response = await api.post<JwtResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    this.setToken(response.token);
    this.setUser(response);
    return response;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/login';
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user: JwtResponse): void {
    const userData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles.includes(role) ?? false;
  }

  updateUser(id: number, userData: Partial<User>): User {
    const updatedUser = storageService.updateUser(id, userData);
    // Update local storage user data
    const currentUser = this.getUser();
    if (currentUser && currentUser.id === id) {
      this.setUser({
        token: this.getToken() || '',
        type: 'Bearer',
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        roles: updatedUser.roles,
      });
    }
    return updatedUser;
  }

  changePassword(oldPassword: string, newPassword: string): void {
    // Mock implementation - in real app this would call the backend
    console.log('Password changed successfully');
  }
}

export default new AuthService();