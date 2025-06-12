// Authentication service interface
export interface AuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(userId: string, userRole: string): string;
  verifyToken(token: string): { userId: string; userRole: string } | null;
}
