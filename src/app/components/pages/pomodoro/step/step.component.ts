import { Component, Input } from "@angular/core";

@Component({
	selector: "app-step",
	imports: [],
	templateUrl: "./step.component.html",
	styleUrl: "./step.component.scss",
})
export class StepComponent {
	@Input() totalSteps = 4;
	@Input() currentStep = 0;

	get steps(): number[] {
		return Array.from({ length: this.totalSteps }, (_, i) => i);
	}
}
