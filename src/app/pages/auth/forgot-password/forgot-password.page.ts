import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
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
} from "@ionic/angular/standalone";

import { MockAuthService } from "../../../services/mock-auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
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
  ],
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage {
  email = "";
  loading = signal(false);
  error = signal("");
  sent = signal(false);

  constructor(
    private auth: MockAuthService,
    private router: Router,
  ) {}

  async send() {
    this.error.set("");
    this.sent.set(false);
    this.loading.set(true);
    const res = await this.auth.sendResetLink(this.email);
    this.loading.set(false);

    if (res.success) {
      this.sent.set(true);
      setTimeout(() => this.router.navigateByUrl("/reset-password"), 900);
    } else {
      this.error.set(res.message ?? "Something went wrong.");
    }
  }
}
