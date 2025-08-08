import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "app-dropdown-select",
	imports: [],
	templateUrl: "./dropdown-select.component.html",
	styleUrl: "./dropdown-select.component.scss",
})
export class DropdownSelectComponent implements OnInit {
	ngOnInit(): void {
		for (let index = this.min; index <= this.max; index += this.step) {
			this.values.push(index);
		}
	}

	isOpen = true;
	@Input({ required: true }) min!: number;
	@Input({ required: true }) max!: number;
	@Input({ required: true }) step!: number;
	@Input({ required: true }) label!: string;
	@Input({ required: true }) unit!: string;
	@Input({ required: true }) value!: number;
	values: number[] = [];
}
