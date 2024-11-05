import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaServerCloudTableComponent } from './ca-server-cloud-table.component';

describe('ServerInfoTableComponent', () => {
  let component: CaServerCloudTableComponent;
  let fixture: ComponentFixture<CaServerCloudTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerCloudTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaServerCloudTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
