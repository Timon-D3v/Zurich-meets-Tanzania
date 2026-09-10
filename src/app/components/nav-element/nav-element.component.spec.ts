import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavElementComponent } from "./nav-element.component";

describe("NavElements", () => {
    let component: NavElementComponent;
    let fixture: ComponentFixture<NavElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavElementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NavElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
