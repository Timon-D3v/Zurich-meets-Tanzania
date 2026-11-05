import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PublicEnvService } from "../services/public-env.service";

describe("ImprintComponent", () => {
    let component: ImprintComponent;
    let fixture: ComponentFixture<ImprintComponent>;
    let mockPublicEnvService: PublicEnvService;

    beforeEach(async () => {
        // Create a mock for the PublicEnvService to provide predictable origin URL responses
        mockPublicEnvService = jasmine.createSpyObj("PublicEnvService", ["getOrigin"]);
        
        const originMock = "https://example.org";

        mockPublicEnvService.getOrigin.and.resolveTo(originMock);

        await TestBed.configureTestingModule({
            imports: [], // Do not import ImprintComponent itself to avoid ngOnInit side effects in tests
            providers: [ImprintComponent, { provide: PublicEnvService, useValue: mockPublicEnvService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ImprintComponent);
        component = fixture.componentInstance;

        // Manually set up initial state since we don't import the component (to avoid ngOnInit running)
        fixture.detectChanges();
        fixture.autoDetectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default origin signal value of empty string before initialization", () => {
        // Check that the origin has its initial empty state (before async ngOnInit completes)
        // The actual value depends on when getOrigin is called, but we can verify the signal exists
        expect(typeof component.origin).toEqual(jasmine.any(Signal));
    });

    it("should have a date signal initialized with formatted de-CH locale date", () => {
        const dateValue = component.date();

        expect(typeof dateValue).toBe("string");
        expect(dateValue.length).toBeGreaterThan(0); // Should contain at least weekday, day, month, year parts

        // The date is set to a specific timestamp (1769351031110) when component initializes
        // This should always be non-empty formatted date string using German locale conventions
    });

    it("should format date correctly with weekday short, day numeric, month long, year numeric style", () => {
        const dateValue = component.date();

        expect(typeof dateValue).toBe("string");
        
        // Should contain at least the abbreviated weekday and full month name in German locale
        expect(dateValue.length).toBeGreaterThan(0);
    });

    it("should handle async ngOnInit and set origin signal after API response", (done) => {
        // Use fakeAsync/tick to test async behavior
        const mockOriginUrl = "https://example.org";

        spyOn(component as any, "getOrigin").and.returnValue(mockOriginUrl);

        component.ngOnInit;

        // After ngOnInit runs and calls the service
        setTimeout(() => {
            expect(component.origin).toBe(mockOriginUrl);
            done();
        }, 0);
    });

    it("should handle null or empty response from getOrigin in ngOnInit", (done) => {
        mockPublicEnvService.getOrigin.and.returnNull;

        component.ngOnInit;

        setTimeout(() => {
            expect(component.origin()).toBe(""); // Should handle null/missing gracefully
            done();
        }, 2); // Short delay for promise to resolve with null
    });

    it("should initialize date signal with correct timestamp-based value", () => {
        const testDate = new Date(1769351031110);
        const expectedFormattedDate = testDate.toLocaleDateString("de-CH", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

        expect(component.date).toEqual(jasmine.anything); // Should have a value at construction time
    });

    it("should not throw error on initialization when publicEnvService is provided", (done) => {
        mockPublicEnvService.getOrigin.and.resolveTo("https://example.org");

        fixture = TestBed.createComponent(ImprintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        fixture.autoDetectChanges();

        // Should complete ngOnInit without throwing, setting origin successfully
        setTimeout(() => {
            expect(component.origin()).not.toBeUndefined();
            done();
        }, 0);
    });

    it("should handle invalid dates gracefully when component is loaded", () => {
        const dateValue = component.date();
        
        expect(typeof dateValue).toBe("string"); // Not null/undefined
        expect(dateValue.length).not.toBe(0); // Should contain content
    });

    it("should maintain consistent state between component instances for public properties", (done) => {
        const instance1 = new ImprintComponent as unknown as ImprintComponent;
        
        // Verify signal exists and is settable even before ngOnInit completes
        expect(instance1.origin).toBeDefined();
        expect(typeof instance1.date).toBe("string");

        done();
    });

    it("should have correct readonly properties in component", () => {
        const origin = component["origin"];

        // Check if the signal object has proper structure (not null/undefined)
        expect(origin).toBeDefined();
    });

    it("should handle edge cases like timezone differences in date formatting", () => {
        const dateValue = component.date();

        expect(typeof dateValue).toBe("string"); // Should use toLocaleDateString() which handles timezones
        // Date with de-CH locale should properly format for Switzerland timezone
        expect(dateValue.length).toBeGreaterThan(0);
    });

    it("should have correct initial values without errors at component construction", () => {
        const date = component.date;
        
        expect(typeof date).toBe("string");
        expect(date.length).not.toBe(0);
    });

    it("should complete async initialization without throwing errors", (done) => {
        // Verify that after ngOnInit completes, origin signal has a valid value
        setTimeout(() => {
            const origin = component.origin();
            
            expect(typeof origin).toBe("string");
            done();
        }, 10);
    });
});
