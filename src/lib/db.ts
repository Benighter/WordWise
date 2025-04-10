import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

// In a real application, you would use a database like MongoDB, PostgreSQL, etc.
// For this demo, we'll use a simple in-memory store with localStorage persistence
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
}

// Helper class to manage users
class UserManager {
  private users: User[] = [];
  private initialized = false;

  constructor() {
    // Load users from localStorage in client-side environments
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && !this.initialized) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
      this.initialized = true;
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  // Create a new user
  async createUser(name: string, email: string, password: string): Promise<User> {
    this.initialize();

    // Check if user already exists
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now()
    };

    this.users.push(user);
    this.save();

    return user;
  }

  // Get a user by email
  getUserByEmail(email: string): User | undefined {
    this.initialize();
    return this.users.find(user => user.email === email);
  }

  // Get a user by ID
  getUserById(id: string): User | undefined {
    this.initialize();
    return this.users.find(user => user.id === id);
  }

  // Validate user credentials
  async validateCredentials(email: string, password: string): Promise<User | null> {
    this.initialize();
    const user = this.getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}

// Export a singleton instance
export const userManager = new UserManager(); 