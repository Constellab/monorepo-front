import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { FlCodeEditorLanguage } from '../../fl-code-editor.class';
import { FormControl } from '@angular/forms';

/**
 * This component is used to lazy load the code editor component.
 */
@Component({
  selector: 'fl-code-editor',
  templateUrl: './fl-code-editor.component.html',
  styleUrls: ['./fl-code-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlCodeEditorComponent implements OnInit, OnDestroy {
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input({ required: true }) language: FlCodeEditorLanguage;

  @Input({ required: true }) formCtrl: FormControl;

  @Input() focus: boolean = false;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private componentRef: ComponentRef<any>;

  async ngOnInit(): Promise<void> {
    const { FlCodeEditorStandaloneComponent } = await import(
      '../fl-code-editor-standalone/fl-code-editor-standalone.component'
    );
    this.componentRef = this.viewContainer.createComponent(FlCodeEditorStandaloneComponent);
    this.componentRef.instance.formCtrl = this.formCtrl;
    this.componentRef.instance.language = this.language;
    this.componentRef.instance.focus = this.focus;

    // use change detection to force the OnInit of LabPythonEditorComponent to be called
    // because of the parent ChangeDetectionStrategy.OnPush, the OnInit of the lazy loaded
    // component is not called
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
