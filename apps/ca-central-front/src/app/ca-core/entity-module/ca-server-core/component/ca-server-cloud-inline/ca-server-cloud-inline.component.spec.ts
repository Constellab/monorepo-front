import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerCloudInlineComponent} from './ca-server-cloud-inline.component';

describe('CaServerInfoInlineComponent', () => {
  let component: CaServerCloudInlineComponent;
  let fixture: ComponentFixture<CaServerCloudInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaServerCloudInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerCloudInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
