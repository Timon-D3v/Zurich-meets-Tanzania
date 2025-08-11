import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Finances } from "./finances";

describe("Finances", () => {
    let component: Finances;
    let fixture: ComponentFixture<Finances>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Finances],
        }).compileComponents();

        fixture = TestBed.createComponent(Finances);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
