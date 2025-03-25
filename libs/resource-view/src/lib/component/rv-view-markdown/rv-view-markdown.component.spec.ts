import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvViewMarkdownComponent } from './rv-view-markdown.component';

describe('RvViewMarkdownComponent', () => {
  let component: RvViewMarkdownComponent;
  let fixture: ComponentFixture<RvViewMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewMarkdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
