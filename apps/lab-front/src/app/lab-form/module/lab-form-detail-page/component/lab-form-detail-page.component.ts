import { ChangeDetectionStrategy,Component, computed, inject, Injector, OnInit, signal, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FlAiModule } from '@monorepo/front-core-lib/fl-ai';
import { FlDrawerModule } from '@monorepo/front-core-lib/fl-drawer';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiForm,
  LiFormContent,
  LiFormDisplayMode,
  LiRouterService,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { LiObjectCreationInfoComponent } from '@monorepo/lab-lib/li-entity';
import {
  LiFormActionEvent,
  LiFormActionMenu,
  LiFormContentComponent,
  LiFormService,
  LiFormTemplateRefInlineComponent,
  liGetFormStatus,
} from '@monorepo/lab-lib/li-form';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'lab-form-detail-page',
  templateUrl: './lab-form-detail-page.component.html',
  styleUrl: './lab-form-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlAiModule,
    FlDrawerModule,
    FlSectionModule,
    FlTextIconModule,
    FlFormModule,
    FlStatusModule,
    FlIconModule,
    FlUserModule,
    MatIconButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    LiTagListComponent,
    LiObjectCreationInfoComponent,
    LiFormContentComponent,
    LiFormTemplateRefInlineComponent,
    TranslatePipe,
  ],
})
export class LabFormDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);
  private routerService = inject(LiRouterService);
  private formService = inject(LiFormService);
  private tagService = inject(LiTagService);

  @ViewChild(LiFormContentComponent) private formContentComponent: LiFormContentComponent;

  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);
  tags$ = signal<LiTagDatasource>(null);
  isLoading = signal(false);
  isReadonly = signal(false);
  displayMode = signal<LiFormDisplayMode>('form');

  isDraft = computed(() => this.form()?.status === 'DRAFT');

  aiFillFromText = (text: string): Observable<LiFormContent> => {
    return this.formContentComponent.aiFillFromText(text);
  };

  onAiFillResult(result: unknown): void {
    this.formContentComponent.onAiFillResult(result);
  }

  formStatus = computed(() => {
    const status = this.form()?.status;
    return status ? liGetFormStatus(status) : null;
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.loadForm(params['id']));
  }

  openActionMenu(event: MouseEvent): void {
    const specs = this.formContent()?.specs;
    const actionMenu = new LiFormActionMenu(this.injector, this.form(), this.tags$(), specs);
    actionMenu.openDetailActionMenu(event).subscribe((action) => this.onFormAction(action));
  }

  onContentChanged(content: LiFormContent): void {
    this.formContent.set(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.formContent.set(content);
    this.isReadonly.set(true);
    this.formService.getById(this.form().id).subscribe((form) => {
      this.form.set(form);
    });
  }

  updateName(name: string): void {
    this.formService.update(this.form().id, { name }).subscribe((updated) => {
      const f = this.form();
      f.name = updated.name;
      this.form.set(f);
    });
  }

  private onFormAction(action: LiFormActionEvent): void {
    switch (action.action) {
      case 'delete':
        this.routerService.navigateToFormSearch();
        break;
      case 'archive':
      case 'unarchive':
        this.form.set(action.form);
        break;
    }
  }

  private loadForm(id: string): void {
    this.isLoading.set(true);
    this.formService.getById(id).subscribe({
      next: (form) => {
        this.form.set(form);
        this.isReadonly.set(form.status === 'SUBMITTED');
        this.tags$.set(this.tagService.getEntityTagsDatasource('FORM', form.id));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
