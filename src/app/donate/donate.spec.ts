import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Donate } from "./donate";

describe("Donate", () => {
    let component: Donate;
    let fixture: ComponentFixture<Donate>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Donate],
        }).compileComponents();

        fixture = TestBed.createComponent(Donate);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
