import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-pomodoro',
	imports: [],
	templateUrl: './pomodoro.component.html',
	styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent implements OnInit {
	public progress = 0;

	ngOnInit(): void {
		this.updateProgress(0);
		this.startTimer();
	}
	timerInterval?: number;
	startTimer() {
		this.timerInterval = window.setInterval(() => {
			this.progress += 5;
			this.updateProgress(this.progress % 100);
		}, 500);
	}

	updateProgress(percent: number): void {
		const circle = document.querySelector(
			'.timer__progress-bar'
		) as SVGCircleElement;
		const dot = document.querySelector('.timer__dot') as HTMLElement;

		const radius = 45;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (percent / 100) * circumference;

		if (circle) {
			circle.style.strokeDashoffset = `${offset}`;
		}

		if (dot) {
			const angle = (percent / 100) * 360;
			dot.style.transform = `translate(-50%, 0) rotate(${angle}deg)`;
		}
	}
}
