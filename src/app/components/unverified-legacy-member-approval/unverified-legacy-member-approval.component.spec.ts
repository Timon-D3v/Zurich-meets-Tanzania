import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UnverifiedLegacyMemberApprovalComponent } from "./unverified-legacy-member-approval.component";

describe("UnverifiedLegacyMemberApprovalComponent", () => {
    let component: UnverifiedLegacyMemberApprovalComponent;
    let fixture: ComponentFixture<UnverifiedLegacyMemberApprovalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UnverifiedLegacyMemberApprovalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UnverifiedLegacyMemberApprovalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
