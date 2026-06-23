import { Component, effect, inject, OnChanges, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GalleryService } from "../services/gallery.service";
import { DelivApiFile, GetGalleryImagesApiEndpointResponse } from "../..";
import { HeroComponent } from "../components/hero/hero.component";
import { FilePreviewComponent } from "../components/file-preview/file-preview.component";
import { LoadingComponent } from "../components/loading/loading.component";
import { PUBLIC_CONFIG } from "../../publicConfig";

@Component({
    selector: "app-gallery",
    imports: [HeroComponent, FilePreviewComponent, LoadingComponent],
    templateUrl: "./gallery.component.html",
    styleUrl: "./gallery.component.scss",
})
export class GalleryComponent implements OnInit, OnChanges {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    FALLBACK_IMAGE_URL = PUBLIC_CONFIG.FALLBACK_IMAGE_URL

    name = signal<string>("");
    galleryFiles = signal<DelivApiFile[]>([]);

    private galleryService = inject(GalleryService);

    private _updateGalleryEffect = effect((): void => {
        this.getGallery();
    })

    ngOnInit(): void {
        if (typeof this.route.snapshot.params["name"] !== "string") {
            this.router.navigate(["/"]);

            return;
        }

        this.name.set(this.route.snapshot.params["name"]);

        this.getGallery();


    }

    ngOnChanges(): void {
        
        this.name.set(this.route.snapshot.params["name"]);
        this.getGallery();

    }

    async getGallery(): Promise<DelivApiFile[]> {
        const request = this.galleryService.getGalleryWithName(this.name());

        request.subscribe((response: GetGalleryImagesApiEndpointResponse) => {
            console.log(response)
        })

        return [
        {
            "uuid": "7a121",
            "url": "http://localhost:8082/cdn/dev/7a121",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a122",
            "url": "http://localhost:8082/cdn/dev/7a122",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a123",
            "url": "http://localhost:8082/cdn/dev/7a123",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a124",
            "url": "http://localhost:8082/cdn/dev/7a124",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a125",
            "url": "http://localhost:8082/cdn/dev/7a125",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a126",
            "url": "http://localhost:8082/cdn/dev/7a126",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a127",
            "url": "http://localhost:8082/cdn/dev/7a127",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a128",
            "url": "http://localhost:8082/cdn/dev/7a128",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a129",
            "url": "http://localhost:8082/cdn/dev/7a129",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a12a",
            "url": "http://localhost:8082/cdn/dev/7a12a",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a12b",
            "url": "http://localhost:8082/cdn/dev/7a12b",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a12c",
            "url": "http://localhost:8082/cdn/dev/7a12c",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a12d",
            "url": "http://localhost:8082/cdn/dev/7a12d",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a12e",
            "url": "http://localhost:8082/cdn/dev/7a12e",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a12f",
            "url": "http://localhost:8082/cdn/dev/7a12f",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a130",
            "url": "http://localhost:8082/cdn/dev/7a130",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a131",
            "url": "http://localhost:8082/cdn/dev/7a131",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a132",
            "url": "http://localhost:8082/cdn/dev/7a132",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a133",
            "url": "http://localhost:8082/cdn/dev/7a133",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a134",
            "url": "http://localhost:8082/cdn/dev/7a134",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a135",
            "url": "http://localhost:8082/cdn/dev/7a135",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a136",
            "url": "http://localhost:8082/cdn/dev/7a136",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a137",
            "url": "http://localhost:8082/cdn/dev/7a137",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a138",
            "url": "http://localhost:8082/cdn/dev/7a138",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a139",
            "url": "http://localhost:8082/cdn/dev/7a139",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a13a",
            "url": "http://localhost:8082/cdn/dev/7a13a",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a13b",
            "url": "http://localhost:8082/cdn/dev/7a13b",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a13c",
            "url": "http://localhost:8082/cdn/dev/7a13c",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a13d",
            "url": "http://localhost:8082/cdn/dev/7a13d",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a13e",
            "url": "http://localhost:8082/cdn/dev/7a13e",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a13f",
            "url": "http://localhost:8082/cdn/dev/7a13f",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a140",
            "url": "http://localhost:8082/cdn/dev/7a140",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a141",
            "url": "http://localhost:8082/cdn/dev/7a141",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a142",
            "url": "http://localhost:8082/cdn/dev/7a142",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a143",
            "url": "http://localhost:8082/cdn/dev/7a143",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a144",
            "url": "http://localhost:8082/cdn/dev/7a144",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a145",
            "url": "http://localhost:8082/cdn/dev/7a145",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a146",
            "url": "http://localhost:8082/cdn/dev/7a146",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a147",
            "url": "http://localhost:8082/cdn/dev/7a147",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a148",
            "url": "http://localhost:8082/cdn/dev/7a148",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a149",
            "url": "http://localhost:8082/cdn/dev/7a149",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a14a",
            "url": "http://localhost:8082/cdn/dev/7a14a",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a14b",
            "url": "http://localhost:8082/cdn/dev/7a14b",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a14c",
            "url": "http://localhost:8082/cdn/dev/7a14c",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a14d",
            "url": "http://localhost:8082/cdn/dev/7a14d",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a14e",
            "url": "http://localhost:8082/cdn/dev/7a14e",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a14f",
            "url": "http://localhost:8082/cdn/dev/7a14f",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a150",
            "url": "http://localhost:8082/cdn/dev/7a150",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a151",
            "url": "http://localhost:8082/cdn/dev/7a151",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a152",
            "url": "http://localhost:8082/cdn/dev/7a152",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a153",
            "url": "http://localhost:8082/cdn/dev/7a153",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a154",
            "url": "http://localhost:8082/cdn/dev/7a154",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a155",
            "url": "http://localhost:8082/cdn/dev/7a155",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a156",
            "url": "http://localhost:8082/cdn/dev/7a156",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a157",
            "url": "http://localhost:8082/cdn/dev/7a157",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "7a158",
            "url": "http://localhost:8082/cdn/dev/7a158",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a159",
            "url": "http://localhost:8082/cdn/dev/7a159",
            "mimetype": "application/pdf"
        },
        {
            "uuid": "7a15a",
            "url": "http://localhost:8082/cdn/dev/7a15a",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a15b",
            "url": "http://localhost:8082/cdn/dev/7a15b",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a15c",
            "url": "http://localhost:8082/cdn/dev/7a15c",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a15d",
            "url": "http://localhost:8082/cdn/dev/7a15d",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a15e",
            "url": "http://localhost:8082/cdn/dev/7a15e",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a15f",
            "url": "http://localhost:8082/cdn/dev/7a15f",
            "mimetype": "application/pdf"
        },
        {
            "uuid": "7a160",
            "url": "http://localhost:8082/cdn/dev/7a160",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a161",
            "url": "http://localhost:8082/cdn/dev/7a161",
            "mimetype": "image/png"
        },
        {
            "uuid": "7a162",
            "url": "http://localhost:8082/cdn/dev/7a162",
            "mimetype": "image/png"
        },
        {
            "uuid": "defb5924-de7c-4b62-98af-e056ec5ead48",
            "url": "http://localhost:8082/cdn/dev/defb5924-de7c-4b62-98af-e056ec5ead48",
            "mimetype": "image/jpeg"
        },
        {
            "uuid": "heroImage",
            "url": "http://localhost:8082/cdn/dev/heroImage",
            "mimetype": "image/jpeg"
        }
    ]
}
}
