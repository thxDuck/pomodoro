import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Temporal } from "temporal-polyfill";
import { handleAllValues } from "../../utilities/utilities";

const ONE_SEC_DURATION = "PT1S";

type TimerState = "running" | "paused";
@Component({
	selector: "app-timer",
	imports: [],
	templateUrl: "./timer.component.html",
	styleUrl: "./timer.component.scss",
})
export class TimerComponent implements OnChanges {
	@Input({ required: true }) totalTime!: number;
	@Input({ required: true }) timeRemaining!: Temporal.Duration;
	@Input({ required: true }) state: TimerState = "paused";
	public timerText = "  :  ";

	ngOnInit(): void {
		this.stopTimer();
		this.updateTimer();
	}

	private updatePlayButton(type: "play" | "pause") {
		const image = document.querySelector(".action .action__button img");
		image?.setAttribute("src", `images/icons/${type}_icon.svg`);
	}
	private updateChrono(durations: { minutes: number; seconds: number }) {
		const { minutes, seconds } = durations;
		const nbSeconds = seconds < 10 ? `0${seconds}` : seconds;
		this.timerText = `${minutes}:${nbSeconds}`;
	}

	public stopTimer() {
		this.updatePlayButton("play");
	}
	public runTimer() {
		this.updatePlayButton("pause");
	}
	private handleStateChanging(state: TimerState) {
		switch (state) {
			case "paused":
				this.stopTimer();
				break;
			case "running":
				this.runTimer();
				break;
			default:
				handleAllValues(state);
				break;
		}
	}
	ngOnChanges(changes: SimpleChanges) {
		const { state: stateChange, timeRemaining: durationChange } = changes;
		if (stateChange) this.handleStateChanging(stateChange.currentValue);

		if (durationChange) this.updateTimer();
	}
	private updateTimer() {
		const secondsRemains = this.timeRemaining.total("seconds");
		const totalPercent = Math.floor((secondsRemains * 100) / this.totalTime);

		this.updateChrono(this.timeRemaining);
		this.updateProgressBar((100 - totalPercent) % 100);
	}
	/**
	 * Update timer style to match time spent
	 * @param percent Percent of time past.
	 */
	private updateProgressBar(percent: number) {
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
