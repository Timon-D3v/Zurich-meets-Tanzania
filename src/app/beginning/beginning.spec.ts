import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Beginning } from "./beginning";

describe("Beginning", () => {
    let component: Beginning;
    let fixture: ComponentFixture<Beginning>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Beginning],
        }).compileComponents();

        fixture = TestBed.createComponent(Beginning);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
