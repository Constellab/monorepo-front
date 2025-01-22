import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LabTypeEntity } from '../../lab-core/model/entities/lab-type/lab-type.entity';
import { mergeMap, Observable } from 'rxjs';
import { LabTypeService } from '../../lab-core/entity-service/lab-type.service';

@Component({
  selector: 'lab-technical-doc-page',
  templateUrl: './lab-technical-doc-page.component.html',
  styleUrls: ['./lab-technical-doc-page.component.scss'],
  standalone: false,
})
export class LabTechnicalDocPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private typeService = inject(LabTypeService);

  type$: Observable<LabTypeEntity>;

  ngOnInit(): void {
    this.type$ = this.route.params.pipe(
      mergeMap((params) => {
        return this.typeService.getTyping(params.typingName.replaceAll('-', '.'));
      })
    );
  }
}
