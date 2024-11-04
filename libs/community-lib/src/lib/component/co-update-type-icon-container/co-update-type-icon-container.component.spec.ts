import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoUpdateTypeIconContainerComponent } from './co-update-type-icon-container.component';

describe('CoUpdateTypeIconContainerComponent', () => {
  let component: CoUpdateTypeIconContainerComponent;
  let fixture: ComponentFixture<CoUpdateTypeIconContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoUpdateTypeIconContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoUpdateTypeIconContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
