import { TestBed } from "@angular/core/testing";

import { SanitizerService } from "./sanitizer.service";

describe("SanitizerService", () => {
    let service: SanitizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SanitizerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
