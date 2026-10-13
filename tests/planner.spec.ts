import { test, expect, Page } from "@playwright/test";
const paths = [
  "/onboarding",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/tabs/home",
  "/tabs/calendar",
  "/tabs/study",
  "/materials",
  "/tabs/stats",
  "/tabs/profile",
];
async function seed(page: Page, theme = "light") {
  await page.addInitScript(
    ({ theme }) => {
      localStorage.setItem("lockin.auth", "true");
      localStorage.setItem("lockin.theme", JSON.stringify(theme));
    },
    { theme },
  );
}
async function route(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("ion-content").last()).toBeVisible();
}
async function login(
  page: Page,
  email = "markjohn@example.com",
  password = "123456",
) {
  await route(page, "/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/tabs\/home/);
}

test("login validates inputs, persists session, logout protects every private route", async ({
  page,
}) => {
  await route(page, "/tabs/home");
  await expect(page).toHaveURL(/login/);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByText("Enter your email and password.")).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("bad");
  await page.getByLabel("Password", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("markjohn@example.com");
  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(
    page.getByText("Password must be at least 6 characters."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show or hide password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByLabel("Password", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/tabs\/home/);
  await expect(
    page.getByRole("heading", { name: /Mark John Esteban/ }),
  ).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/tabs\/home/);
  await page.locator('ion-tab-button[tab="profile"]').click();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(page).toHaveURL(/login/);
  for (const path of paths.filter(
    (x) => x.startsWith("/tabs/") || x === "/materials",
  )) {
    await page.goto(path);
    await expect(page).toHaveURL(/login/);
  }
  await login(page, "someone@gmail.com", "abcdef");
});

test("signup, forgotten password and demo reset flow", async ({ page }) => {
  await route(page, "/signup");
  await page.getByLabel("Full name", { exact: true }).fill("Test Student");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("abcdef");
  await page.getByLabel("Confirm password", { exact: true }).fill("abcdeg");
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
  await page.getByLabel("Confirm password", { exact: true }).fill("abcdef");
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  await expect(
    page.getByText("Please acknowledge the prototype notice to continue."),
  ).toBeVisible();
  await page.getByRole("checkbox").click();
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  await expect(page).toHaveURL(/tabs\/home/);
  await expect(
    page.getByRole("heading", { name: /Test Student/ }),
  ).toBeVisible();
  await route(page, "/forgot-password");
  await page.getByRole("button", { name: "Continue to reset" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByRole("button", { name: "Continue to reset" }).click();
  await expect(page).toHaveURL(/reset-password/);
  await page.getByLabel("New password", { exact: true }).fill("123");
  await page.getByLabel("Confirm new password", { exact: true }).fill("123");
  await page
    .getByRole("button", { name: "Reset password", exact: true })
    .click();
  await expect(
    page.getByText("Password must be at least 6 characters."),
  ).toBeVisible();
  await page.getByLabel("New password", { exact: true }).fill("abcdef");
  await page.getByLabel("Confirm new password", { exact: true }).fill("abcdeg");
  await page
    .getByRole("button", { name: "Reset password", exact: true })
    .click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
  await page.getByLabel("Confirm new password", { exact: true }).fill("abcdef");
  await page
    .getByRole("button", { name: "Reset password", exact: true })
    .click();
  await expect(page.getByText("Password updated!")).toBeVisible();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/login/);
});

test("profile save/cancel/validation updates home, initials and survives refresh", async ({
  page,
}) => {
  await seed(page);
  await route(page, "/tabs/profile");
  await page.getByLabel("Full Name", { exact: false }).fill("");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(
    page.getByText("Full name, email and study goal are required."),
  ).toBeVisible();
  await page
    .getByLabel("Full Name", { exact: false })
    .fill("Mark John Updated");
  await page.getByLabel("Email Address", { exact: false }).fill("bad");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page
    .getByLabel("Email Address", { exact: false })
    .fill("mark@example.com");
  await page
    .getByLabel("Study Goal", { exact: false })
    .fill("Finish the CS project");
  await page
    .getByLabel("School / Course", { exact: false })
    .fill("Computer Science");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Profile saved. Your planner is up to date.",
  );
  await expect(page.locator(".avatar")).toHaveText("MU");
  await page.getByLabel("Full Name", { exact: false }).fill("Discard this");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator("ion-alert")).toHaveCount(0);
  await expect(page.locator("ion-modal")).toHaveCount(0);
  await expect(page.getByLabel("Full Name", { exact: false })).toHaveValue(
    "Mark John Updated",
  );
  await page.locator('ion-tab-button[tab="home"]').click();
  await expect(
    page.getByRole("heading", { name: /Mark John Updated/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Mark John Updated/ }),
  ).toBeVisible();
  await page.locator('ion-tab-button[tab="profile"]').click();
  await expect(page.getByLabel("Study Goal", { exact: false })).toHaveValue(
    "Finish the CS project",
  );
  await page.getByText("Help & Support", { exact: true }).click();
  await expect(page.getByText(/Add tasks from Home or Calendar/)).toBeVisible();
  await page.getByText("Terms & Privacy", { exact: true }).click();
  await expect(
    page.getByText(/This prototype stores your planner/),
  ).toBeVisible();
});

test("tasks create, sort, edit, complete, delete, cancel and persist", async ({
  page,
}) => {
  await seed(page);
  await route(page, "/tabs/home");
  const titles = await page.locator(".task-copy h3").allTextContents();
  expect(titles.indexOf("Practice Quiz")).toBeLessThan(
    titles.indexOf("Read Physics Chapter 3"),
  );
  await page.getByRole("button", { name: "+ Add a task", exact: true }).click();
  await page.getByRole("button", { name: "Create task", exact: true }).click();
  await expect(
    page.getByText("Add a title, subject, date and start time."),
  ).toBeVisible();
  await page.getByLabel("Title", { exact: true }).fill("Regression study task");
  await page.getByLabel("Subject", { exact: true }).selectOption("calc");
  await page.getByLabel("Type", { exact: true }).selectOption("session");
  await page.getByLabel("Start time", { exact: true }).fill("14:00");
  await page.getByLabel("End time", { exact: false }).fill("11:00");
  await page.getByRole("button", { name: "Create task", exact: true }).click();
  await expect(
    page.getByText("End time must be later than start time on the same day."),
  ).toBeVisible();
  await page.getByLabel("End time", { exact: false }).fill("15:00");
  await page.getByRole("button", { name: "Create task", exact: true }).click();
  await expect(page.locator("ion-modal")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Regression study task", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Regression study task", exact: true })
    .click();
  await page.getByLabel("Title", { exact: true }).fill("Edited study task");
  await page.getByRole("button", { name: "Save task", exact: true }).click();
  await page
    .getByRole("button", { name: "Complete: Edited study task", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Mark incomplete: Edited study task",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Edited study task", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Edited study task", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator("ion-alert")).toHaveCount(0);
  await expect(page.locator("ion-modal")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Edited study task", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Edited study task", exact: true })
    .click();
  await page
    .locator("ion-alert")
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edited study task", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Edited study task", exact: true }),
  ).toHaveCount(0);
  await page.locator('ion-tab-button[tab="calendar"]').click();
  await page.getByRole("button", { name: "Next week" }).click();
  const selected = await page
    .locator(".day-cell.active")
    .getAttribute("aria-label");
  await page.getByRole("button", { name: "+ Add task", exact: true }).click();
  await expect(page.getByLabel("Date", { exact: true })).toHaveValue(selected!);
  await page.getByRole("button", { name: "Close task form" }).click();
  await page.getByRole("button", { name: "Previous week" }).click();
  await page.getByRole("button", { name: "Today", exact: true }).click();
});

