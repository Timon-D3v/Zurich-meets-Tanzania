import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsBuilderComponent } from './news-builder.component';

describe('NewsBuilderComponent', () => {
  let component: NewsBuilderComponent;
  let fixture: ComponentFixture<NewsBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
