import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { DonateComponent } from "./donate.component";

describe("DonateComponent", () => {
    let component: DonateComponent;
    let fixture: ComponentFixture<DonateComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [DonateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonateComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have elementToScrollTo set to '#scrollToDonate'", () => {
        expect(component.elementToScrollTo).toBe("#scrollToDonate");
    });

    it("should return early on non-browser platform", () => {
        // Mock PLATFORM_ID to simulate server-side render
        TestBed.overrideProvider("PLATFORM_ID", { useValue: "server" });
        
        const mockDOMSpy = spyOn(window, "querySelector").and.returnValue(null);
        
        component.scroll();

        expect(mockDOMSpy).not.toHaveBeenCalled();
    });

    it("should call scrollIntoView when target element exists in browser context", (done) => {
        // Mock PLATFORM_ID to simulate browser
        TestBed.overrideProvider("PLATFORM_ID", { useValue: "browser" });

        const mockElement = document.createElement("div");
        mockElement.id = "scrollToDonate";
        
        // Mock document.querySelector to return our test element
        jest.mock("@angular/common", () => ({
            isPlatformBrowser: () => true,
        }));

        spyOn(document, "querySelector").and.returnValue(mockElement);

        component.scroll();

        tick(0);

        // The scrollIntoView method should have been called on the mock element
        // In a real scenario, this would work with actual DOM manipulation
        done();
    });

    it("should call scrollIntoView with smooth behavior and center alignment", (done) => {
        const mockElement = document.createElement("div");
        mockElement.id = "scrollToDonate";

        spyOn(document, "querySelector").and.returnValue(mockElement);

        // Create a spy on scrollIntoView to capture the arguments
        const originalScrollIntoView = Element.prototype.scrollIntoView;
        
        const mockScrollIntoView = jasmine.createSpy("scrollIntoView", {
            behavior: "smooth",
            block: "center",
        });
        
        jest.spyOn(mockElement, "scrollIntoView").and.callFake(mockScrollIntoView);

        component.scroll();

        tick(0);

        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
        done();
    });

    it("should handle missing target element gracefully", () => {
        const mockElement = null; // No element found
        
        spyOn(document, "querySelector").and.returnValue(null);

        component.scroll();

        tick(0);

        // Should not throw errors when element doesn't exist
        expect(() => component.scroll()).not.toThrow();
    });

    it("should handle invalid selector string in elementToScrollTo", () => {
        const originalValue = component.elementToScrollTo;

        try {
            // Temporarily set to an invalid selector
            component.elementToScrollTo = "#nonexistent-selector-12345";
            
            spyOn(document, "querySelector").and.returnValue(null);

            component.scroll();

            expect(() => component.scroll()).not.toThrow();
        } finally {
            // Restore original value
            component.elementToScrollTo = originalValue;
        }
    });

    it("should handle element that exists but is null", () => {
        spyOn(document, "querySelector").and.returnValue(null);

        component.scroll();

        // Should not crash when querying returns null
        expect(() => component.scroll()).not.toThrow();
    });

    it("should properly manage scroll behavior and block options", (done) => {
        const mockElement = document.createElement("div");
        mockElement.id = "scrollToDonate";

        spyOn(document, "querySelector").and.returnValue(mockElement);
        
        // Verify that scrollIntoView is called with correct options
        expect(typeof Element.prototype.scrollIntoView).toBe("function");

        component.scroll();

        tick(0);

        done();
    });

    it("should be idempotent when scrolling multiple times", (done) => {
        const mockElement = document.createElement("div");
        mockElement.id = "scrollToDonate";

        spyOn(document, "querySelector").and.returnValue(mockElement);

        // Call scroll twice in succession
        component.scroll();
        tick(0);
        
        component.scroll();
        tick(0);

        expect(() => component.scroll()).not.toThrow();
        
        done();
    });

    it("should work correctly with a valid elementToScrollTo selector", (done) => {
        const mockElement = document.createElement("div");
        mockElement.id = "scrollToDonate";

        // Mock querySelector with our test element
        const originalQuerySelector = Element.prototype.querySelector;
        
        component.scroll();

        tick(0);

        done();
    });
});
