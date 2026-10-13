import { TaskListComponent } from "../../components/task-list/task-list.component";
import { localDate } from "../../services/local-store";
import { Component, computed, signal } from "@angular/core";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton,
  ModalController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  chevronBack,
  chevronForward,
  addOutline,
  calendarClearOutline,
} from "ionicons/icons";
import { MockDataService } from "../../services/mock-data.service";
import { AddQuizModalComponent } from "../../components/add-quiz-modal/add-quiz-modal.component";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [
    TaskListComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonFab,
    IonFabButton,
  ],
  templateUrl: "./calendar.page.html",
  styleUrls: ["./calendar.page.scss"],
})
export class CalendarPage {
  selectedDate = signal(this.data.today());
  weekOffset = signal(0);

  constructor(
    public data: MockDataService,
    private modalCtrl: ModalController,
  ) {
    addIcons({ chevronBack, chevronForward, addOutline, calendarClearOutline });
  }

  weekDays = computed(() => {
    const base = new Date(this.data.today() + "T12:00:00");
    base.setDate(base.getDate() - base.getDay() + this.weekOffset() * 7);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push({
        date: localDate(d),
        dow: d.toLocaleDateString(undefined, { weekday: "narrow" }),
        dom: d.getDate(),
      });
    }
    return days;
  });

  monthLabel = computed(() => {
    const first = this.weekDays()[0];
    return new Date(first.date + "T12:00:00").toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  });

  selectedDateLabel = computed(() =>
    new Date(this.selectedDate() + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
  );

  dayTasks = computed(() => this.data.tasksForDate(this.selectedDate()));

  today(): void {
    this.weekOffset.set(0);
    this.selectedDate.set(this.data.today());
  }
  shiftWeek(dir: number) {
    this.weekOffset.update((v) => v + dir);
    this.selectedDate.set(this.weekDays()[0].date);
  }

  async openAddQuiz() {
    const modal = await this.modalCtrl.create({
      component: AddQuizModalComponent,
      cssClass: "planner-modal",
      componentProps: { initialDate: this.selectedDate() },
    });
    await modal.present();
  }
}
