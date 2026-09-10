import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TeamFromIdComponent } from "./team-from-id.component";

describe("TeamFromIdComponent", () => {
    let component: TeamFromIdComponent;
    let fixture: ComponentFixture<TeamFromIdComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeamFromIdComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TeamFromIdComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
