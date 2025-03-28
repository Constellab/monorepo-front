import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiCredentialsTableComponent } from './li-credentials-table.component';

describe('LiCredentialsTableComponent', () => {
  let component: LiCredentialsTableComponent;
  let fixture: ComponentFixture<LiCredentialsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiCredentialsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiCredentialsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
