import {Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {FlPortalActionsService, FlSnackBarService} from '@monorepo/front-core-lib';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {MatDialogRef} from '@angular/material/dialog';
import {LabRouterService} from '../../../../service/lab-router.service';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';


/**
 * Import a resource from a link
 */
@Component({
  selector: 'lab-import-resource-from-link',
  templateUrl: './lab-import-resource-from-link.component.html',
  styleUrls: ['./lab-import-resource-from-link.component.scss']
})
export class LabImportResourceFromLinkComponent {

  formGp = new FormBuilder().group({
    url: new FormControl('', [Validators.required]),
    uncompressOption: new FormControl('auto', [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<LabImportResourceFromLinkComponent>,
              private resourceService: LabResourceService,
              private snackBarService: FlSnackBarService,
              private actionService: FlPortalActionsService) {
  }


  submit(): void {
    if (this.formGp.valid) {
      this.importResource(this.formGp.value.url, this.formGp.value.uncompressOption);
    }
  }

  private importResource(url: string, uncompressOption: string): void {

    this.actionService.addAction({
      type: 'import-resource',
      action: this.resourceService.uploadResourceFromLink(url, uncompressOption),
      text: {text: 'biox.downloading_resource', translateText: true},
      successLink: (resource: LabResource) => LabRouterService.getResourceDetailRoute(resource.id),
    }, false);

    this.snackBarService.openSuccessMessage({text: 'biox.downloading_resource_help_text', translateText: true}, 5000);
    this.dialogRef.close();
  }
}
