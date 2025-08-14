import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTeamComponent } from './current-team.component';

describe('CurrentTeamComponent', () => {
  let component: CurrentTeamComponent;
  let fixture: ComponentFixture<CurrentTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
