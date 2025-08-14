import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationsWrapperComponent } from "./notifications-wrapper.component";

describe("NotificationsWrapperComponent", () => {
    let component: NotificationsWrapperComponent;
    let fixture: ComponentFixture<NotificationsWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificationsWrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationsWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
