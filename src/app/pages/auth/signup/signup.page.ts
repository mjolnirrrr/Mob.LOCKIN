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
  IonCheckbox,
  IonSpinner,
  IonText,
} from "@ionic/angular/standalone";

import { MockAuthService } from "../../../services/mock-auth.service";

@Component({
  selector: "app-signup",
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
    IonCheckbox,
    IonSpinner,
    IonText,
  ],
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage {
  name = "";
  email = "";
  password = "";
  confirmPassword = "";
  agreedToTerms = false;
  loading = signal(false);
  error = signal("");

  constructor(
    private auth: MockAuthService,
    private router: Router,
  ) {}

  async signup() {
    this.error.set("");

    if (this.password !== this.confirmPassword) {
      this.error.set("Passwords do not match.");
      return;
    }
    if (!this.agreedToTerms) {
      this.error.set("Please acknowledge the prototype notice to continue.");
      return;
    }

    this.loading.set(true);
    const res = await this.auth.signup(this.name, this.email, this.password);
    this.loading.set(false);

    if (res.success) {
      this.router.navigateByUrl("/tabs/home");
    } else {
      this.error.set(res.message ?? "Something went wrong.");
    }
  }
}