test("materials add file metadata/link, validation, search/filter, edit/delete and persistence", async ({
  page,
}) => {
  await seed(page);
  await route(page, "/materials");
  await page
    .getByRole("button", { name: "+ Add material", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save material", exact: true })
    .click();
  await expect(
    page.getByText("Enter a name and choose a subject."),
  ).toBeVisible();
  await page.locator("input[type=file]").setInputFiles({
    name: "Test Notes.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("prototype test"),
  });
  await page.getByLabel("Subject", { exact: true }).selectOption("calc");
  await page
    .getByRole("button", { name: "Save material", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Test Notes.pdf", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Test Notes.pdf", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Test Notes.pdf", exact: true })
    .click();
  await page.getByLabel("Name", { exact: true }).fill("Edited Notes.pdf");
  await page
    .getByRole("button", { name: "Save material", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search materials" })
    .fill("Edited");
  await expect(page.locator(".material-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Physics", exact: true }).click();
  await expect(page.getByText("A fresh shelf.")).toBeVisible();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete Edited Notes.pdf", exact: true })
    .click();
  await page
    .locator("ion-alert")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(page.locator("ion-alert")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Delete Edited Notes.pdf", exact: true })
    .click();
  await page
    .locator("ion-alert")
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edited Notes.pdf", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search materials" }).fill("");
  await page
    .getByRole("button", { name: "+ Add material", exact: true })
    .click();
  await page.getByLabel("Type", { exact: true }).selectOption("link");
  await page.getByLabel("Name", { exact: true }).fill("Study reference");
  await page.getByLabel("Subject", { exact: true }).selectOption("phys");
  await page.getByLabel("URL", { exact: true }).fill("javascript:alert(1)");
  await page
    .getByRole("button", { name: "Save material", exact: true })
    .click();
  await expect(
    page.getByText("Enter a complete http:// or https:// link."),
  ).toBeVisible();
  await page
    .getByLabel("URL", { exact: true })
    .fill("https://example.com/notes");
  await page
    .getByRole("button", { name: "Save material", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Open reference ↗" }),
  ).toHaveAttribute("href", "https://example.com/notes");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Study reference", exact: true }),
  ).toBeVisible();
});

test("focus timer pause/resume/save and active session refresh persistence", async ({
  page,
}) => {
  await seed(page);
  await route(page, "/tabs/study");
  await page.getByRole("button", { name: "15 min", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("15:00");
  await page.getByRole("button", { name: "Start focus", exact: true }).click();
  await page.waitForTimeout(2200);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await page.getByRole("timer").textContent();
  await page.waitForTimeout(1100);
  await expect(page.getByRole("timer")).toHaveText(paused!);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Pause", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Finish & save", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "Session saved. A little progress adds up.",
  );
  const sessions = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lockin.sessions")!),
  );
  expect(sessions).toHaveLength(1);
  expect(sessions[0].seconds).toBeGreaterThan(0);
  await page.reload();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("lockin.sessions")!).length,
    ),
  ).toBe(1);
  await page.locator('ion-tab-button[tab="stats"]').click();
  await expect(page.locator(".stat-tile").first().locator("h2")).toHaveText(
    "1",
  );
});

test("theme first use follows system then saved preference wins", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await route(page, "/login");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await login(page);
  await page.locator('ion-tab-button[tab="profile"]').click();
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("switch", { name: "Dark mode", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page
    .getByRole("switch", { name: "Study reminders", exact: true })
    .click();
  await page.locator('ion-tab-button[tab="home"]').click();
  await expect(page.getByText("Room to breathe.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Room to breathe.")).toBeVisible();
});

for (const theme of ["light", "dark"])
  for (const width of [360, 768, 1280, 1920]) {
    test(`${theme} all 11 routes, task/material modals and no overflow at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90000);
      await seed(page, theme);
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const path of paths) {
        await route(page, path);
        await expect(page).toHaveURL(new RegExp(path + "$"));
        await expect(page.locator("html")).toHaveClass(
          theme === "dark" ? /dark/ : /^(?!.*dark)/,
        );
        await page.waitForTimeout(100);
        const overflow = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll(
              "main, .soft-card, .section-header, .button-row, .week-strip, .auth-container, .onboarding",
            ),
          )
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.width > 0 &&
                r.height > 0 &&
                (r.right > innerWidth + 2 || r.left < -2)
              );
            })
            .map((e) => e.className),
        );
        expect(overflow, `${path} horizontal overflow`).toEqual([]);
      }
      await route(page, "/tabs/home");
      if (width === 360) {
        const bounds = await page.locator(".task-copy").first().boundingBox();
        expect(bounds!.width).toBeGreaterThan(180);
      }
      await page
        .getByRole("button", { name: "+ Add a task", exact: true })
        .click();
      await expect(page.getByLabel("Title", { exact: true })).toBeVisible();
      await page.getByLabel("Title", { exact: true }).fill("A responsive task");
      await page.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(page.locator("ion-alert")).toHaveCount(0);
      await expect(page.locator("ion-modal")).toHaveCount(0);
      await page.getByRole("button", { name: /Add study material/ }).click();
      await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(page.locator("ion-alert")).toHaveCount(0);
      await expect(page.locator("ion-modal")).toHaveCount(0);
      expect(errors).toEqual([]);
      await expect(page.locator("ion-modal")).toHaveCount(0);
      await page
        .locator("ion-content")
        .evaluate((el: any) => el.scrollToTop(0));
      if (width === 360 || width === 1280)
        await page.screenshot({
          path: `/tmp/lockin-${theme}-${width}.png`,
          fullPage: true,
        });
    });
  }

test("empty task/material states and zero-denominator stats", async ({
  page,
}) => {
  await seed(page);
  await page.addInitScript(() => {
    localStorage.setItem("lockin.tasks", "[]");
    localStorage.setItem("lockin.materials", "[]");
  });
  await route(page, "/tabs/home");
  await expect(page.getByText("A little room to focus.")).toBeVisible();
  await route(page, "/materials");
  await expect(page.getByText("A fresh shelf.")).toBeVisible();
  await route(page, "/tabs/stats");
  await expect(page.locator(".stat-tile").nth(3).locator("h2")).toHaveText(
    "0%",
  );
});

test("local dates stay on the Philippines day across midnight UTC and calendar week boundaries", async ({
  page,
}) => {
  await seed(page);
  await page.clock.install({ time: new Date("2026-10-12T16:30:00Z") });
  await route(page, "/tabs/home");
  await expect(page.locator(".agenda .eyebrow")).toHaveText("2026-10-13");
  const tasks = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lockin.tasks")!),
  );
  expect(tasks[0].date).toBe("2026-10-13");
  expect(tasks[4].date).toBe("2026-10-14");
  await page.locator('ion-tab-button[tab="calendar"]').click();
  await expect(page.locator(".day-cell.active")).toHaveAttribute(
    "aria-label",
    "2026-10-13",
  );
  await page.getByRole("button", { name: "+ Add task", exact: true }).click();
  await expect(page.getByLabel("Date", { exact: true })).toHaveValue(
    "2026-10-13",
  );
});
