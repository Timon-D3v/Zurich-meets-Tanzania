import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BajajiComponent } from "./bajaji.component";

describe("Bajaji", () => {
    let component: BajajiComponent;
    let fixture: ComponentFixture<BajajiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BajajiComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BajajiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
