import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Membership } from "./membership";

describe("Membership", () => {
    let component: Membership;
    let fixture: ComponentFixture<Membership>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Membership],
        }).compileComponents();

        fixture = TestBed.createComponent(Membership);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
