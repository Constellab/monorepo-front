import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaSelectLabComponent } from './ca-select-lab.component';

describe('CaSelectLabComponent', () => {
  let component: CaSelectLabComponent;
  let fixture: ComponentFixture<CaSelectLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectLabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaSelectLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
