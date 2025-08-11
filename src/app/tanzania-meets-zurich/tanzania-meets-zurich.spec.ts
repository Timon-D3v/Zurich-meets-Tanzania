import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TanzaniaMeetsZurich } from "./tanzania-meets-zurich";

describe("TanzaniaMeetsZurich", () => {
    let component: TanzaniaMeetsZurich;
    let fixture: ComponentFixture<TanzaniaMeetsZurich>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TanzaniaMeetsZurich],
        }).compileComponents();

        fixture = TestBed.createComponent(TanzaniaMeetsZurich);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
