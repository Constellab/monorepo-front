import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcComponentLoaderDevComponent } from './dc-component-loader-dev.component';

describe('DcComponentLoaderDevComponent', () => {
  let component: DcComponentLoaderDevComponent;
  let fixture: ComponentFixture<DcComponentLoaderDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcComponentLoaderDevComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcComponentLoaderDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
