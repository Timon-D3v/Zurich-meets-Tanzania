import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Bajaji } from "./bajaji";

describe("Bajaji", () => {
    let component: Bajaji;
    let fixture: ComponentFixture<Bajaji>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Bajaji],
        }).compileComponents();

        fixture = TestBed.createComponent(Bajaji);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
