import { Injectable, inject, signal } from "@angular/core";
import { MockDataService } from "./mock-data.service";
import { readLocal, writeLocal, validEmail } from "./local-store";
<<<<<<< HEAD

// "mark.john92@x.com" -> "Mark John". Used only as a starter name when the
// profile has none yet; the user can change it on the Profile page.
function nameFromEmail(email: string): string {
  const local = email.split("@")[0];
  const words = local
    .replace(/[0-9]+/g, " ")
    .split(/[._\-+\s]+/)
    .filter(Boolean);
  return (words.length ? words : [local])
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

=======
>>>>>>> be67fa97e984a5df61c90f9702cd575a171f34df
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
<<<<<<< HEAD

    // The email used to log in becomes the profile email.
    const cleanEmail = email.trim();
    const profile = this.data.profile();
    this.data.updateProfile({
      name: profile.name.trim() || nameFromEmail(cleanEmail),
      email: cleanEmail,
      studyGoal: profile.studyGoal,
      school: profile.school,
    });

=======
>>>>>>> be67fa97e984a5df61c90f9702cd575a171f34df
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
<<<<<<< HEAD
}
=======
}
>>>>>>> be67fa97e984a5df61c90f9702cd575a171f34df
