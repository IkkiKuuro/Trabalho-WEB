// Email service interface
export interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean>;
  sendWelcomeEmail(to: string, name: string): Promise<boolean>;
  sendAppointmentConfirmation(to: string, appointmentDetails: any): Promise<boolean>;
  sendTaskReminder(to: string, taskDetails: any): Promise<boolean>;
}
