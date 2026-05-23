import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditAccountPreferencesComponent } from "./edit-account-preferences.component";

describe("EditAccountPreferencesComponent", () => {
    let component: EditAccountPreferencesComponent;
    let fixture: ComponentFixture<EditAccountPreferencesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditAccountPreferencesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditAccountPreferencesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
