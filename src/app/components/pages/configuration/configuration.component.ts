import { Component, signal } from "@angular/core";
import { PomodoroSettings } from "../../../models/pomodoro-types";
import { PomodoroConfigService } from "../../../services/pomodoro-config.service";

@Component({
	selector: "app-configuration",
	imports: [],
	templateUrl: "./configuration.component.html",
	styleUrl: "./configuration.component.scss",
})
export class ConfigurationComponent {
	public pomodoroSettings = signal<PomodoroSettings>({
		focusTime: 25,
		shortBreakTime: 5,
		longBreakTime: 15,
		focusSessions: 4,
		autoStartBreak: false,
		autoStartFocus: false,
	});
	initalConfig: PomodoroSettings;

	constructor(private configurationService: PomodoroConfigService) {
		this.pomodoroSettings.set(this.configurationService.config());
		this.initalConfig = { ...this.configurationService.config() };
	}
	public saveConfiguration() {
		console.log("this.pomodoroSettings : ", this.pomodoroSettings());
		this.configurationService.updateConfig(this.pomodoroSettings());
	}
	public resetConfiguration() {
		console.log("resetConfiguration");
		this.pomodoroSettings.set(this.initalConfig);
	}

	/**
	 * Called by template `(input)` binding, so, each time the value is changed in the input, this method is called
	 * @param key Key of PomodoroSettings
	 * @param value New Value
	 */
	public updateSetting<K extends keyof PomodoroSettings>(
		key: K,
		value: PomodoroSettings[K],
	) {
		this.pomodoroSettings.update((s) => ({ ...s, [key]: value }));
	}
}
