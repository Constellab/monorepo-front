import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrIofaceInfoPortalComponent } from './pr-ioface-info-portal.component';

describe('PrIofaceInfoPortalComponent', () => {
  let component: PrIofaceInfoPortalComponent;
  let fixture: ComponentFixture<PrIofaceInfoPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrIofaceInfoPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrIofaceInfoPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
