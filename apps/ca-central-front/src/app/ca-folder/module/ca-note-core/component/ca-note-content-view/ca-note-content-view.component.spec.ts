import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteContentViewComponent } from './ca-note-content-view.component';

describe('CaNoteContentViewComponent', () => {
  let component: CaNoteContentViewComponent;
  let fixture: ComponentFixture<CaNoteContentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaNoteContentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaNoteContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
