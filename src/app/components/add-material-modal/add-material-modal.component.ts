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
import { Material } from "../../models/models";
@Component({
  selector: "app-add-material-modal",
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent],
  templateUrl: "./add-material-modal.component.html",
  styleUrls: ["./add-material-modal.component.scss"],
})
export class AddMaterialModalComponent implements OnInit {
  @Input() material?: Material;
  @Input() initialSubject = "";
  readonly data = inject(MockDataService);
  private modalCtrl = inject(ModalController);
  name = "";
  subjectId = "";
  kind: Material["kind"] = "pdf";
  url = "";
  size = "Local reference";
  error = "";
  ngOnInit(): void {
    this.subjectId = this.initialSubject;
    if (this.material) {
      const m = this.material;
      this.name = m.name;
      this.subjectId = m.subjectId;
      this.kind = m.kind;
      this.url = m.url || "";
      this.size = m.size;
    }
  }
  selectFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.name = file.name;
    this.size =
      file.size < 1024 * 1024
        ? Math.max(1, Math.round(file.size / 1024)) + " KB"
        : (file.size / 1024 / 1024).toFixed(1) + " MB";
    this.kind = file.type.startsWith("image/")
      ? "image"
      : file.name.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "doc";
  }
  dismiss(): void {
    this.modalCtrl.dismiss(null, "cancel");
  }
  done(): void {
    this.error = "";
    if (!this.name.trim() || !this.subjectId) {
      this.error = "Enter a name and choose a subject.";
      return;
    }
    if (this.kind === "link") {
      try {
        const url = new URL(this.url);
        if (!["https:", "http:"].includes(url.protocol)) throw new Error();
      } catch {
        this.error = "Enter a complete http:// or https:// link.";
        return;
      }
    }
    const value = {
      name: this.name.trim(),
      subjectId: this.subjectId,
      kind: this.kind,
      size: this.kind === "link" ? "Web reference" : this.size,
      url: this.kind === "link" ? this.url.trim() : undefined,
    };
    if (this.material) this.data.updateMaterial(this.material.id, value);
    else this.data.addMaterial(value);
    this.modalCtrl.dismiss({ saved: true }, "confirm");
  }
}
