import { FormsModule } from "@angular/forms";
import { Material } from "../../models/models";
import { AlertController } from "@ionic/angular/standalone";
import { Component, computed, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonIcon,
  IonButton,
  IonChip,
  IonLabel,
  ModalController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  documentTextOutline,
  imageOutline,
  trashOutline,
  addOutline,
} from "ionicons/icons";
import { MockDataService } from "../../services/mock-data.service";
import { AddMaterialModalComponent } from "../../components/add-material-modal/add-material-modal.component";

@Component({
  selector: "app-materials",
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonIcon,
    IonButton,
    IonChip,
    IonLabel,
  ],
  templateUrl: "./materials.page.html",
  styleUrls: ["./materials.page.scss"],
})
export class MaterialsPage {
  activeFilter = signal("");
  query = signal("");

  constructor(
    public data: MockDataService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private alert: AlertController,
  ) {
    addIcons({ documentTextOutline, imageOutline, trashOutline, addOutline });
    const qp = this.route.snapshot.queryParamMap.get("subjectId");
    if (qp) this.activeFilter.set(qp);
  }

  filtered = computed(() => {
    const filter = this.activeFilter();
    return this.data
      .materials()
      .filter(
        (m) =>
          (!filter || m.subjectId === filter) &&
          m.name.toLowerCase().includes(this.query().toLowerCase()),
      );
  });

  setFilter(id: string) {
    this.activeFilter.set(id);
  }

  subjectName(id: string) {
    return this.data.subjectById(id)?.name ?? "";
  }

  async remove(id: string) {
    const alert = await this.alert.create({
      header: "Delete material?",
      message: "This removes the saved reference.",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Delete",
          role: "destructive",
          handler: () => this.data.removeMaterial(id),
        },
      ],
    });
    await alert.present();
  }
  ionViewWillEnter(): void {
    this.activeFilter.set(
      this.route.snapshot.queryParamMap.get("subjectId") || "",
    );
  }
  async edit(material: Material) {
    const modal = await this.modalCtrl.create({
      component: AddMaterialModalComponent,
      componentProps: { material },
      cssClass: "planner-modal",
    });
    await modal.present();
  }
  safeUrl(url?: string): string | null {
    try {
      const parsed = new URL(url || "");
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
    } catch {
      return null;
    }
  }

  async openAddMaterial() {
    const modal = await this.modalCtrl.create({
      component: AddMaterialModalComponent,
      cssClass: "planner-modal",
      componentProps: { initialSubject: this.activeFilter() },
    });
    await modal.present();
  }
}
