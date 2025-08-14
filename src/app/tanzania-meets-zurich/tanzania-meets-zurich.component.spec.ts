import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TanzaniaMeetsZurichComponent } from "./tanzania-meets-zurich.component";

describe("TanzaniaMeetsZurichComponent", () => {
    let component: TanzaniaMeetsZurichComponent;
    let fixture: ComponentFixture<TanzaniaMeetsZurichComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TanzaniaMeetsZurichComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TanzaniaMeetsZurichComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
