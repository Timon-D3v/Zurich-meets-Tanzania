import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeryComponent } from './surgery.component';

describe('SurgeryComponent', () => {
  let component: SurgeryComponent;
  let fixture: ComponentFixture<SurgeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurgeryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurgeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
