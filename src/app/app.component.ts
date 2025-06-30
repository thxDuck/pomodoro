import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./components/commons/footer/footer.component";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, FooterComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent {
	title = "pomodoro-app";
}
