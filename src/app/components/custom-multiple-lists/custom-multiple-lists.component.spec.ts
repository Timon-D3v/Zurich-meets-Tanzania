import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomMultipleListsComponent } from "./custom-multiple-lists.component";

describe("CustomMultipleListsComponent", () => {
    let component: CustomMultipleListsComponent;
    let fixture: ComponentFixture<CustomMultipleListsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomMultipleListsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomMultipleListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
