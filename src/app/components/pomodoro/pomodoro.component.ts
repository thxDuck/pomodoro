import { Component, OnInit } from '@angular/core';
import { PomodoroSettings } from '../../models/pomodoro-types';
import { Pomodoro } from '../../models/pomodoro-model';
import { handleAllValues } from '../../utilities/utilities';
import { Temporal } from 'temporal-polyfill';

const ONE_SEC_DURATION = 'PT1S';

@Component({
	selector: 'app-pomodoro',
	imports: [],
	templateUrl: './pomodoro.component.html',
	styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent implements OnInit {
	public progress = 0;
	public pomodoro = new Pomodoro();

	public playIconPath = 'images/icons/play_icon.svg';
	public pauseIconPath = 'images/icons/pause_icon.svg';

	public timeRemaining!: Temporal.Duration;
	public timer?: number;

	ngOnInit(): void {
		this.timeRemaining = this.getDurationFromSeconds(
			this.pomodoro.focusTime
		);
		this.updateTimerProgressBar(0);
	}
	private getDurationFromSeconds(totalSeconds: number): Temporal.Duration {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds - minutes * 60;
		return Temporal.Duration.from({ minutes, seconds });
	}
	play() {
		const image = document.querySelector('.action .action__button img');
		image?.setAttribute('src', this.pauseIconPath);
		this.startTimer();
	}

	pause() {
		const image = document.querySelector('.action .action__button img');
		image?.setAttribute('src', this.playIconPath);
		this.stopTimer();
	}

	playButtonPress() {
		switch (this.pomodoro.state) {
			case 'focus':
				this.pause();
				break;
			case 'break':
			case 'paused':
				this.play();
				break;

			default:
				handleAllValues(this.pomodoro.state);
				break;
		}
	}
	public remainingTime = Temporal.Duration.from({
		minutes: 15,
		seconds: 36,
	});
	updateTimerChrono() {
		const counter = document.querySelector('.timer__watch__counter');
		if (counter)
			counter.textContent = `${this.timeRemaining.minutes}:${this.timeRemaining.seconds}`;
	}
	incrementDuration() {
		this.timeRemaining = this.timeRemaining.subtract(ONE_SEC_DURATION);
		const secondsRemains = this.timeRemaining.total('seconds');
		const totalPercent = Math.floor(
			(secondsRemains * 100) / this.pomodoro.focusTime
		);
		this.progress = 100 - totalPercent;
		this.updateTimerChrono();
		this.updateTimerProgressBar(this.progress % 100);
	}
	startTimer() {
		this.pomodoro.state = 'focus';
		this.timer = window.setInterval(this.incrementDuration.bind(this), 1000);
	}
	stopTimer() {
		this.pomodoro.state = 'paused';

		clearInterval(this.timer);
	}

	/**
	 * Update timer style to match time spent
	 * @param percent Percent of time past.
	 */
	updateTimerProgressBar(percent: number): void {
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
