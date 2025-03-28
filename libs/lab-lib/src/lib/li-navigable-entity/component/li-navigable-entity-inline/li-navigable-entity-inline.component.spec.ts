import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNavigableEntityInlineComponent } from './li-navigable-entity-inline.component';

describe('LiNavigableEntityInlineComponent', () => {
  let component: LiNavigableEntityInlineComponent;
  let fixture: ComponentFixture<LiNavigableEntityInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiNavigableEntityInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNavigableEntityInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
