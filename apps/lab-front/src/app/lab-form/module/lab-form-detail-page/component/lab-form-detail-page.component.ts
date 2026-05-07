import { Component, computed, inject, Injector, OnInit, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiRouterService, LiTagDatasource, LiTagService } from '@monorepo/lab-lib/li-core';
import {
  LiForm,
  LiFormActionEvent,
  LiFormActionMenu,
  LiFormContent,
  LiFormEditorComponent,
  LiFormService,
  LiFormTemplateRefInlineComponent,
  liGetFormStatus,
} from '@monorepo/lab-lib/li-form';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'lab-form-detail-page',
  templateUrl: './lab-form-detail-page.component.html',
  styleUrl: './lab-form-detail-page.component.scss',
  imports: [
    FlSectionModule,
    FlTextIconModule,
    FlFormModule,
    FlStatusModule,
    FlIconModule,
    FlUserModule,
    MatIconButton,
    MatIcon,
    LiTagListComponent,
    LiFormEditorComponent,
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

  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);
  tags$ = signal<LiTagDatasource>(null);
  isLoading = signal(false);
  isReadonly = signal(false);

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

  onContentSaved(content: LiFormContent): void {
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
    forkJoin({
      form: this.formService.getById(id),
      content: this.formService.getContent(id),
    }).subscribe({
      next: ({ form, content }) => {
        this.form.set(form);
        this.formContent.set(content);
        this.isReadonly.set(form.status === 'SUBMITTED');
        this.tags$.set(this.tagService.getEntityTagsDatasource('FORM', form.id));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
