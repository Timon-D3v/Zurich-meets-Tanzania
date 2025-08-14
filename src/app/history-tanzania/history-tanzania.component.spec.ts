import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTanzaniaComponent } from './history-tanzania.component';

describe('HistoryTanzaniaComponent', () => {
  let component: HistoryTanzaniaComponent;
  let fixture: ComponentFixture<HistoryTanzaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryTanzaniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryTanzaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
