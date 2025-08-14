import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeducationComponent } from './meducation.component';

describe('MeducationComponent', () => {
  let component: MeducationComponent;
  let fixture: ComponentFixture<MeducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeducationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
