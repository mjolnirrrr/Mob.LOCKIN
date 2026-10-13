import { Component, Input, inject } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular/standalone";
import { StudyTask } from "../../models/models";
import { MockDataService } from "../../services/mock-data.service";
import { AddQuizModalComponent } from "../add-quiz-modal/add-quiz-modal.component";
@Component({
  selector: "app-task-list",
  standalone: true,
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.scss"],
})
export class TaskListComponent {
  @Input() tasks: StudyTask[] = [];
  readonly data = inject(MockDataService);
  private modal = inject(ModalController);
  private alert = inject(AlertController);
  async edit(task: StudyTask): Promise<void> {
    const modal = await this.modal.create({
      component: AddQuizModalComponent,
      componentProps: { task },
      cssClass: "planner-modal",
    });
    await modal.present();
  }
  async remove(task: StudyTask): Promise<void> {
    const alert = await this.alert.create({
      header: "Delete task?",
      message: "This removes the task from your planner.",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Delete",
          role: "destructive",
          handler: () => this.data.removeTask(task.id),
        },
      ],
    });
    await alert.present();
  }
}
