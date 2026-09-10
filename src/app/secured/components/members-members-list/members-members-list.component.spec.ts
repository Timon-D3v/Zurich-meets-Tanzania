import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MembersMembersListComponent } from "./members-members-list.component";

describe("MembersMembersListComponent", () => {
    let component: MembersMembersListComponent;
    let fixture: ComponentFixture<MembersMembersListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembersMembersListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MembersMembersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
