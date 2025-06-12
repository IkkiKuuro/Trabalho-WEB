export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(userId: string, userRole: string): string;
  verifyToken(token: string): { userId: string; userRole: string } | null;
}
