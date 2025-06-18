import { Component, OnInit } from '@angular/core';
import { PomodoroSettings, SecondDurations } from '../../models/pomodoro-types';
import { Pomodoro } from '../../models/pomodoro-model';
import { handleAllValues } from '../../utilities/utilities';
import { Temporal } from 'temporal-polyfill';

const ONE_SEC_DURATION = 'PT1S';
type PomodoroState = {
	type: 'focus' | 'short_break' | 'long_break';
	duration: number;
};

@Component({
	selector: 'app-pomodoro',
	imports: [],
	templateUrl: './pomodoro.component.html',
	styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent implements OnInit {
	public pomodoroSettings = new Pomodoro();
	public stepsContext: PomodoroState[] = [];
	public currentStepIndex = -1;
	public currentStep!: PomodoroState;
	public timerState: 'running' | 'paused' = 'paused';
	public timer?: number;
	public timeRemaining!: Temporal.Duration;

	constructor() {
		this.stepsContext = [
			{
				type: 'focus',
				duration:
					this.pomodoroSettings.focusTime +
					SecondDurations.Second * 20,
			},
			{
				type: 'short_break',
				duration: this.pomodoroSettings.shortBreakTime,
			},
			{ type: 'focus', duration: this.pomodoroSettings.focusTime },
			{
				type: 'short_break',
				duration: this.pomodoroSettings.shortBreakTime,
			},
			{ type: 'focus', duration: this.pomodoroSettings.focusTime },
			{
				type: 'long_break',
				duration: this.pomodoroSettings.longBreakTime,
			},
		];
		this.currentStepIndex = -1;
		this.loadNextContext();
	}

	ngOnInit(): void {}
	private getDurationFromSeconds(totalSeconds: number): Temporal.Duration {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds - minutes * 60;
		return Temporal.Duration.from({ minutes, seconds });
	}
	private loadNextContext() {
		this.currentStepIndex++;
		console.log(this.currentStepIndex);

		const nextStep = this.stepsContext.at(
			this.currentStepIndex % this.stepsContext.length
		);
		if (!nextStep) throw new Error('Invalid step !');
		console.log(nextStep);
		const duration = this.getDurationFromSeconds(nextStep?.duration);
		this.timeRemaining = duration;
		const { minutes, seconds } = duration;

		this.updateChrono({ minutes, seconds });
		this.updateProgressBar(0);

		this.currentStep = nextStep;
	}

	/* -------------------------------------------------------------------------- */
	/*                                    Logic                                   */
	/* -------------------------------------------------------------------------- */

	public stopTimer() {
		this.timerState = 'paused';
		this.updateplayButton('play');
		clearInterval(this.timer);
	}

	public runTimer() {
		this.timerState = 'running';
		this.updateplayButton('pause');
		// Binding of this beacause of the function calling system
		this.timer = window.setInterval(this.countDouwn.bind(this), 1000);
	}

	public countDouwn() {
		this.timeRemaining = this.timeRemaining.subtract(ONE_SEC_DURATION);
		const secondsRemains = this.timeRemaining.total('seconds');
		const totalPercent = Math.floor(
			(secondsRemains * 100) / this.currentStep.duration
		);

		this.updateChrono({
			minutes: this.timeRemaining.minutes,
			seconds: this.timeRemaining.seconds,
		});
		this.updateProgressBar((100 - totalPercent) % 100);
	}

	/* -------------------------------------------------------------------------- */
	/*                                 User Actions                               */
	/* -------------------------------------------------------------------------- */

	playButtonPress() {
		switch (this.timerState) {
			case 'running':
				this.stopTimer();
				break;
			case 'paused':
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

	public updateplayButton(type: 'play' | 'pause') {
		const image = document.querySelector('.action .action__button img');
		image?.setAttribute('src', `images/icons/${type}_icon.svg`);
	}

	public updateChrono(durations: { minutes: number; seconds: number }) {
		const { minutes, seconds } = durations;
		const nbSeconds = seconds < 10 ? `0${seconds}` : seconds;
		const htmlCounter = document.querySelector('.timer__watch__counter');
		if (htmlCounter) htmlCounter.textContent = `${minutes}:${nbSeconds}`;
	}

	/**
	 * Update timer style to match time spent
	 * @param percent Percent of time past.
	 */
	updateProgressBar(percent: number): void {
		const circle = document.querySelector(
			'.timer__progress-bar'
		) as SVGCircleElement;
		const dot = document.querySelector('.timer__dot') as HTMLElement;

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
