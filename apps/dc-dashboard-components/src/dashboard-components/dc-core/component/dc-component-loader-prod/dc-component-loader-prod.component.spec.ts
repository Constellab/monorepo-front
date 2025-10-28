import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcComponentLoaderProdComponent } from './dc-component-loader-prod.component';

describe('DcComponentLoaderProdComponent', () => {
  let component: DcComponentLoaderProdComponent;
  let fixture: ComponentFixture<DcComponentLoaderProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcComponentLoaderProdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcComponentLoaderProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
