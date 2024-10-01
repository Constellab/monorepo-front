import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCurrentSpaceLabsPageComponent } from './ca-current-space-labs-page.component';

describe('CaCurrentSpaceLabsPageComponent', () => {
  let component: CaCurrentSpaceLabsPageComponent;
  let fixture: ComponentFixture<CaCurrentSpaceLabsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaCurrentSpaceLabsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceLabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
