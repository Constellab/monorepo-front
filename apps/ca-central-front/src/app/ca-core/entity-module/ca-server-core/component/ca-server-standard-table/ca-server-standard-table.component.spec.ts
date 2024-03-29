import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerStandardTableComponent} from './ca-server-standard-table.component';

describe('CaServerStandardTableComponent', () => {
  let component: CaServerStandardTableComponent;
  let fixture: ComponentFixture<CaServerStandardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerStandardTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerStandardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
