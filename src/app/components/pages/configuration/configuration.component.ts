import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DropdownSelectComponent } from "../../commons/utils/form/dropdown-select/dropdown-select.component";

@Component({
	selector: "app-configuration",
	imports: [ReactiveFormsModule, DropdownSelectComponent],
	templateUrl: "./configuration.component.html",
	styleUrl: "./configuration.component.scss",
})
export class ConfigurationComponent {

}
