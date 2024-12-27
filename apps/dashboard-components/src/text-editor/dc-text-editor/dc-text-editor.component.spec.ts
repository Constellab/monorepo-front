import { TestBed } from '@angular/core/testing';
import { DcTextEditorComponent } from './dc-text-editor.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcTextEditorComponent, NxWelcomeComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DcTextEditorComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome dashboard-components');
  });

  it(`should have as title 'dashboard-components'`, () => {
    const fixture = TestBed.createComponent(DcTextEditorComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dashboard-components');
  });
});
