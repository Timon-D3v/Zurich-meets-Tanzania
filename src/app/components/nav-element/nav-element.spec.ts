import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavElements } from "./nav-element";

describe("NavElements", () => {
    let component: NavElements;
    let fixture: ComponentFixture<NavElements>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavElements],
        }).compileComponents();

        fixture = TestBed.createComponent(NavElements);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
