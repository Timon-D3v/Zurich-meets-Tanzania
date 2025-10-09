import { TestBed } from "@angular/core/testing";

import { SiteMetadataService } from "./site-metadata.service";

describe("SiteTitleService", () => {
    let service: SiteMetadataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SiteMetadataService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
