import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { checkmarkOutline } from "ionicons/icons";

import { MockAuthService } from "../../../services/mock-auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
    IonIcon,
  ],
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss"],
})
export class ResetPasswordPage {
  password = "";
  confirmPassword = "";
  loading = signal(false);
  error = signal("");
  done = signal(false);

  constructor(
    private auth: MockAuthService,
    private router: Router,
  ) {
    addIcons({ checkmarkOutline });
  }

  async reset() {
    this.error.set("");

    if (this.password.length < 6) {
      this.error.set("Password must be at least 6 characters.");
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set("Passwords do not match.");
      return;
    }

    this.loading.set(true);
    await this.auth.resetPassword(this.password);
    this.loading.set(false);
    this.done.set(true);
  }

  goLogin() {
    this.router.navigateByUrl("/login");
  }

  goHome() {
    this.router.navigateByUrl("/");
  }
}
