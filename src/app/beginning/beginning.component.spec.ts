import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BeginningComponent } from "./beginning.component";

describe("Beginning", () => {
    let component: BeginningComponent;
    let fixture: ComponentFixture<BeginningComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BeginningComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BeginningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
