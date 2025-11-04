import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaIconContainerComponent } from './ca-icon-container.component';

describe('CaIconContainerComponent', () => {
  let component: CaIconContainerComponent;
  let fixture: ComponentFixture<CaIconContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaIconContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaIconContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
