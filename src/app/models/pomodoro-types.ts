export enum SecondDurations {
	Second = 1000 * 1,
	Minute = Second * 60,
	Hour = Minute * 60,
}

export interface PomodoroSettings {
	focusTime: number;
	shortBreakTime: number;
	longBreakTime: number;
	focusSessions: number;
	autoStartBreak: boolean;
	autoStartFocus: boolean;
}
export type State = 'focus' | 'break' | 'paused';
