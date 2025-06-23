import { Component, OnInit } from "@angular/core";
import { Temporal } from "temporal-polyfill";
import { Pomodoro } from "../../models/pomodoro-model";
import { SecondDurations } from "../../models/pomodoro-types";
import { handleAllValues } from "../../utilities/utilities";

const ONE_SEC_DURATION = "PT1S";
type PomodoroState = {
	type: "focus" | "short_break" | "long_break";
	duration: number;
};

@Component({
	selector: "app-pomodoro",
	imports: [],
	templateUrl: "./pomodoro.component.html",
	styleUrl: "./pomodoro.component.scss",
})
export class PomodoroComponent implements OnInit {
	public pomodoroSettings = new Pomodoro({
		focusTime: SecondDurations.Second * 10,
		shortBreakTime: SecondDurations.Second * 5,
		longBreakTime: SecondDurations.Second * 30,
		autoStartBreak: true,
		autoStartFocus: true,
	});
	public stepsContext: PomodoroState[] = [];
	public currentStepIndex = -1;
	public currentStep!: PomodoroState;
	public timerState: "running" | "paused" = "paused";
	public timer?: number;
	public timeRemaining!: Temporal.Duration;
	public timerText = "--:--";

	constructor() {
		this.stepsContext = [
			{
				type: "focus",
				duration: this.pomodoroSettings.focusTime,
			},
			{
				type: "short_break",
				duration: this.pomodoroSettings.shortBreakTime,
			},
			{ type: "focus", duration: this.pomodoroSettings.focusTime },
			{
				type: "short_break",
				duration: this.pomodoroSettings.shortBreakTime,
			},
			{ type: "focus", duration: this.pomodoroSettings.focusTime },
			{
				type: "long_break",
				duration: this.pomodoroSettings.longBreakTime,
			},
		];
		this.currentStepIndex = -1;
		this.loadNextContext(true);
	}

	ngOnInit(): void {}
	private getDurationFromSeconds(totalSeconds: number): Temporal.Duration {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds - minutes * 60;
		return Temporal.Duration.from({ minutes, seconds });
	}
	private loadNextContext(isFirstInit = false) {
		this.stopTimer();
		this.currentStepIndex =
			(this.currentStepIndex + 1) % this.stepsContext.length;
		console.log("Load step number ", this.currentStepIndex);

		const nextStep = this.stepsContext.at(this.currentStepIndex);
		if (!nextStep) throw new Error("Invalid step !");
		console.log(nextStep);
		const duration = this.getDurationFromSeconds(nextStep?.duration);
		this.timeRemaining = duration;
		const { minutes, seconds } = duration;

		this.updateChrono({ minutes, seconds });
		this.updateProgressBar(0);

		this.currentStep = nextStep;

		if (isFirstInit) return;

		if (this.currentStepIndex === 0) {
			console.log("End of steps !");
			return
		}

		switch (this.currentStep.type) {
			case "focus":
				if (this.pomodoroSettings.autoStartFocus) this.runTimer();
				break;
			case "short_break":
				if (this.pomodoroSettings.autoStartBreak) this.runTimer();
				break;
			case "long_break":
				if (this.pomodoroSettings.autoStartBreak) this.runTimer();
				break;

			default:
				break;
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                                    Logic                                   */
	/* -------------------------------------------------------------------------- */

	public stopTimer() {
		this.timerState = "paused";
		this.updateplayButton("play");
		clearInterval(this.timer);
	}

	public runTimer() {
		this.timerState = "running";
		this.updateplayButton("pause");
		// Binding of this beacause of the function calling system
		this.timer = window.setInterval(this.countDouwn.bind(this), 1000 / 4);
	}

	public countDouwn() {
		this.timeRemaining = this.timeRemaining.subtract(ONE_SEC_DURATION);
		const secondsRemains = this.timeRemaining.total("seconds");
		const totalPercent = Math.floor(
			(secondsRemains * 100) / this.currentStep.duration,
		);

		this.updateChrono({
			minutes: this.timeRemaining.minutes,
			seconds: this.timeRemaining.seconds,
		});
		this.updateProgressBar((100 - totalPercent) % 100);

		if (this.timeRemaining.total("seconds") <= 0) {
			this.loadNextContext();
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                                 User Actions                               */
	/* -------------------------------------------------------------------------- */

	playButtonPress() {
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

	/* -------------------------------------------------------------------------- */
	/*                                    Html                                    */
	/* -------------------------------------------------------------------------- */

	public updateplayButton(type: "play" | "pause") {
		const image = document.querySelector(".action .action__button img");
		image?.setAttribute("src", `images/icons/${type}_icon.svg`);
	}
	public updateChrono(durations: { minutes: number; seconds: number }) {
		const { minutes, seconds } = durations;
		const nbSeconds = seconds < 10 ? `0${seconds}` : seconds;
		this.timerText = `${minutes}:${nbSeconds}`;
	}

	/**
	 * Update timer style to match time spent
	 * @param percent Percent of time past.
	 */
	updateProgressBar(percent: number): void {
		const circle = document.querySelector(
			".timer__progress-bar",
		) as SVGCircleElement;
		const dot = document.querySelector(".timer__dot") as HTMLElement;

		const radius = 45;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (percent / 100) * circumference;

		if (circle) circle.style.strokeDashoffset = `${offset}`;
		if (dot) {
			const angle = (percent / 100) * 360;
			dot.style.transform = `translate(-50%, 0) rotate(${angle}deg)`;
		}
	}
}
