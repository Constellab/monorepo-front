import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectCredentialsComponent } from './li-select-credentials.component';

describe('LiSelectCredentialsComponent', () => {
  let component: LiSelectCredentialsComponent;
  let fixture: ComponentFixture<LiSelectCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectCredentialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
