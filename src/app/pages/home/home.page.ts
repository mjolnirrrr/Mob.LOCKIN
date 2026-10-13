import { TaskListComponent } from "../../components/task-list/task-list.component";
import { readLocal } from "../../services/local-store";
import { Component, inject } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { Router } from "@angular/router";
import {
  IonContent,
  IonIcon,
  ModalController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  notificationsOutline,
  checkmarkCircle,
  ellipseOutline,
  chevronForward,
  addOutline,
  folderOutline,
  calculatorOutline,
  planetOutline,
  flaskOutline,
  leafOutline,
} from "ionicons/icons";
import { MockDataService } from "../../services/mock-data.service";
import { AddQuizModalComponent } from "../../components/add-quiz-modal/add-quiz-modal.component";
import { AddMaterialModalComponent } from "../../components/add-material-modal/add-material-modal.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [TaskListComponent, IonContent, IonIcon, TitleCasePipe],
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  // Dependency Injection using inject()
  public data = inject(MockDataService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  greeting(): string {
    const hour = new Date().getHours();
    return hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";
  }

  todayLabel(): string {
    return this.data.now().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  motivation(): string {
    const total = this.data.todaysTasks().length;
    const done = this.data.todaysCompleted();
    if (!total) return "A clear day is a good chance to plan ahead.";
    if (done === total) return "All tasks completed — great work today.";
    if (done === 0)
      return "Start small. Your first task is ready when you are.";
    if (done * 2 < total)
      return "You’re off to a good start. Keep the momentum.";
    if (done * 2 === total)
      return "Halfway there — one focused block at a time.";
    return "The finish line is close. Keep going.";
  }
  constructor() {
    addIcons({
      notificationsOutline,
      checkmarkCircle,
      ellipseOutline,
      chevronForward,
      addOutline,
      folderOutline,
      calculatorOutline,
      planetOutline,
      flaskOutline,
      leafOutline,
    });
  }

  showUpcoming(): boolean {
    return readLocal("lockin.reminders", true);
  }
  goProfile(): void {
    this.router.navigateByUrl("/tabs/profile");
  }

  goCalendar(): void {
    this.router.navigateByUrl("/tabs/calendar");
  }

  goStudy(): void {
    this.router.navigateByUrl("/tabs/study");
  }

  async openAddQuiz(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddQuizModalComponent,
      cssClass: "planner-modal",
    });
    await modal.present();
  }

  async openAddMaterial(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddMaterialModalComponent,
      cssClass: "planner-modal",
    });
    await modal.present();
  }
}
