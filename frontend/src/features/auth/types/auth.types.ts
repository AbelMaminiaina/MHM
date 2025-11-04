export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    token: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser, token: string) => void;
}
