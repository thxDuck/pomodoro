import { Component, OnInit } from "@angular/core";
import { Temporal } from "temporal-polyfill";
import { Pomodoro } from "../../models/pomodoro-model";
import { SecondDurations, State } from "../../models/pomodoro-types";
import { handleAllValues } from "../../utilities/utilities";
import { StepComponent } from "../step/step.component";
import { TimerComponent } from "../timer/timer.component";

const ONE_SEC_DURATION = "PT1S";

@Component({
	selector: "app-pomodoro",
	imports: [TimerComponent, StepComponent],
	templateUrl: "./pomodoro.component.html",
	styleUrl: "./pomodoro.component.scss",
})
export class PomodoroComponent implements OnInit {
	public pomodoroSettings = new Pomodoro({
		focusTime: SecondDurations.Second * 5,
		shortBreakTime: SecondDurations.Second * 3,
		longBreakTime: SecondDurations.Second * 15,
		focusSessions: 2,
		autoStartBreak: true,
		autoStartFocus: true,
	});
	public currentStepIndex = -1;
	public focusSessionCounter = 1;
	public timerState: "running" | "paused" = "paused";
	public timer?: number;
	public timeRemaining!: Temporal.Duration;
	public timerText = "--:--";
	public currentState: State = "focus";
	public currentSessionDuration = 0;

	ngOnInit(): void {
		this.loadNextContext(true);
	}

	/* -------------------------------------------------------------------------- */
	/*                                    Logic                                   */
	/* -------------------------------------------------------------------------- */
	private async loadNextContext(isFirstInit = false) {
		this.stopTimer();
		this.currentStepIndex =
			(this.currentStepIndex + 1) % (this.pomodoroSettings.focusSessions * 2);
		console.log(`currentStepIndex ${this.currentStepIndex}`);
		console.log(`total ${this.pomodoroSettings.focusSessions * 2}`);
		if (isFirstInit) this.currentState = "focus";
		else this.currentState = this.getState();

		const totalDuration = this.getDurationByState(this.currentState);
		this.currentSessionDuration = totalDuration;

		const duration = this.getDurationFromSeconds(totalDuration);
		this.timeRemaining = duration;

		if (isFirstInit) return;
		if (this.currentStepIndex === 0) {
			this.focusSessionCounter = 1;
			console.log("End of steps !");
			return;
		}

		switch (this.currentState) {
			case "focus":
				if (this.currentStepIndex % 2 === 0) this.focusSessionCounter++;
				if (this.pomodoroSettings.autoStartFocus) this.runTimer();
				break;
			case "shortBreak":
				if (this.pomodoroSettings.autoStartBreak) this.runTimer();
				break;
			case "longBreak":
				if (this.pomodoroSettings.autoStartBreak) this.runTimer();
				break;
			default:
				handleAllValues(this.currentState);
				break;
		}
	}

	public stopTimer() {
		this.timerState = "paused";
		clearInterval(this.timer);
	}

	public runTimer() {
		this.timerState = "running";
		this.timer = window.setInterval(this.countDouwn.bind(this), 1000 / 4);
	}

	private countDouwn() {
		this.timeRemaining = this.timeRemaining.subtract(ONE_SEC_DURATION);
		if (this.timeRemaining.total("seconds") <= 0) this.loadNextContext();
	}

	/* -------------------------------------------------------------------------- */
	/*                                  Utilities                                 */
	/* -------------------------------------------------------------------------- */

	private getDurationFromSeconds(totalSeconds: number): Temporal.Duration {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds - minutes * 60;
		return Temporal.Duration.from({ minutes, seconds });
	}

	public getState(): State {
		const longBreakSession = this.pomodoroSettings.focusSessions * 2 - 1;
		if (this.currentStepIndex === longBreakSession) return "longBreak";
		return this.currentStepIndex % 2 ? "shortBreak" : "focus";
	}

	private getDurationByState(state: State) {
		switch (state) {
			case "focus":
				return this.pomodoroSettings.focusTime;
			case "shortBreak":
				return this.pomodoroSettings.shortBreakTime;
			case "longBreak":
				return this.pomodoroSettings.longBreakTime;
			default:
				handleAllValues(state);
				return 0;
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                                 User Actions                               */
	/* -------------------------------------------------------------------------- */

	public playButtonPress() {
		switch (this.timerState) {
			case "running":
				this.stopTimer();
				break;
			case "paused":
				this.runTimer();
				break;
			default:
				handleAllValues(this.timerState);
				break;
		}
	}
}
