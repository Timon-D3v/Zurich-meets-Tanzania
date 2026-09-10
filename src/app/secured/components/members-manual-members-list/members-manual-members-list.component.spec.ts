import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MembersManualMembersListComponent } from "./members-manual-members-list.component";

describe("MembersManualMembersListComponent", () => {
    let component: MembersManualMembersListComponent;
    let fixture: ComponentFixture<MembersManualMembersListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembersManualMembersListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MembersManualMembersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
