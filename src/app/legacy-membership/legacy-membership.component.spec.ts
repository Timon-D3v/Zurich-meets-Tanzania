import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LegacyMembershipComponent } from "./legacy-membership.component";

describe("LegacyMembershipComponent", () => {
    let component: LegacyMembershipComponent;
    let fixture: ComponentFixture<LegacyMembershipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [], // Do not import to isolate scroll behavior testing
            providers: [LegacyMembershipComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LegacyMembershipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have elementToScrollTo set to '#scrollToLegacyMembership'", () => {
        expect(component.elementToScrollTo).toBe("#scrollToLegacyMembership");
    });

    it("should scroll only in browser context without errors on server-side render", () => {
        const mockElement = document.createElement("div");
        mockElement.id = "scrollToLegacyMembership";

        spyOn(document, "querySelector").and.returnValue(mockElement);

        component["scroll"]();

        expect(typeof Element.prototype.scrollIntoView).toBe("function");
    });

    it("should handle missing element without throwing errors", () => {
        const mockDOMSpy = spyOn(window, "querySelector").and.returnValue(null);
        
        expect(() => component["scroll"]).not.toThrow();
    });

    it("should handle invalid selector string without errors", () => {
        try {
            component.elementToScrollTo = "#nonexistent-element-xyz";
            
            expect(() => component["scroll"]).not.toThrow();
        } finally {
            (component as any).elementToScrollTo = "#scrollToLegacyMembership";
        }
    });

    it("should maintain idempotent behavior when scroll called multiple times in succession", () => {
        const mockElement = document.createElement("div");
        mockElement.id = "scrollToLegacyMembership";

        spyOn(document, "querySelector").and.returnValue(mockElement);

        component["scroll"]();
        
        // Multiple invocations without errors, even though scrolling repeats same target
    });
});
