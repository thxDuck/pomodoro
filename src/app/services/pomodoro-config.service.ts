import { Injectable, signal } from "@angular/core";
import { PomodoroSettings } from "../models/pomodoro-types";

@Injectable({ providedIn: "root" })
export class PomodoroConfigService {
	private _config = signal<PomodoroSettings>({
		focusTime: 25,
		shortBreakTime: 5,
		longBreakTime: 15,
		focusSessions: 4,
		autoStartBreak: false,
		autoStartFocus: false,
	});

	get config() {
		console.log("[Get config]");
		return this._config.asReadonly();
	}

	updateConfig(pomodoroConfig: PomodoroSettings) {
		this._config.set(pomodoroConfig);
	}
}
