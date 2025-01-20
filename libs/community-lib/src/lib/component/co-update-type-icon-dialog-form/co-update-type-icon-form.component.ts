import { Component, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TdTypeStyle } from '@monorepo/technical-doc';
import {
  FlColorHelper,
  FlDialogService,
  FlFormFieldDirective,
  FlThemeService,
} from '@monorepo/front-core-lib';
import { CoCommunityIconSelectDialogComponent } from '../co-community-icon-select-dialog/co-community-icon-select-dialog.component';
import { CoIcon } from '../../model/co-icon.class';

@Component({
    selector: 'co-update-type-icon-form',
    templateUrl: './co-update-type-icon-form.component.html',
    styleUrl: './co-update-type-icon-form.component.scss',
    standalone: false
})
export class CoUpdateTypeIconFormComponent extends FlFormFieldDirective<TdTypeStyle> implements OnInit {
  isDarkTheme = this.themeService.isDarkTheme();

  constructor(
    @Optional() @Self() ngControl: NgControl,
    private dialogService: FlDialogService,
    private themeService: FlThemeService
  ) {
    super(ngControl);
  }

  ngOnInit(): void {}

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
