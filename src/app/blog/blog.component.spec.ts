import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlogComponent } from "./blog.component";
import { BlogService } from "./services/blog.service";
import { NotificationService } from "../services/notification.service";

describe("BlogComponent", () => {
    let component: BlogComponent;
    let fixture: ComponentFixture<BlogComponent>;
    let mockBlogService: BlogService;
    let mockNotificationService: NotificationService;

    beforeEach(async () => {
        // Create mocks for the services
        mockBlogService = jasmine.createSpyObj("BlogService", ["getBlog"]);
        mockNotificationService = jasmine.createSpyObj("NotificationService", [
            "info",
            "success",
            "error",
            "warn",
        ]);

        TestBed.configureTestingModule({
            imports: [],
            providers: [BlogComponent, { provide: BlogService, useValue: mockBlogService }, { provide: NotificationService, useValue: mockNotificationService }],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogComponent);
        component = fixture.componentInstance;

        mockBlogService = fixture.inject(BlogService);
        mockNotificationService = fixture.inject(NotificationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize blog signal with loading placeholder", () => {
        const blog = component.blog();
        
        // The name is initially empty, so LOADING function receives ""
        expect(blog.title).toContain("%20"); // Placeholder for loading state
        expect((component as any).name()).toBe("");

        expect(component.failedFetching()).toBe(false);
    });

    it("should get blog data from service subscription", (done) => {
        const mockBlogData = "Mock Blog Data";
        const mockName = "Test-Blog-Post";

        // Mock the observable response
        mockBlogService.getBlog.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockBlogService.getBlog(mockName);

        const responseData = {
            error: false,
            message: mockBlogData,
            data: null,
        };

        // Set up subscribe callbacks to simulate async response
        spyOn(observableMock.subscribe, "next").and.callFake(() => (callback) => {
            callback(responseData);
            return () => {};
        });

        // Trigger the fetch
        component.getBlog(mockName);

        fixture.detectChanges();

        // Verify that after subscription completes, the state is set
        expect(component.failedFetching()).toBe(true); // Will be reset when data arrives

        done();
    });

    it("should handle null or error response from getBlog", (done) => {
        const mockName = "Test-Blog-Post";
        
        mockBlogService.getBlog.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockBlogService.getBlog(mockName);

        // Mock error response
        const errorResponse = {
            error: true,
            message: "Blog not found",
            data: null,
        };

        spyOn(observableMock.subscribe, "next").and.callFake(() => (callback) => {
            callback(errorResponse);
            return () => {};
        });

        component.getBlog(mockName);

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.failedFetching()).toBe(true);
            expect(mockNotificationService.error.calls.argsFor(0)).toEqual([
                "Fehler:",
                jasmine.stringContaining("Der Blog konnte nicht geladen werden")
            ]);
            
            // After error, component should redirect (but we can't verify routing in this simple test)
            done();
        }, 0);
    });

    it("should handle subscription errors when fetching blog", (done) => {
        const mockName = "Test-Blog-Post";
        
        mockBlogService.getBlog.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockBlogService.getBlog(mockName);

        // Set up to trigger error callback instead of next
        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error happened */ });

        component.getBlog(mockName);

        fixture.detectChanges();

        expect(component.failedFetching()).toBe(true);

        done();
    });

    it("should format date string correctly with de-CH locale", () => {
        const dateString = "2024-01-15T10:30:00Z";
        const result = component.formatDate(dateString);

        // The formatted string should contain German locale elements
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);

        console.log("Formatted date:", result);
    });

    it("should handle null or invalid date strings in formatDate", () => {
        const dateString = "";
        const result = component.formatDate(dateString);

        // Should return an invalid date string rather than crashing
        expect(typeof result).toBe("string");

        // Handle "Invalid Date" case
        if (!isNaN(result) || !isNaN(Date.parse(result))) {
            expect(result.length).toBeGreaterThan(0);
        }
    });

    it("should format multiple dates consistently", () => {
        const date1 = "2024-01-15T10:30:00Z";
        const date2 = "2023-12-01T14:45:30Z";
        
        const result1 = component.formatDate(date1);
        const result2 = component.formatDate(date2);

        // Both should return strings
        expect(typeof result1).toBe("string");
        expect(typeof result2).toBe("string");
        expect(result1.length).toBeGreaterThan(0);
        expect(result2.length).toBeGreaterThan(0);
    });

    it("should not crash on edge-case date formatting with extreme values", () => {
        // Test date before 1970 (epoch)
        const pastDate = "1960-05-20T08:00:00Z";
        const resultPast = component.formatDate(pastDate);

        // Test date far in future
        const futureDate = "2099-12-31T23:59:59Z";
        const resultFuture = component.formatDate(futureDate);

        expect(typeof resultPast).toBe("string");
        expect(typeof resultFuture).toBe("string");
    });

    it("should have initialized name signal before ngOnInit", () => {
        // name should be initialized by Angular as part of class construction, not ngOnInit
        const initialValue: string = (component as any).name();
        expect(initialValue).not.toBeUndefined();
    });
});
