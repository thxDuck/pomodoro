import { Component } from "@angular/core";
import { PomodoroSettings } from "../../../models/pomodoro-types";
import { PomodoroConfigService } from "../../../services/pomodoro-config.service";

@Component({
	selector: "app-configuration",
	imports: [],
	templateUrl: "./configuration.component.html",
	styleUrl: "./configuration.component.scss",
})
export class ConfigurationComponent {
public pomodoroSettings: PomodoroSettings;

	constructor(private configurationService: PomodoroConfigService) {
		this.pomodoroSettings = { ...this.configurationService.config() };
	}
}
