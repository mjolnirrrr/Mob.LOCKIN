import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { schoolOutline } from "ionicons/icons";

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [IonContent, IonIcon, IonButton],
  templateUrl: "./onboarding.page.html",
  styleUrls: ["./onboarding.page.scss"],
})
export class OnboardingPage {
  constructor(private router: Router) {
    addIcons({ schoolOutline });
  }

  goLogin() {
    this.router.navigateByUrl("/login");
  }

  goSignup() {
    this.router.navigateByUrl("/signup");
  }
}
