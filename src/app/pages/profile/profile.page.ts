import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToggle,
} from "@ionic/angular/standalone";
import { MockDataService } from "../../services/mock-data.service";
import { MockAuthService } from "../../services/mock-auth.service";
import { ThemeService } from "../../services/theme.service";
import { validEmail, readLocal, writeLocal } from "../../services/local-store";
@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonToggle,
  ],
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage {
  readonly data = inject(MockDataService);
  readonly theme = inject(ThemeService);
  private auth = inject(MockAuthService);
  private router = inject(Router);
  draft = { ...this.data.profile() };
  message = signal("");
  error = signal("");
  reminders = signal(readLocal("lockin.reminders", true));
  ionViewWillEnter(): void {
    this.cancel();
  }
  cancel(): void {
    this.draft = { ...this.data.profile() };
    this.error.set("");
    this.message.set("");
  }
  save(): void {
    this.error.set("");
    this.message.set("");
    const { name, email, studyGoal, school } = this.draft;
    if (!name.trim() || !email.trim() || !studyGoal.trim()) {
      this.error.set("Full name, email and study goal are required.");
      return;
    }
    if (!validEmail(email)) {
      this.error.set("Enter a valid email address.");
      return;
    }
    this.data.updateProfile({
      name: name.trim(),
      email: email.trim(),
      studyGoal: studyGoal.trim(),
      school: school.trim(),
    });
    this.message.set("Profile saved. Your planner is up to date.");
  }
  setReminders(value: boolean): void {
    this.reminders.set(value);
    writeLocal("lockin.reminders", value);
  }
  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl("/login", { replaceUrl: true });
  }
}
