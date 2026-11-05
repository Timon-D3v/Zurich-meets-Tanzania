import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountComponent } from "./account.component";
import { AuthService } from "./services/auth.service";
import { AccountService } from "./services/account.service";
import { NotificationService } from "./services/notification.service";
import { PublicUser, ApiEndpointResponse, UpdateUserProfilePictureWithIdApiEndpointResponse } from "../..";

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let mockAuthService: AuthService;
    let mockAccountService: AccountService;
    let mockNotificationService: NotificationService;

    beforeEach(async () => {
        // Create mocks for the services
        mockAuthService = jasmine.createSpyObj("AuthService", ["user"]);
        mockAccountService = jasmine.createSpyObj("AccountService", [
            "updateUserProfilePicture",
            "checkIfUserIsInAnyTeam",
            "checkIfUserIsInBoard",
        ]);
        mockNotificationService = jasmine.createSpyObj("NotificationService", [
            "info",
            "success",
            "error",
        ]);

        await TestBed.configureTestingModule({
            imports: [],
            providers: [AccountComponent, { provide: AuthService, useValue: mockAuthService }, { provide: AccountService, useValue: mockAccountService }, { provide: NotificationService, useValue: mockNotificationService }],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;

        mockAuthService = fixture.inject(AuthService);
        mockAccountService = fixture.inject(AccountService);
        mockNotificationService = fixture.inject(NotificationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize user signal with loading values by default", () => {
        const user = component.user();
        expect(user.email).toBe("Laden...");
        expect(user.firstName).toBe("Laden...");
        expect(user.lastName).toBe("Laden...");
        expect(user.phone).toBe("Laden...");
        expect(user.address).toBe("Laden...");
        expect(user.type).toBe("user");
        expect(user.picture).toBe(PUBLIC_CONFIG.FALLBACK_PROFILE_PICTURE);
    });

    it("should split text into segments with non-breaking hyphens at interval", () => {
        const text = "HelloWorldTest";
        const result = component.split(text, 5);

        expect(result).toContain("\u00AD"); // Should contain at least one non-breaking hyphen marker
    });

    it("should insert a non-breaking hyphen every Nth character starting from interval", () => {
        const text = "ABCDEFGHIJ";
        const result = component.split(text, 3);

        expect(result).toContain("\u00ADC"); // After 3 characters (index 3), insert soft break before C
    });

    it("should handle split with interval of 1 (break between every character)", () => {
        const text = "AB";
        const result = component.split(text, 1);

        expect(result).toContain("\u00AD");
    });

    it("should open the edit picture input dialog when editPicture is called", () => {
        expect(component.editPictureInputOpen()).toBe(false);
        component.editPicture();
        fixture.detectChanges();

        expect(component.editPictureInputOpen()).toBe(true);
    });

    it("should close the edit picture input dialog when closeEditPictureInput is called", () => {
        component.editPictureInputOpen.set(true);
        fixture.detectChanges();

        expect(component.editPictureInputOpen()).toBe(true);

        component.closeEditPictureInput();
        fixture.detectChanges();

        expect(component.editPictureInputOpen()).toBe(false);
    });

    it("should get a random integer between min and max inclusive", () => {
        const min = 1;
        const max = 5;
        const result = component.getRandomInt(min, max);

        // Due to randomness, we check the constraint rather than exact value for each call
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);

        // Run multiple times to verify it actually generates different values
        const results = new Set<number>();
        for (let i = 0; i < 10; i++) {
            const r = component.getRandomInt(min, max);
            results.add(r);
        }
        expect(results.size).toBeGreaterThan(1); // Should have some variation
    });

    it("should handle null file in editPictureInputResult by closing input and showing info notification", () => {
        mockNotificationService.info.calls.reset();
        
        component.editPictureInputResult({ file: null, url: "" });

        fixture.detectChanges();

        expect(component.editPictureInputOpen()).toBe(false);
        expect(mockNotificationService.info).toHaveBeenCalledWith("Keine Datei ausgewählt:", jasmine.stringContaining("Es wurde keine Datei ausgewählt"));
    });

    it("should close input and show info notification when file is provided", async () => {
        mockNotificationService.info.calls.reset();
        
        const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
        component.editPictureInputResult({ file: mockFile, url: "" });

        fixture.detectChanges();

        // Input should be closed immediately
        expect(component.editPictureInputOpen()).toBe(false);
        expect(mockNotificationService.info).toHaveBeenCalledWith("Datei ausgewählt:", jasmine.stringContaining("hochgeladen"));
    });

    it("should handle unsuccessful API response from editPictureInputResult", async () => {
        const mockErrorResponse: UpdateUserProfilePictureWithIdApiEndpointResponse = {
            error: true,
            message: "Failed to upload picture",
            data: null,
        };

        mockAccountService.updateUserProfilePicture.and.returnValue(
            jasmine.createSpyObj("Observable", "subscribe")
        );
        const mockSubscribe = mockAccountService.updateUserProfilePicture;

        // Set up the subscribe callback chain
        const responseCalls: UpdateUserProfilePictureWithIdApiEndpointResponse[] = [];
        mockSubscribe.subscribe.calls.reset();

        const createMockCall = (response: UpdateUserProfilePictureWithIdApiEndpointResponse, index: number) => {
            spyOn(mockAccountService.updateUserProfilePicture().subscribe, "next").and.callFake(() => {
                // This will be called by our test setup below
                return () => {};
            });
            mockAccountService.updateUserProfilePicture().subscribe.next(response);
            responseCalls.push(response);
        };

        createMockCall(mockErrorResponse, 0);

        component.editPictureInputResult({ file: null, url: "" });

        fixture.detectChanges();

        // After processing error response
        expect(mockNotificationService.error).toHaveBeenCalledWith("Fehler", mockErrorResponse.message);
    });

    it("should handle subscription errors in editPictureInputResult", (done) => {
        const errorHandler = jasmine.createSpy("errorHandler");
        
        mockAccountService.updateUserProfilePicture.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockAccountService.updateUserProfilePicture();
        
        const errorMock: unknown = new Error("Network error");

        observableMock.subscribe.and.callFake((callback) => {
            callback(errorMock);
        });

        component.editPictureInputResult({ file: null, url: "" });

        fixture.detectChanges();

        // Should log error and show notification
        expect(console.errorSpy).toHaveBeenCalled();
        expect(mockNotificationService.error.calls.argsFor(0)).toEqual(["Fehler", jasmine.stringContaining("aktualisiert werden")]);

        done();
    });

    it("should handle isInAnyTeamCheck with successful response", (done) => {
        const mockResponse: ApiEndpointResponse = {
            error: false,
            message: "true",
        };

        mockAccountService.checkIfUserIsInAnyTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockAccountService.checkIfUserIsInAnyTeam();

        observableMock.subscribe.and.callFake((callback) => {
            callback(mockResponse);
        });

        component.isInAnyTeamCheck();

        fixture.detectChanges();

        // Use setTimeout because we need to await the subscription
        setTimeout(() => {
            expect(component.isInAnyTeam()).toBe(true);
            done();
        }, 0);
    });

    it("should handle isInBoardCheck with successful response", (done) => {
        const mockResponse: ApiEndpointResponse = {
            error: false,
            message: "true",
        };

        mockAccountService.checkIfUserIsInBoard.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockAccountService.checkIfUserIsInBoard();

        observableMock.subscribe.and.callFake((callback) => {
            callback(mockResponse);
        });

        component.isInBoardCheck();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.isInBoard()).toBe(true);
            done();
        }, 0);
    });

    it("should handle API errors in isInAnyTeamCheck", (done) => {
        const mockErrorResponse: ApiEndpointResponse = {
            error: true,
            message: "API Error",
        };

        mockAccountService.checkIfUserIsInAnyTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockAccountService.checkIfUserIsInAnyTeam();

        observableMock.subscribe.and.callFake((callback) => {
            callback(mockErrorResponse);
        });

        component.isInAnyTeamCheck();

        fixture.detectChanges();

        setTimeout(() => {
            expect(mockNotificationService.error).toHaveBeenCalledWith("Fehler", mockErrorResponse.message);
            done();
        }, 0);
    });

    it("should handle subscription errors in isInBoardCheck", (done) => {
        const errorMock: unknown = new Error("Network failure");

        mockAccountService.checkIfUserIsInBoard.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockAccountService.checkIfUserIsInBoard();

        observableMock.subscribe.and.callFake((callback) => {
            callback(errorMock);
        });

        component.isInBoardCheck();

        fixture.detectChanges();

        setTimeout(() => {
            expect(console.errorSpy).toHaveBeenCalled();
            expect(mockNotificationService.error.calls.argsFor(0)).toEqual(["Fehler", jasmine.stringContaining("vorstand bist")]);
            done();
        }, 0);
    });

    it("should initialize isInAnyTeam signal to false by default", () => {
        expect(component.isInAnyTeam()).toBe(false);
    });

    it("should initialize isInBoard signal to false by default", () => {
        expect(component.isInBoard()).toBe(false);
    });
});
