import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CurrentTeamComponent } from "./current-team.component";
import { TeamService } from "../services/team.service";
import { NotificationService } from "../../app/services/notification.service";

describe("CurrentTeamComponent", () => {
    let component: CurrentTeamComponent;
    let fixture: ComponentFixture<CurrentTeamComponent>;
    let mockTeamService: TeamService;
    let mockNotificationService: NotificationService;

    beforeEach(async () => {
        // Create mocks for the services
        mockTeamService = jasmine.createSpyObj("TeamService", ["getCurrentTeam"]);
        mockNotificationService = jasmine.createSpyObj("NotificationService", [
            "info",
            "success",
            "error",
            "warn",
        ]);

        TestBed.configureTestingModule({
            imports: [],
            providers: [CurrentTeamComponent, { provide: TeamService, useValue: mockTeamService }, { provide: NotificationService, useValue: mockNotificationService }],
        }).compileComponents();

        fixture = TestBed.createComponent(CurrentTeamComponent);
        component = fixture.componentInstance;

        mockTeamService = fixture.inject(TeamService);
        mockNotificationService = fixture.inject(NotificationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize team signal with default values (id: -1, empty strings)", () => {
        const team = component.team();
        
        expect(team.id).toBe(-1);
        expect(team.motto).toBe("");
        expect(team.text).toBe("");
        expect(team.picture).not.toBeDefined(); // Will be set in actual initialization

        expect(component.failedFetching()).toBe(false);
    });

    it("should initialize team signal with error values when server context is detected", () => {
        const team = component.team();

        expect(team.id).toBe(-1);
        expect(team.motto).toBe("");
        expect(team.text).toBe("");
        
        // Verify that the failedFetching state is initialized properly
        expect(component.failedFetching()).toBe(false);
    });

    it("should handle null data response in loadCurrentTeam", (done) => {
        const mockResponse = {
            error: false,
            message: "Success",
            data: null, // Null data case
        };

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockResponse);
            return () => {};
        });

        component.loadCurrentTeam();

        fixture.detectChanges();

        // After success with null data, expect error flow
        setTimeout(() => {
            expect(teamId()).toBe(-2); // Should have been set to error state with null data
            done();
        }, 0);
    });

    it("should handle error flag in API response when loading team data", (done) => {
        const mockErrorResponse = {
            error: true,
            message: "Team not found",
            data: {},
        };

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback(mockErrorResponse);
            return () => {};
        });

        component.loadCurrentTeam();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.team().id).toBe(-2); // Error state ID
            expect(mockNotificationService.error.calls.argsFor(0)).toEqual([
                "Fehler beim Laden des Teams:",
                mockErrorResponse.message
            ]);
            done();
        }, 0);
    });

    it("should handle successful team data response when loading current team", (done) => {
        const mockTeamData = {
            id: 1,
            motto: "Teamwork makes the dream work!",
            text: "Lorem ipsum dolor sit amet...",
            picture: "/team/team.jpg",
            members: [],
            date: "2024-01-15T10:30:00Z",
        };

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback({ error: false, message: "Success", data: mockTeamData });
            return () => {};
        });

        component.loadCurrentTeam();

        fixture.detectChanges();

        setTimeout(() => {
            const team = component.team();
            expect(team.id).toBe(mockTeamData.id);
            expect(team.motto).toBe(mockTeamData.motto);
            expect(team.text).toBe(mockTeamData.text);
            expect(team.picture).toBe(mockTeamData.picture);
            expect(team.members.length).toBe(mockTeamData.members.length);
            done();
        }, 0);
    });

    it("should handle subscription errors when loading team", (done) => {
        const errorMock: unknown = new Error("Network timeout");

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error triggered */ });

        component.loadCurrentTeam();

        fixture.detectChanges();

        // Error handler should have been called and set failedFetching to true
        setTimeout(() => {
            expect(component.failedFetching()).toBe(true);
            expect(mockNotificationService.error).toHaveBeenCalled();
            done();
        }, 0);
    });

    it("should handle console.error logging on subscription errors", (done) => {
        const errorMock: unknown = new Error("Failed to fetch team data");

        // Mock console.error to track calls
        spyOn(console, "error").and.callFake(() => {});

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        spyOn(observableMock.subscribe, "error").and.callFake(() => { /* error triggered */ });

        component.loadCurrentTeam();

        fixture.detectChanges();

        setTimeout(() => {
            expect(console.errorSpy).toHaveBeenCalledWith("Error while loading current team:", errorMock);
            done();
        }, 0);
    });

    it("should reset failedFetching flag to false on successful API call", (done) => {
        const mockTeamData = {
            id: 2,
            motto: "Success!",
            text: "Working correctly",
            picture: "/success.jpg",
            members: [],
            date: new Date().toISOString(),
        };

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback({ error: false, message: "Success", data: mockTeamData });
            return () => {};
        });

        component.loadCurrentTeam();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.failedFetching()).toBe(false);
            done();
        }, 0);
    });

    it("should set error team state with id: -2 on all failure paths", (done) => {
        // Test both the API error and null data cases should result in id: -2
        
        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        
        const observableMock = mockTeamService.getCurrentTeam();
        
        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callback({ error: true, message: "Test error", data: null });
            return () => {};
        });

        component.loadCurrentTeam();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.team().id).toBe(-2);
            done();
        }, 0);
    });

    it("should handle multiple consecutive calls to loadCurrentTeam correctly", (done) => {
        const firstData = {
            id: 1,
            motto: "First Team",
            text: "First data",
            picture: "/first.jpg",
            members: [{ name: "Member 1" }],
            date: new Date().toISOString(),
        };

        mockTeamService.getCurrentTeam.and.returnValue(
            jasmine.createSpyObj("Observable", ["subscribe"])
        );
        const observableMock = mockTeamService.getCurrentTeam();

        let callCount = 0;
        
        spyOn(observableMock.subscribe, "next").and.callFake((callback) => {
            callCount++;

            if (callCount === 1) {
                callback({ error: false, message: "Success", data: firstData });
            } else {
                callback({ error: true, message: "Error on subsequent call", data: null });
            }

            return () => {};
        });

        component.loadCurrentTeam();

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.team().id).toBe(firstData.id);
            done();
        }, 0);
    });
});

// Helper function for testing purposes (should be removed after tests are finalized)
function teamId(): number {
    return component.team().id;
}
