import { readLocal, writeLocal, localDate, timeMinutes } from "./local-store";
import { Injectable, computed, signal, effect } from "@angular/core";
import { Material, StudyTask, Subject, UserProfile } from "../models/models";

@Injectable({ providedIn: "root" })
export class MockDataService {
  readonly now = signal(new Date());
  private readonly clock = setInterval(() => this.now.set(new Date()), 30000);
  ngOnDestroy(): void {
    clearInterval(this.clock);
  }
  private readonly _subjects = signal<Subject[]>([
    {
      id: "calc",
      name: "Calculus",
      icon: "calculator-outline",
      color: "var(--subject-calculus)",
      topicCount: 0,
      progress: 0,
    },
    {
      id: "phys",
      name: "Physics",
      icon: "planet-outline",
      color: "var(--subject-physics)",
      topicCount: 0,
      progress: 0,
    },
    {
      id: "chem",
      name: "Chemistry",
      icon: "flask-outline",
      color: "var(--subject-chemistry)",
      topicCount: 0,
      progress: 0,
    },
    {
      id: "bio",
      name: "Biology",
      icon: "leaf-outline",
      color: "var(--subject-biology)",
      topicCount: 0,
      progress: 0,
    },
  ]);

  private readonly _tasks = signal<StudyTask[]>([
    {
      id: "t1",
      title: "Review Calculus Notes",
      subjectId: "calc",
      type: "session",
      date: this.today(),
      startTime: "9:00 AM",
      endTime: "10:00 AM",
      done: true,
    },
    {
      id: "t2",
      title: "Practice Quiz",
      subjectId: "phys",
      type: "quiz",
      date: this.today(),
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      done: true,
    },
    {
      id: "t3",
      title: "Read Physics Chapter 3",
      subjectId: "phys",
      type: "activity",
      date: this.today(),
      startTime: "2:00 PM",
      done: false,
    },
    {
      id: "t4",
      title: "Study Session",
      subjectId: "phys",
      type: "session",
      date: this.today(),
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      done: false,
    },
    {
      id: "t5",
      title: "Chemistry Lab Prep",
      subjectId: "chem",
      type: "activity",
      date: this.addDays(1),
      startTime: "10:00 AM",
      done: false,
    },
    {
      id: "t6",
      title: "Biology Flashcards",
      subjectId: "bio",
      type: "quiz",
      date: this.addDays(2),
      startTime: "4:00 PM",
      done: false,
    },
  ]);

  private readonly _materials = signal<Material[]>([
    {
      id: "m1",
      name: "Calculus Notes.pdf",
      subjectId: "calc",
      kind: "pdf",
      size: "2.4 MB",
      addedOn: this.today(),
    },
    {
      id: "m2",
      name: "Physics Formulas.png",
      subjectId: "phys",
      kind: "image",
      size: "1.2 MB",
      addedOn: this.today(),
    },
    {
      id: "m3",
      name: "Chapter 3 Summary.docx",
      subjectId: "chem",
      kind: "doc",
      size: "320 KB",
      addedOn: this.addDays(-1),
    },
    {
      id: "m4",
      name: "Graph Example.png",
      subjectId: "calc",
      kind: "image",
      size: "1.1 MB",
      addedOn: this.addDays(-2),
    },
    {
      id: "m5",
      name: "Formula Sheet.docx",
      subjectId: "phys",
      kind: "doc",
      size: "210 KB",
      addedOn: this.addDays(-3),
    },
  ]);

  private readonly _profile = signal<UserProfile>({
    name: "Mark John Esteban",
    email: "markjohn@example.com",
    avatarInitials: "ME",
    studyGoal: "Build a consistent study routine.",
    school: "",
  });

