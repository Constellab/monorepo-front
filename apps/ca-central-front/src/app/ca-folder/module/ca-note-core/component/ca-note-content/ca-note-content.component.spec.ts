import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaNoteContentComponent } from './ca-note-content.component';

describe('CaNoteContentComponent', () => {
  let component: CaNoteContentComponent;
  let fixture: ComponentFixture<CaNoteContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaNoteContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaNoteContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
