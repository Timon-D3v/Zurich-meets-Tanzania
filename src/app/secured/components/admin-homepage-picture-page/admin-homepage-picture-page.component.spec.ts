import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminHomepagePicturePageComponent } from "./admin-homepage-picture-page.component";

describe("AdminHomepagePicturePageComponent", () => {
    let component: AdminHomepagePicturePageComponent;
    let fixture: ComponentFixture<AdminHomepagePicturePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminHomepagePicturePageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminHomepagePicturePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
