import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CaAppComponent } from './ca-app.component';

describe('CaAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CaAppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CaAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ca-space-front'`, () => {
    const fixture = TestBed.createComponent(CaAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ca-space-front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CaAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('ca-space-front app is running!');
  });
});
