import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
	selector: "app-configuration",
	imports: [ReactiveFormsModule],
	templateUrl: "./configuration.component.html",
	styleUrl: "./configuration.component.scss",
})
export class ConfigurationComponent {
	pomodoroForm = new FormGroup({
		focusTime: new FormControl(25),
		shortBreakTime: new FormControl(5),
		longBreakTime: new FormControl(15),
		focusSessions: new FormControl(4),
		autoStartBreak: new FormControl(false),
		autoStartFocus: new FormControl(false),
	});
}
