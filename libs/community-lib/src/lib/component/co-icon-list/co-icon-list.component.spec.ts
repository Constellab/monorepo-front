import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoIconListComponent } from './co-icon-list.component';

describe('CoIconListComponent', () => {
  let component: CoIconListComponent;
  let fixture: ComponentFixture<CoIconListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoIconListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoIconListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
