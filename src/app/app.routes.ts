import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { MockAuthService } from "./services/mock-auth.service";
const authGuard: CanActivateFn = () =>
  inject(MockAuthService).isAuthenticated() ||
  inject(Router).createUrlTree(["/login"]);
import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "onboarding", pathMatch: "full" },
  {
    path: "onboarding",
    loadComponent: () =>
      import("./pages/auth/onboarding.page").then((m) => m.OnboardingPage),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/auth/login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "signup",
    loadComponent: () =>
      import("./pages/auth/signup/signup.page").then((m) => m.SignupPage),
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("./pages/auth/forgot-password/forgot-password.page").then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./pages/auth/reset-password/reset-password.page").then(
        (m) => m.ResetPasswordPage,
      ),
  },
  {
    path: "tabs",
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () =>
      import("./pages/tabs/tabs.page").then((m) => m.TabsPage),
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "home",
        loadComponent: () =>
          import("./pages/home/home.page").then((m) => m.HomePage),
      },
      {
        path: "calendar",
        loadComponent: () =>
          import("./pages/calendar/calendar.page").then((m) => m.CalendarPage),
      },
      {
        path: "study",
        loadComponent: () =>
          import("./pages/study/study.page").then((m) => m.StudyPage),
      },
      {
        path: "stats",
        loadComponent: () =>
          import("./pages/stats/stats.page").then((m) => m.StatsPage),
      },
      {
        path: "profile",
        loadComponent: () =>
          import("./pages/profile/profile.page").then((m) => m.ProfilePage),
      },
    ],
  },
  {
    path: "materials",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/materials/materials.page").then((m) => m.MaterialsPage),
  },
  { path: "**", redirectTo: "onboarding" },
];
