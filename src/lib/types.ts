// Extend the next-auth types
declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export interface SearchHistory {
  id: string;
  word: string;
  timestamp: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
} 