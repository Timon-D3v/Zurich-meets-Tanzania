import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { notAuthGuard } from "./not-auth.guard";

describe("notAuthGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => notAuthGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });
});
