import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabFreeCreateButtonComponent } from './ca-lab-free-create-button.component';

describe('CaLabFreeCreateButtonComponent', () => {
  let component: CaLabFreeCreateButtonComponent;
  let fixture: ComponentFixture<CaLabFreeCreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeCreateButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeCreateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
