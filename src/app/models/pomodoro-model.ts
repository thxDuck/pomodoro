import {
	type PomodoroSettings,
	SecondDurations,
	type State,
} from "./pomodoro-types";

export class Pomodoro {
	public focusTime: number;
	public shortBreakTime: number;
	public longBreakTime: number;
	public focusSessions: number;
	public autoStartBreak: boolean;
	public autoStartFocus: boolean;

	public state: State = "paused";
	constructor({
		focusTime = SecondDurations.Minute * 25,
		shortBreakTime = SecondDurations.Minute * 5,
		longBreakTime = SecondDurations.Minute * 15,
		focusSessions = 4,
		autoStartBreak = false,
		autoStartFocus = false,
	}: Partial<PomodoroSettings> = {}) {
		this.focusTime = focusTime;
		this.shortBreakTime = shortBreakTime;
		this.longBreakTime = longBreakTime;
		this.focusSessions = focusSessions;
		this.autoStartBreak = autoStartBreak;
		this.autoStartFocus = autoStartFocus;
	}
}
