import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticZurichMeetsTanzaniaComponent } from "./edit-static-zurich-meets-tanzania.component";

describe("EditStaticZurichMeetsTanzaniaComponent", () => {
    let component: EditStaticZurichMeetsTanzaniaComponent;
    let fixture: ComponentFixture<EditStaticZurichMeetsTanzaniaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticZurichMeetsTanzaniaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticZurichMeetsTanzaniaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
