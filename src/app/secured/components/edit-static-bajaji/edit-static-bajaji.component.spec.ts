import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticBajajiComponent } from "./edit-static-bajaji.component";

describe("EditStaticBajajiComponent", () => {
    let component: EditStaticBajajiComponent;
    let fixture: ComponentFixture<EditStaticBajajiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticBajajiComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticBajajiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
