import { Component, inject } from "@angular/core";
import { FocusService } from "../../services/focus.service";
@Component({
  selector: "app-focus-timer",
  standalone: true,
  templateUrl: "./focus-timer.component.html",
  styleUrls: ["./focus-timer.component.scss"],
})
export class FocusTimerComponent {
  readonly focus = inject(FocusService);
}
