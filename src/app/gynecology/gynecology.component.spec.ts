import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GynecologyComponent } from "./gynecology.component";

describe("GynecologyComponent", () => {
    let component: GynecologyComponent;
    let fixture: ComponentFixture<GynecologyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GynecologyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GynecologyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
