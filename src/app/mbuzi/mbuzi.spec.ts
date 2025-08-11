import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Mbuzi } from "./mbuzi";

describe("Mbuzi", () => {
    let component: Mbuzi;
    let fixture: ComponentFixture<Mbuzi>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Mbuzi],
        }).compileComponents();

        fixture = TestBed.createComponent(Mbuzi);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
