import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MembersStripeMembersListComponent } from "./members-stripe-members-list.component";

describe("MembersStripeMembersListComponent", () => {
    let component: MembersStripeMembersListComponent;
    let fixture: ComponentFixture<MembersStripeMembersListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembersStripeMembersListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MembersStripeMembersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
