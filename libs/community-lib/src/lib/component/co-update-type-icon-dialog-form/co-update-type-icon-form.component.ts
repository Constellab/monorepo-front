import { Component, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FlColorHelper, FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { CoCommunityIconSelectDialogComponent } from '../co-community-icon-select-dialog/co-community-icon-select-dialog.component';
import { CoIcon } from '../../model/co-icon.class';

@Component({
  selector: 'co-update-type-icon-form',
  templateUrl: './co-update-type-icon-form.component.html',
  styleUrl: './co-update-type-icon-form.component.scss',
  standalone: false,
})
export class CoUpdateTypeIconFormComponent extends FlFormFieldDirective<TdTypeStyle> {
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);

  isDarkTheme = this.themeService.isDarkTheme();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  openCommunityIconSelectMode(): void {
    this.dialogService
      .openMediumDialog(CoCommunityIconSelectDialogComponent)
      .afterClosed()
      .subscribe((icon: CoIcon) => {
        if (icon) {
          const newStyle: TdTypeStyle = {
            icon_type: icon.type,
            icon_technical_name: icon.technicalName,
            background_color: this.value.background_color,
            icon_color:
              FlColorHelper.getContrastColor(this.value.background_color) == 'black' ? '#000000' : '#FFFFFF',
          };
          this.checkAndSend(newStyle);
        }
      });
  }

  changeBgColor(color: string): void {
    const newStyle: TdTypeStyle = {
      icon_type: this.value.icon_type,
      icon_technical_name: this.value.icon_technical_name,
      background_color: color,
      icon_color: FlColorHelper.getContrastColor(color) == 'black' ? '#000000' : '#FFFFFF',
    };
    this.checkAndSend(newStyle);
  }

  isValidStyle(): boolean {
    return (
      this.value.icon_technical_name != null &&
      this.value.icon_technical_name !== '' &&
      this.value.background_color != null
    );
  }

  callChangeEvent(value: TdTypeStyle): void {}

  onDisableChange(disable: boolean): void {
    this.disabled = disable;
  }

  writeValue(obj: TdTypeStyle): void {
    this.value = obj;
  }

  private checkAndSend(style: TdTypeStyle): void {
    if (this.isValidStyle()) {
      this.setAndEmitValue(style);
    }
  }
}
