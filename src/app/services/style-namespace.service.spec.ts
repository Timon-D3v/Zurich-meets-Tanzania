import { TestBed } from "@angular/core/testing";

import { StyleNamespaceService } from "./style-namespace.service";

describe("StyleNamespaceService", () => {
    let service: StyleNamespaceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StyleNamespaceService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
