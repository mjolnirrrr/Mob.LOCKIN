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
  IonIcon,
  IonSpinner,
  IonText,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  logoGoogle,
  logoApple,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
import { MockAuthService } from "../../../services/mock-auth.service";

@Component({
  selector: "app-login",
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
    IonIcon,
    IonSpinner,
    IonText,
  ],
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage {
  email = "";
  password = "";
  loading = signal(false);
  error = signal("");
  showPassword = signal(false);

  constructor(
    private auth: MockAuthService,
    private router: Router,
  ) {
    addIcons({ logoGoogle, logoApple, eyeOutline, eyeOffOutline });
  }

  async login() {
    this.error.set("");
    this.loading.set(true);
    const res = await this.auth.login(this.email, this.password);
    this.loading.set(false);
    if (res.success) {
      this.router.navigateByUrl("/tabs/home");
    } else {
      this.error.set(res.message ?? "Something went wrong.");
    }
  }
}
