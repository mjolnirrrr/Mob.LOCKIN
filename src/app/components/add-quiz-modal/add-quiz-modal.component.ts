import { Component, Input, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ModalController,
} from "@ionic/angular/standalone";
import { MockDataService } from "../../services/mock-data.service";
import { StudyTask } from "../../models/models";
import { timeMinutes } from "../../services/local-store";
@Component({
  selector: "app-add-quiz-modal",
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent],
  templateUrl: "./add-quiz-modal.component.html",
  styleUrls: ["./add-quiz-modal.component.scss"],
})
export class AddQuizModalComponent implements OnInit {
  @Input() task?: StudyTask;
  @Input() initialDate?: string;
  readonly data = inject(MockDataService);
  private modalCtrl = inject(ModalController);
  title = "";
  subjectId = "";
  type: StudyTask["type"] = "quiz";
  date = this.data.today();
  time = "14:00";
  endTime = "";
  description = "";
  error = "";
  ngOnInit(): void {
    if (this.initialDate) this.date = this.initialDate;
    if (this.task) {
      const t = this.task;
      this.title = t.title;
      this.subjectId = t.subjectId;
      this.type = t.type;
      this.date = t.date;
      this.time = this.to24(t.startTime);
      this.endTime = t.endTime ? this.to24(t.endTime) : "";
      this.description = t.description || "";
    }
  }
  private to24(value: string): string {
    const minutes = timeMinutes(value);
    return (
      String(Math.floor(minutes / 60)).padStart(2, "0") +
      ":" +
      String(minutes % 60).padStart(2, "0")
    );
  }
  private displayTime(value: string): string {
    const [h, m] = value.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }
  dismiss(): void {
    this.modalCtrl.dismiss(null, "cancel");
  }
  create(): void {
    if (!this.title.trim() || !this.subjectId || !this.date || !this.time) {
      this.error = "Add a title, subject, date and start time.";
      return;
    }
    if (this.endTime && timeMinutes(this.endTime) <= timeMinutes(this.time)) {
      this.error = "End time must be later than start time on the same day.";
      return;
    }
    const value = {
      title: this.title.trim(),
      subjectId: this.subjectId,
      type: this.type,
      date: this.date,
      startTime: this.displayTime(this.time),
      endTime: this.endTime ? this.displayTime(this.endTime) : undefined,
      description: this.description.trim(),
    };
    if (this.task) this.data.updateTask(this.task.id, value);
    else this.data.addTask(value);
    this.modalCtrl.dismiss({ saved: true }, "confirm");
  }
}
