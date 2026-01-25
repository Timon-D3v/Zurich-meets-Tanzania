import { Component, inject, OnInit, signal } from "@angular/core";
import { PublicEnvService } from "../services/public-env.service";

@Component({
    selector: "app-imprint",
    imports: [],
    templateUrl: "./imprint.component.html",
    styleUrl: "./imprint.component.scss",
})
export class ImprintComponent implements OnInit {
    origin = signal<string>("");
    date = signal<string>(new Date(1769351031110).toLocaleString());

    private publicEnvService = inject(PublicEnvService);

    async ngOnInit(): Promise<void> {
        const originPromise = await this.publicEnvService.getOrigin();

        this.origin.set(originPromise);
    }
}
