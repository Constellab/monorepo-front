import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiCommunitySpace, LiProtocolService, LiRouterService, LiTagService } from '@monorepo/lab-lib/li-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Router } from '@angular/router';

export interface LiShareTagToCommunityDialogInput {
  tagKey: string;
}

@Component({
  selector: 'li-share-tag-to-community-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    MatButton,
    FormsModule,
    FlLoaderModule,
    FlSectionModule,
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
  ],
  templateUrl: './li-share-tag-to-community-dialog.component.html',
  styleUrl: './li-share-tag-to-community-dialog.component.scss',
})
export class LiShareTagToCommunityDialogComponent implements OnInit {
  private tagService = inject(LiTagService);
  private protocolService = inject(LiProtocolService);
  private router = inject(Router);


  dialogInput: LiShareTagToCommunityDialogInput = inject(MAT_DIALOG_DATA);


  formGp: UntypedFormGroup;

  spaces: LiCommunitySpace[];

  ngOnInit(): void {
    this.protocolService.getCommunitySpaces().subscribe((spaces) => {
      this.spaces = spaces;
    });

    this.formGp = new FormBuilder().group({
      publishMode: ['PUBLiC', Validators.required],
      spaceSelected: [null],
    });
  }

  shareTag(): void {
    if (this.formGp.invalid)
      return;

    this.tagService
      .shareTagToCommunity(
        this.dialogInput.tagKey,
        this.formGp.value.publishMode,
        this.formGp.value.spaceSelected
      )
      .subscribe((tag) => {

        if (tag){
          this.router.navigate([LiRouterService.getTagDetailRoute(tag.key)]);
        }
      });
  }
}
