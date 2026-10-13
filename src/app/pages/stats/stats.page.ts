import { Component } from "@angular/core";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonProgressBar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  flameOutline,
  timeOutline,
  ribbonOutline,
  trendingUpOutline,
} from "ionicons/icons";
import { MockDataService } from "../../services/mock-data.service";

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonProgressBar,
  ],
  templateUrl: "./stats.page.html",
  styleUrls: ["./stats.page.scss"],
})
export class StatsPage {
  constructor(public data: MockDataService) {
    addIcons({ flameOutline, timeOutline, ribbonOutline, trendingUpOutline });
  }

  progressMessage(): string {
    const rate = this.data.completionRate();
    if (rate === 100)
      return "Today’s plan is complete. Take a moment to enjoy the win.";
    if (rate >= 50)
      return "You’ve built solid momentum today. Keep the next step simple.";
    if (rate > 0)
      return "Progress is already moving. Every completed task counts.";
    return "Your progress will appear here as you complete tasks and focus sessions.";
  }
}
