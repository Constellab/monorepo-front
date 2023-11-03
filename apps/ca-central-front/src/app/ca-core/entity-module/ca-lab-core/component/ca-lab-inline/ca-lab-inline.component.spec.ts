import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabInlineComponent} from './ca-lab-inline.component';

describe('CaLabInlineComponent', () => {
  let component: CaLabInlineComponent;
  let fixture: ComponentFixture<CaLabInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
