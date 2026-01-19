import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticSiteComponent } from "./edit-static-site.component";

describe("EditStaticSiteComponent", () => {
    let component: EditStaticSiteComponent;
    let fixture: ComponentFixture<EditStaticSiteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticSiteComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticSiteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
