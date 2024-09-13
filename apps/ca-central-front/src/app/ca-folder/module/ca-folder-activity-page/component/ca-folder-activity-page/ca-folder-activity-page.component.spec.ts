import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaFolderActivityPageComponent} from './ca-folder-activity-page.component';

describe('CaFolderActivityPageComponent', () => {
  let component: CaFolderActivityPageComponent;
  let fixture: ComponentFixture<CaFolderActivityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderActivityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderActivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
