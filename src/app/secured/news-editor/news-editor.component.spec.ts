import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEditorComponent } from './news-editor.component';

describe('NewsEditorComponent', () => {
  let component: NewsEditorComponent;
  let fixture: ComponentFixture<NewsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
