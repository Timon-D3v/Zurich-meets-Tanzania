import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Surgery } from "./surgery";

describe("Surgery", () => {
    let component: Surgery;
    let fixture: ComponentFixture<Surgery>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Surgery],
        }).compileComponents();

        fixture = TestBed.createComponent(Surgery);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
