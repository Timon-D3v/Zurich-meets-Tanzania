import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-gallery",
    imports: [],
    templateUrl: "./gallery.component.html",
    styleUrl: "./gallery.component.scss",
})
export class GalleryComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    name = signal("");

    ngOnInit(): void {
        if (typeof this.route.snapshot.params["name"] !== "string") {
            this.router.navigate(["/"]);

            return;
        }

        this.name.set(this.route.snapshot.params["name"]);
    }
}
