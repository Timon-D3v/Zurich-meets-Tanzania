import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbuziComponent } from './mbuzi.component';

describe('MbuziComponent', () => {
  let component: MbuziComponent;
  let fixture: ComponentFixture<MbuziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbuziComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbuziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
