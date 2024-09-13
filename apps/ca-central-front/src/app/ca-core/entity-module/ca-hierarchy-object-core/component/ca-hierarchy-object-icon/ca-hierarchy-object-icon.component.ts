import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { CaHierarchyObjectType } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { FlFileHelper, getFileIconFromExtension } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-hierarchy-object-icon',
  templateUrl: './ca-hierarchy-object-icon.component.html',
  styleUrl: './ca-hierarchy-object-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaHierarchyObjectIconComponent {

  objectType = input.required<CaHierarchyObjectType>();

  objectName = input.required<string>();

  size = input<'medium' | 'small'>('medium');

  icon: Signal<string> = computed(() => {
    switch (this.objectType()) {
      // for document, we retrieve the icon from file extension
      case CaHierarchyObjectType.DOCUMENT:
        const extension = FlFileHelper.getFileExtension(this.objectName());
        return getFileIconFromExtension(extension);
      case CaHierarchyObjectType.FOLDER:
        return 'folder';
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        return 'constellab_document';
      case CaHierarchyObjectType.REPORT:
        return 'report';
      case CaHierarchyObjectType.EXPERIMENT:
        return 'experiment';
    }
  });

  iconClasses: Signal<string[]> = computed(() => {
    const classes: string[] = [];
    if (this.size() === 'small') {
      classes.push('g-icon-small');
    }
    const objectType = this.objectType();
    if (objectType === CaHierarchyObjectType.FOLDER) {
      classes.push('g-icon-background', 'g-accent-background');
    } else if (objectType === CaHierarchyObjectType.EXPERIMENT) {
      classes.push('g-icon-background', 'g-warn-background');
    } else if (objectType === CaHierarchyObjectType.REPORT) {
      classes.push('g-icon-background', 'g-primary-background');
    }
    return classes;
  });
}
