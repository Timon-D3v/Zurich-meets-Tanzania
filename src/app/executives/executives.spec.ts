import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Executives } from "./executives";

describe("Executives", () => {
    let component: Executives;
    let fixture: ComponentFixture<Executives>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Executives],
        }).compileComponents();

        fixture = TestBed.createComponent(Executives);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
