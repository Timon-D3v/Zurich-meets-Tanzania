import { TestBed } from "@angular/core/testing";

import { SpreadsheetsService } from "./spreadsheets.service";

describe("SpreadsheetsService", () => {
    let service: SpreadsheetsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SpreadsheetsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