  readonly sessions = signal<{ id: string; date: string; seconds: number }[]>(
    readLocal("lockin.sessions", []),
  );
  readonly studyHours = computed(() =>
    (this.sessions().reduce((sum, s) => sum + s.seconds, 0) / 3600).toFixed(1),
  );
  readonly completedQuizzes = computed(
    () => this.tasks().filter((t) => t.type === "quiz" && t.done).length,
  );
  readonly streak = computed(() => {
    const dates = new Set(this.sessions().map((s) => s.date));
    let count = 0;
    const day = new Date(this.now());
    if (!dates.has(localDate(day))) day.setDate(day.getDate() - 1);
    while (dates.has(localDate(day))) {
      count++;
      day.setDate(day.getDate() - 1);
    }
    return count;
  });
  readonly upcoming = computed(
    () =>
      this.tasks()
        .filter(
          (t) =>
            !t.done &&
            (t.date > this.today() ||
              (t.date === this.today() &&
                timeMinutes(t.startTime) >=
                  new Date().getHours() * 60 + new Date().getMinutes())),
        )
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            timeMinutes(a.startTime) - timeMinutes(b.startTime),
        )[0],
  );
  constructor() {
    const tasks = readLocal("lockin.tasks", this._tasks());
    const materials = readLocal("lockin.materials", this._materials());
    this._tasks.set(Array.isArray(tasks) ? tasks : []);
    this._materials.set(Array.isArray(materials) ? materials : []);
    this._profile.set({
      ...this._profile(),
      ...readLocal("lockin.profile", this._profile()),
    });
    effect(() => writeLocal("lockin.tasks", this._tasks()), {
      allowSignalWrites: true,
    });
    effect(() => writeLocal("lockin.materials", this._materials()), {
      allowSignalWrites: true,
    });
    effect(() => writeLocal("lockin.profile", this._profile()), {
      allowSignalWrites: true,
    });
    effect(() => writeLocal("lockin.sessions", this.sessions()), {
      allowSignalWrites: true,
    });
  }
  updateProfile(
    value: Pick<UserProfile, "name" | "email" | "studyGoal" | "school">,
  ): void {
    const parts = value.name.trim().split(/\s+/);
    this._profile.update((p) => ({
      ...p,
      ...value,
      avatarInitials: (
        parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
      ).toUpperCase(),
    }));
  }
  updateTask(id: string, task: Partial<StudyTask>): void {
    this._tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, ...task, id } : t)),
    );
  }
  removeTask(id: string): void {
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }
  updateMaterial(id: string, material: Partial<Material>): void {
    this._materials.update((list) =>
      list.map((m) => (m.id === id ? { ...m, ...material, id } : m)),
    );
  }
  addFocus(seconds: number): void {
    if (seconds > 0)
      this.sessions.update((list) => [
        ...list,
        { id: crypto.randomUUID(), date: this.today(), seconds },
      ]);
  }

  // Public read-only signals
  readonly subjects = computed(() =>
    this._subjects().map((subject) => {
      const tasks = this._tasks().filter((t) => t.subjectId === subject.id);
      return {
        ...subject,
        topicCount: tasks.length,
        progress: tasks.length
          ? Math.round(
              (tasks.filter((t) => t.done).length / tasks.length) * 100,
            )
          : 0,
      };
    }),
  );
  readonly tasks = this._tasks.asReadonly();
  readonly materials = this._materials.asReadonly();
  readonly profile = this._profile.asReadonly();

  readonly todaysTasks = computed(() =>
    this._tasks()
      .filter((t) => t.date === this.today())
      .sort((a, b) => timeMinutes(a.startTime) - timeMinutes(b.startTime)),
  );

  readonly completionRate = computed(() => {
    const tasks = this.todaysTasks();
    if (!tasks.length) return 0;
    return Math.round(
      (tasks.filter((t) => t.done).length / tasks.length) * 100,
    );
  });

  readonly todaysCompleted = computed(
    () => this.todaysTasks().filter((task) => task.done).length,
  );

  // ---- helpers ----
  today(): string {
    return localDate(this.now());
  }

  addDays(offset: number): string {
    const d = new Date(this.now());
    d.setDate(d.getDate() + offset);
    return localDate(d);
  }

  subjectById(id: string): Subject | undefined {
    return this.subjects().find((s) => s.id === id);
  }

  tasksForDate(date: string): StudyTask[] {
    return this._tasks()
      .filter((t) => t.date === date)
      .sort((a, b) => timeMinutes(a.startTime) - timeMinutes(b.startTime));
  }

  // ---- mutations ----
  toggleTaskDone(id: string): void {
    this._tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  addTask(task: Omit<StudyTask, "id" | "done">): void {
    const id = "t" + Math.random().toString(36).slice(2, 9);
    this._tasks.update((list) => [...list, { ...task, id, done: false }]);
  }

  addMaterial(material: Omit<Material, "id" | "addedOn">): void {
    const id = "m" + Math.random().toString(36).slice(2, 9);
    this._materials.update((list) => [
      { ...material, id, addedOn: this.today() },
      ...list,
    ]);
  }

  removeMaterial(id: string): void {
    this._materials.update((list) => list.filter((m) => m.id !== id));
  }
}
