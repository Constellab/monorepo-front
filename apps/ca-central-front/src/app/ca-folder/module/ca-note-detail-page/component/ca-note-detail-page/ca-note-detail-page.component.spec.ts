import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteDetailPageComponent } from './ca-note-detail-page.component';

describe('CaNoteDetailPageComponent', () => {
  let component: CaNoteDetailPageComponent;
  let fixture: ComponentFixture<CaNoteDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaNoteDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaNoteDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
