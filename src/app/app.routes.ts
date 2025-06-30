import { Routes } from "@angular/router";
import { ConfigurationComponent } from "./components/pages/configuration/configuration.component";
import { PomodoroComponent } from "./components/pages/pomodoro/pomodoro.component";

export const routes: Routes = [
	{ path: "", component: PomodoroComponent },
	{ path: "configuration", component: ConfigurationComponent },
	// { path: "tasks", component: TaskComponent },
];
