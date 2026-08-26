import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsExampleComponent } from './ds-example.component';

describe('DsExampleComponent', () => {
  let fixture: ComponentFixture<DsExampleComponent>;

  /** Render the wrapper as the showcase page uses it, with `code` left out unless given. */
  function render(label: string, code?: string): HTMLElement {
    fixture = TestBed.createComponent(DsExampleComponent);
    fixture.componentRef.setInput('label', label);
    if (code !== undefined) {
      fixture.componentRef.setInput('code', code);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should caption the variant with its label', () => {
    const element = render('Small button');

    expect(element.querySelector('.ds-example-label')?.textContent?.trim()).toBe('Small button');
  });

  it('should show the class the variant demonstrates', () => {
    const element = render('Small button', '.g-button-small');

    expect(element.querySelector('.ds-example-code')?.textContent?.trim()).toBe('.g-button-small');
  });

  it('should leave the code caption out when there is no class to show', () => {
    // the page showcases plain Material variants too, and an empty <code> would draw a
    // caption box around nothing
    const element = render('Default button');

    expect(element.querySelector('.ds-example-code')).toBeNull();
  });

  it('should keep a slot for the variant being showcased', () => {
    const element = render('Small button');

    expect(element.querySelector('.ds-example-preview')).not.toBeNull();
  });
});
