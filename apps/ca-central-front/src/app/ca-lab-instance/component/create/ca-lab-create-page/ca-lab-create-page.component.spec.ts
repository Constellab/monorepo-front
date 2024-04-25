import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabCreatePageComponent} from './ca-lab-create-page.component';

describe('CaLabCreatePageComponent', () => {
  let component: CaLabCreatePageComponent;
  let fixture: ComponentFixture<CaLabCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
