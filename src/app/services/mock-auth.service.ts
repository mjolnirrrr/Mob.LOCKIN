import { Injectable, inject, signal } from "@angular/core";
import { MockDataService } from "./mock-data.service";
import { readLocal, writeLocal, validEmail } from "./local-store";
@Injectable({ providedIn: "root" })
export class MockAuthService {
  private data = inject(MockDataService);
  readonly isAuthenticated = signal(
    readLocal<boolean>("lockin.auth", false) === true,
  );
  async login(email: string, password: string) {
    if (!email.trim() || !password)
      return { success: false, message: "Enter your email and password." };
    if (!validEmail(email))
      return { success: false, message: "Enter a valid email address." };
    if (password.length < 6)
      return {
        success: false,
        message: "Password must be at least 6 characters.",
      };
    this.isAuthenticated.set(true);
    writeLocal("lockin.auth", true);
    return { success: true };
  }
  async signup(name: string, email: string, password: string) {
    if (!name.trim())
      return { success: false, message: "Please enter your name." };
    const result = await this.login(email, password);
    if (result.success)
      this.data.updateProfile({
        ...this.data.profile(),
        name: name.trim(),
        email: email.trim(),
      });
    return result;
  }
  async sendResetLink(email: string) {
    return validEmail(email)
      ? { success: true }
      : { success: false, message: "Enter a valid email address." };
  }
  async resetPassword(password: string) {
    return { success: password.length >= 6 };
  }
  logout(): void {
    this.isAuthenticated.set(false);
    writeLocal("lockin.auth", false);
  }
}
