import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { ContactComponent } from "./contact.component";
import { AuthService } from "../services/auth.service";
import { ContactService } from "../services/contact.service";
import { NotificationService } from "../services/notification.service";

describe("ContactComponent", () => {
    let component: ContactComponent;
    let fixture: ComponentFixture<ContactComponent>;
    let mockAuthService: AuthService;
    let mockContactService: ContactService;
    let mockNotificationService: NotificationService;

    beforeEach(async () => {
        // Create mocks for the services
        mockAuthService = jasmine.createSpyObj("AuthService", ["user", "isLoggedIn"]);
        mockContactService = jasmine.createSpyObj("ContactService", [
            "submitMessageAndGetVerificationToken",
            "confirmVerificationToken",
        ]);
        mockNotificationService = jasmine.createSpyObj("NotificationService", [
            "info",
            "success",
            "error",
            "warn",
        ]);

        TestBed.configureTestingModule({
            imports: [],
            providers: [ContactComponent, { provide: AuthService, useValue: mockAuthService }, { provide: ContactService, useValue: mockContactService }, { provide: NotificationService, useValue: mockNotificationService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ContactComponent);
        component = fixture.componentInstance;

        mockAuthService = fixture.inject(AuthService);
        mockContactService = fixture.inject(ContactService);
        mockNotificationService = fixture.inject(NotificationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize submission button state and verification flag correctly", () => {
        expect(component.submitButtonText()).toBe("Absenden");
        expect(component.submitButtonDisabled()).toBe(false);
        expect(component.verificationCodeSent()).toBe(false);
    });

    it("should autofill form when authService returns a user object with profile data", () => {
        const mockUser = {
            email: "test@example.com",
            firstName: "Max",
            lastName: "Müller",
            phone: "+41 123 456 789",
            address: "Teststrasse 1, Zürich",
            type: "user",
            picture: "/test.jpg",
        };

        mockAuthService.user.and.returnValue(mockUser);

        component.autofill();

        const firstName = component.contactForm.value.firstNameControl;
        const lastName = component.contactForm.value.lastNameControl;
        const email = component.contactForm.value.emailControl;

        expect(firstName).toBe("Max");
        expect(lastName).toBe("Müller");
        expect(email).toBe("test@example.com");
    });

    it("should autofill form with empty strings when authService returns null user", () => {
        mockAuthService.user.and.returnValue(null);

        component.autofill();

        const firstName = component.contactForm.value.firstNameControl;
        const lastName = component.contactForm.value.lastNameControl;
        const email = component.contactForm.value.emailControl;

        expect(firstName).toBe("");
        expect(lastName).toBe("");
        expect(email).toBe("");
    });

    it("should handle empty name fields in onSubmit", () => {
        (component as any).contactForm.setValue({
            firstNameControl: "",
            lastNameControl: "",
            emailControl: "test@example.com",
            messageControl: "Test message",
        });

        const submitEvent = new Event("submit");

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib deinen Vornamen ein.");
        expect((component as any).submitButtonDisabled()).toBe(false);
        expect(component.submitButtonText()).toBe("Absenden");
    });

    it("should handle empty last name field in onSubmit", () => {
        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "",
            emailControl: "test@example.com",
            messageControl: "Test message",
        });

        const submitEvent = new Event("submit");

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib deinen Nachnamen ein.");
    });

    it("should handle empty or invalid email in onSubmit", () => {
        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "",
            messageControl: "Test message with at least 10 chars this",
        });

        const submitEvent = new Event("submit");

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");
    });

    it("should handle short message in onSubmit (less than 10 characters)", () => {
        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "test@example.com",
            messageControl: "hi!",
        });

        const submitEvent = new Event("submit");

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib eine Nachricht ein. (Mindestens 10 Zeichen)");
    });

    it("should handle empty message in onSubmit", () => {
        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "test@example.com",
            messageControl: "",
        });

        const submitEvent = new Event("submit");

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib eine Nachricht ein. (Mindestens 10 Zeichen)");
    });

    it("should handle whitespace-only message in onSubmit", () => {
        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "test@example.com",
            messageControl: "   ",
        });

        const submitEvent = new Event("submit");

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib eine Nachricht ein. (Mindestens 10 Zeichen)");
    });

    it("should handle valid submission with null or error API response", () => {
        const mockErrorResponse = {
            error: true,
            message: "Invalid email format",
            data: null,
        };

        mockContactService.submitMessageAndGetVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.submitMessageAndGetVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockErrorResponse);
            return () => {};
        });

        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "test@example.com",
            messageControl: "Test message with at least 10 chars this way",
        });

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        // After the async callback runs
        setTimeout(() => {
            expect(mockNotificationService.error).toHaveBeenCalledWith("Fehler:", mockErrorResponse.message);
            expect((component as any).submitButtonDisabled()).toBe(false);
            expect(component.submitButtonText()).toBe("Absenden");
        }, 0);
    });

    it("should handle subscription errors in onSubmit", (done) => {
        const errorMock: unknown = new Error("Network request failed");

        mockContactService.submitMessageAndGetVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.submitMessageAndGetVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error happened */ });

        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "test@example.com",
            messageControl: "Test message with at least 10 chars this way",
        });

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        expect((component as any).submitButtonDisabled()).toBe(false);
        expect(component.submitButtonText()).toBe("Absenden");
        done();
    });

    it("should handle success response in onVerificationSubmit", (done) => {
        const mockSuccessResponse = {
            error: false,
            message: "Verified",
            data: null,
        };

        mockContactService.confirmVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.confirmVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockSuccessResponse);
            return () => {};
        });

        // Mock valid form values (64-char token and 10-char code as regexes verify)
        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            verificationCodeControl: "validcodexx",
        });

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        setTimeout(() => {
            expect(mockNotificationService.success).toHaveBeenCalledWith("Versendet!", jasmine.stringContaining("erfolgreich bestätigt"));
            expect(component.verificationCodeSent()).toBe(false);
            expect((component as any).submitButtonDisabled()).toBe(false);
            expect(component.submitButtonText()).toBe("Absenden");
            done();
        }, 0);
    });

    it("should handle empty or invalid token in onVerificationSubmit", () => {
        (component as any).contactVerificationForm.setValue({
            tokenControl: "invalid token here",
            verificationCodeControl: "123456789a",
        });

        const submitEvent = new Event("submit");

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Applikationsfehler:", jasmine.stringContaining("Es wurde kein gültiger Token übermittelt"));
    });

    it("should handle token that doesn't match regex pattern (too short)", () => {
        (component as any).contactVerificationForm.setValue({
            tokenControl: "short",
            verificationCodeControl: "123456789a",
        });

        const submitEvent = new Event("submit");

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Applikationsfehler:", jasmine.stringContaining("Es wurde kein gültiger Token übermittelt"));
    });

    it("should handle empty verification code in onVerificationSubmit", () => {
        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", // valid 64 chars
            verificationCodeControl: "",
        });

        const submitEvent = new Event("submit");

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib einen gültigen Bestätigungscode ein.");
    });

    it("should handle invalid verification code (uppercase letters) in onVerificationSubmit", () => {
        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            verificationCodeControl: "ABCDEF1234567890", // has uppercase letters
        });

        const submitEvent = new Event("submit");

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        expect(mockNotificationService.error).toHaveBeenCalledWith("Eingabefehler:", "Bitte gib einen gültigen Bestätigungscode ein.");
    });

    it("should handle error response in onVerificationSubmit", (done) => {
        const mockErrorResponse = {
            error: true,
            message: "Code expired",
            data: null,
        };

        mockContactService.confirmVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.confirmVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockErrorResponse);
            return () => {};
        });

        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            verificationCodeControl: "validcodexx",
        });

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        setTimeout(() => {
            expect(mockNotificationService.error).toHaveBeenCalledWith("Fehler:", "Deine Anfrage konnte nicht bestätigt werden, da der Bestätigungscode ungültig oder abgelaufen ist.");
            done();
        }, 0);
    });

    it("should handle subscription errors in onVerificationSubmit", (done) => {
        const errorMock: unknown = new Error("Network failure");

        mockContactService.confirmVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.confirmVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error happened */ });

        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            verificationCodeControl: "validcodexx",
        });

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        setTimeout(() => {
            expect(mockNotificationService.error).toHaveBeenCalledWith("Fehler", jasmine.stringContaining("Bestätigen"));
            done();
        }, 0);
    });

    it("should reset state after error response in onVerificationSubmit", (done) => {
        const mockErrorResponse = {
            error: true,
            message: "Invalid code",
            data: null,
        };

        mockContactService.confirmVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.confirmVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockErrorResponse);
            return () => {};
        });

        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            verificationCodeControl: "validcodexx",
        });

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        setTimeout(() => {
            expect((component as any).submitButtonDisabled()).toBe(false);
            expect(component.submitButtonText()).toBe("Bestätigen");
            done();
        }, 0);
    });

    it("should check console.error for error logging in onSubmit", (done) => {
        const errorMock: unknown = new Error("Network failed");

        mockContactService.submitMessageAndGetVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.submitMessageAndGetVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(console, "error").and.callFake(() => {});

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error triggered */ });

        (component as any).contactForm.setValue({
            firstNameControl: "Max",
            lastNameControl: "Müller",
            emailControl: "test@example.com",
            messageControl: "Test message with at least 10 chars this way!",
        });

        component.onSubmit(submitEvent);

        fixture.detectChanges();

        setTimeout(() => {
            expect(console.errorSpy).toHaveBeenCalled();
            done();
        }, 0);
    });

    it("should check console.error for error logging in onVerificationSubmit", (done) => {
        const errorMock: unknown = new Error("Verification failed");

        mockContactService.confirmVerificationToken.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockContactService.confirmVerificationToken();
        const submitEvent = new Event("submit");

        spyOn(console, "error").and.callFake(() => {});

        (component as any).contactVerificationForm.setValue({
            tokenControl: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            verificationCodeControl: "validcodexx",
        });

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error triggered */ });

        component.onVerificationSubmit(submitEvent);

        fixture.detectChanges();

        setTimeout(() => {
            // Verify that an error was logged when error callback is invoked
            expect(console.errorSpy).toHaveBeenCalled();
            done();
        }, 0);
    });
});
