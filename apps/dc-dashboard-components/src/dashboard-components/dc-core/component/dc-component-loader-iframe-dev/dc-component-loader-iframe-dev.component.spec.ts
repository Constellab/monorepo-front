import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcComponentLoaderIframeDevComponent } from './dc-component-loader-iframe-dev.component';

describe('DcComponentLoaderDevComponent', () => {
  let component: DcComponentLoaderIframeDevComponent;
  let fixture: ComponentFixture<DcComponentLoaderIframeDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcComponentLoaderIframeDevComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcComponentLoaderIframeDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
