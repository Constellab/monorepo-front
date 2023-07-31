import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaProjectTreePageComponent} from './ca-project-tree-page.component';

describe('CaProjectTreePageComponent', () => {
  let component: CaProjectTreePageComponent;
  let fixture: ComponentFixture<CaProjectTreePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectTreePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaProjectTreePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
