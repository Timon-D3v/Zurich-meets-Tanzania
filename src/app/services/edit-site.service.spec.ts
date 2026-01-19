import { TestBed } from "@angular/core/testing";

import { EditSiteService } from "./edit-site.service";

describe("EditSiteService", () => {
    let service: EditSiteService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditSiteService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
