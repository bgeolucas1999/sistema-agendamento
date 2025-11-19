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
    // Mock login for testing - remove this when connecting to real backend
    if (credentials.email === 'admin@gmail.com' && credentials.password === 'admin') {
      const user = storageService.getUserByEmail(credentials.email);
      const mockResponse: JwtResponse = {
        token: 'mock-jwt-token-admin',
        type: 'Bearer',
        id: user?.id || 1,
        email: credentials.email,
        name: user?.name || 'Administrador',
        roles: user?.roles || ['ROLE_ADMIN', 'ROLE_USER']
      };
      this.setToken(mockResponse.token);
      this.setUser(mockResponse);
      return mockResponse;
    }
    
    // Check in storage service
    const user = storageService.getUserByEmail(credentials.email);
    if (user) {
      const mockResponse: JwtResponse = {
        token: `mock-jwt-token-${user.id}`,
        type: 'Bearer',
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      };
      this.setToken(mockResponse.token);
      this.setUser(mockResponse);
      return mockResponse;
    }
    
    const response = await api.post<JwtResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    this.setToken(response.token);
    this.setUser(response);
    return response;
  }

  async register(userData: RegisterRequest): Promise<JwtResponse> {
    // Create user in storage service
    const newUser = storageService.createUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      roles: ['ROLE_USER'],
    });

    const mockResponse: JwtResponse = {
      token: `mock-jwt-token-${newUser.id}`,
      type: 'Bearer',
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roles: newUser.roles
    };
    this.setToken(mockResponse.token);
    this.setUser(mockResponse);
    return mockResponse;
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