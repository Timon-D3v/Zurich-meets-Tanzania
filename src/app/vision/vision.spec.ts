import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Vision } from "./vision";

describe("Vision", () => {
    let component: Vision;
    let fixture: ComponentFixture<Vision>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Vision],
        }).compileComponents();

        fixture = TestBed.createComponent(Vision);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
