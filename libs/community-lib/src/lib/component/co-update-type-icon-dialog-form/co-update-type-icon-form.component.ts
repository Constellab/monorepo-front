import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TdTypeStyle, TdTypeStyleIconType } from '@monorepo/technical-doc';
import { FlColorHelper, FlDialogService, FlThemeService } from '@monorepo/front-core-lib';
import {
  CoCommunityIconSelectDialogComponent
} from '../co-community-icon-select-dialog/co-community-icon-select-dialog.component';
import { CoIcon } from '../../model/co-icon.class';

export interface CoUpdateTypeIconFormGroup {
  icon_type: FormControl<TdTypeStyleIconType>;
  icon_color: FormControl<string>;
  icon_technical_name: FormControl<string>;
  background_color: FormControl<string>;
}

@Component({
  selector: 'co-update-type-icon-form',
  templateUrl: './co-update-type-icon-form.component.html',
  styleUrl: './co-update-type-icon-form.component.scss',
})
export class CoUpdateTypeIconFormComponent implements OnInit {
  @Input({ required: true }) formGp: FormGroup<CoUpdateTypeIconFormGroup>;
  style: WritableSignal<TdTypeStyle> = signal<TdTypeStyle>(null);

  isDarkTheme = this.themeService.isDarkTheme();

  constructor(private dialogService: FlDialogService,
              private themeService: FlThemeService) {}

  ngOnInit(): void {
    this.style.set(this.updateStylePreview(this.formGp.value as TdTypeStyle));

    this.formGp.controls.background_color.valueChanges.subscribe(
      (bgColor: string) => {
        this.style.set(this.updateStylePreview(this.formGp.value as TdTypeStyle));
      }
    );
  }

  openCommunityIconSelectMode(): void {

    this.dialogService.openMediumDialog(CoCommunityIconSelectDialogComponent)
      .afterClosed().subscribe((icon: CoIcon) => {
      if (icon) {
        this.formGp.controls.icon_technical_name.patchValue(icon.technicalName);
        this.formGp.controls.icon_type.patchValue(icon.type);
        this.style.set(this.updateStylePreview(this.formGp.value as TdTypeStyle));
      }
    });
  }

  updateStylePreview(value: TdTypeStyle): TdTypeStyle {
    value.icon_color = FlColorHelper.getContrastColor(value.background_color) == 'black' ? '#000000' : '#FFFFFF';
    this.formGp.controls.icon_color.patchValue(value.icon_color);
    return value;
  }
}
