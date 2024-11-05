import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTechnicalDocPageComponent } from './lab-technical-doc-page/lab-technical-doc-page.component';
import { LabDocumentationRoutingModule } from './lab-documentation-routing.module';
import { LabCoreModule } from '../lab-core/lab-core.module';
import { LabTypeCoreModule } from '../lab-core/entity-module/lab-type-core/lab-type-core.module';

@NgModule({
  declarations: [LabTechnicalDocPageComponent],
  imports: [CommonModule, LabCoreModule, LabTypeCoreModule, LabDocumentationRoutingModule],
})
export class LabDocumentationModule {}
