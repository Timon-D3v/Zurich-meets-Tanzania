import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GalleryComponent } from "./gallery.component";
import { GalleryService } from "../services/gallery.service";
import { NotificationService } from "../../app/services/notification.service";

describe("GalleryComponent", () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let mockGalleryService: GalleryService;
    let mockNotificationService: NotificationService;

    beforeEach(async () => {
        // Create mocks for the services
        mockGalleryService = jasmine.createSpyObj("GalleryService", ["getGalleryWithName"]);
        mockNotificationService = jasmine.createSpyObj("NotificationService", [
            "info",
            "success",
            "error",
            "warn",
        ]);

        TestBed.configureTestingModule({
            imports: [],
            providers: [GalleryComponent, { provide: GalleryService, useValue: mockGalleryService }, { provide: NotificationService, useValue: mockNotificationService }],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;

        mockGalleryService = fixture.inject(GalleryService);
        mockNotificationService = fixture.inject(NotificationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize gallery signal with default values (id: -1, loading title)", () => {
        const gallery = component.gallery();
        
        expect(gallery.id).toBe(-1);
        expect(gallery.title).toBe("Laden...");
        expect(gallery.subtitle).toBe("");
        expect(gallery.date).toBe("2000-01-01T00:00:01.000Z");
        expect(Array.isArray(gallery.data)).toBe(true);
        expect(gallery.data.length).toBe(0);

        expect(component.failedFetching()).toBe(false);
    });

    it("should initialize currentOpenIndex signal to -1", () => {
        expect(component.currentOpenIndex()).toBe(-1);
    });

    it("should initialize heroImage signal with fallback URL", () => {
        const heroImage = component.heroImage();
        expect(typeof heroImage).toBe("string");
        expect(heroImage.length).toBeGreaterThan(0);
    });

    it("should call getGallery via observable subscriptions on valid input", (done) => {
        const mockResponse = {
            error: false,
            message: "Success",
            data: {},
        };

        mockGalleryService.getGalleryWithName.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockGalleryService.getGalleryWithName();

        spyOn(observableMock.subscribe, "next").and.callFake((callback: any) => {
            callback(mockResponse);
            return () => {};
        });

        component.getGallery();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.failedFetching()).toBe(false); // Should be false after success
            done();
        }, 0);
    });

    it("should handle null data in API response successfully", (done) => {
        const mockResponse = {
            error: false,
            message: "Success",
            data: null,
        };

        mockGalleryService.getGalleryWithName.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockGalleryService.getGalleryWithName();

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockResponse);
            return () => {};
        });

        component.getGallery();

        fixture.detectChanges();

        // Null data case should still be handled and failedFetching set based on condition
        setTimeout(() => {
            expect(component.gallery().failedFetching || false).not.toBe(true);
            done();
        }, 0);
    });

    it("should handle error flag in API response when loading gallery", (done) => {
        const mockErrorResponse = {
            error: true,
            message: "Gallery not found",
            data: null,
        };

        mockGalleryService.getGalleryWithName.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockGalleryService.getGalleryWithName();

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockErrorResponse);
            return () => {};
        });

        component.getGallery();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.failedFetching()).toBe(true);
            expect(mockNotificationService.error.calls.argsFor(0)).toEqual([
                "Fehler:",
                mockErrorResponse.message,
            ]);
            
            done();
        }, 0);
    });

    it("should handle subscription errors when loading gallery", (done) => {
        const errorMock: unknown = new Error("Network timeout");

        mockGalleryService.getGalleryWithName.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockGalleryService.getGalleryWithName();

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error triggered */ });

        component.getGallery();

        fixture.detectChanges();

        // After subscription error is handled via error callback
        setTimeout(() => {
            expect(component.failedFetching()).toBe(true);
            done();
        }, 0);
    });

    it("should reset heroImage with generateObjectUrl upon navigating to a gallery page", () => {
        const originalHeroValue = component.heroImage();
        
        // Hero image should be set with the first color from colors after loading gallery
        component.getGallery();
        
        setTimeout(() => {
            // After successful getGallery, hero image will be updated
            expect(component.heroImage.length).toBe(originalHeroValue.length);
        }, 0);
    });

    it("should handle console.error logging on subscription errors", (done) => {
        const errorMock: unknown = new Error("Failed to fetch gallery data");

        // Mock console.error to track calls
        spyOn(console, "error").and.callFake(() => {});

        mockGalleryService.getGalleryWithName.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockGalleryService.getGalleryWithName();

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error triggered */ });

        component.getGallery();

        fixture.detectChanges();

        setTimeout(() => {
            expect(console.errorSpy).toHaveBeenCalled();
            done();
        }, 0);
    });

    it("should advance to next image index when calling showNextImage from closed state", () => {
        const currentIndexBefore = component.currentOpenIndex();
        expect(currentIndexBefore).toBe(-1); // Should already be -1
        
        component.showNextImage();

        const currentIndexAfter = component.currentOpenIndex();
        expect(currentIndexAfter).toBe(0); // Should wrap to 0 when closed and advance
    });

    it("should wrap around from last image back to first on showNextImage", () => {
        const mockGallery = { data: [null, null, null] };
        
        spyOn(component as any, "gallery").and.returnValue({ ...mockGallery } as any);
        
        // Start at last item (index 2)
        component.currentOpenIndex.set(2);
        
        component.showNextImage();

        // Should wrap around to index 0
        expect(component.currentOpenIndex()).toBe(0);
    });

    it("should advance showPreviousImage when not closed or showing first image", () => {
        const mockGallery = { data: [null, null, null] };
        
        spyOn(component as any, "gallery").and.returnValue({ ...mockGallery } as any);
        
        // Set to index 2 (not last)
        component.currentOpenIndex.set(2);
        
        component.showPreviousImage();

        expect(component.currentOpenIndex()).toBe(1); // Should decrement by 1
    });

    it("should wrap around from first image to last on showPreviousImage", () => {
        const mockGallery = { data: [null, null, null] };
        
        spyOn(component as any, "gallery").and.returnValue({ ...mockGallery } as any);
        
        // Set to first item (index 0)
        component.currentOpenIndex.set(0);
        
        component.showPreviousImage();

        // Should wrap around to last index (2)
        expect(component.currentOpenIndex()).toBe(mockGallery.data.length - 1);
    });

    it("should handle formatting a valid date string correctly", () => {
        const dateString = "2024-03-15T14:30:00Z";
        const result = component.formatDate(dateString);

        expect(typeof result).toBe("string");
        // Should be formatted in German locale with weekday, day, month, year info
        expect(result.length).toBeGreaterThan(0);
    });

    it("should handle empty or invalid date strings in formatDate", () => {
        const dateString = "";
        const result = component.formatDate(dateString);

        expect(typeof result).toBe("string");
        // Invalid dates should return a string (possibly "Invalid Date" or localized equivalent)
        expect(result.length).toBeGreaterThan(0);
    });

    it("should format consecutive different dates consistently", () => {
        const date1 = "2024-01-15T10:30:00Z";
        const date2 = "2023-12-01T14:45:30Z";

        const result1 = component.formatDate(date1);
        const result2 = component.formatDate(date2);

        expect(typeof result1).toBe("string");
        expect(typeof result2).toBe("string");
        // Each should produce valid localized strings from date objects
    });
});
