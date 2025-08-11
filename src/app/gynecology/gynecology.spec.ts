import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Gynecology } from "./gynecology";

describe("Gynecology", () => {
    let component: Gynecology;
    let fixture: ComponentFixture<Gynecology>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Gynecology],
        }).compileComponents();

        fixture = TestBed.createComponent(Gynecology);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
