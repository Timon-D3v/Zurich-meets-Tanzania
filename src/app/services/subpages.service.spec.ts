import { TestBed } from "@angular/core/testing";

import { SubpagesService } from "./subpages.service";

describe("SubpagesService", () => {
    let service: SubpagesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubpagesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
