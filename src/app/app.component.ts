import { ThemeService } from "./services/theme.service";
import { storageError } from "./services/local-store";
import { Component, inject } from "@angular/core";
import { addIcons } from "ionicons";
import {
  calculatorOutline,
  planetOutline,
  flaskOutline,
  leafOutline,
} from "ionicons/icons";
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  readonly theme = inject(ThemeService);
  readonly storageError = storageError;
  constructor() {
    addIcons({ calculatorOutline, planetOutline, flaskOutline, leafOutline });
  }
}
