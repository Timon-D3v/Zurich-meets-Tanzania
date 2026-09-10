import { TestBed } from "@angular/core/testing";

import { PublicEnvService } from "./public-env.service";

describe("PublicEnvService", () => {
    let service: PublicEnvService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PublicEnvService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
