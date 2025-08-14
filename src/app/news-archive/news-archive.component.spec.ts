import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsArchiveComponent } from './news-archive.component';

describe('NewsArchiveComponent', () => {
  let component: NewsArchiveComponent;
  let fixture: ComponentFixture<NewsArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsArchiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
