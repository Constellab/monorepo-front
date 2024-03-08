import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TdTypeIconBadgeComponent} from './td-type-icon-badge.component';

describe('TdTypeRoundIconComponent', () => {
  let component: TdTypeIconBadgeComponent;
  let fixture: ComponentFixture<TdTypeIconBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdTypeIconBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdTypeIconBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
