import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { CaHierarchyObject } from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectTokenService } from '../../ca-core/service-api/ca-hierarchy-object-token.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ca-public-hierarchy-object-page',
  imports: [AsyncPipe],
  templateUrl: './ca-public-hierarchy-object-page.component.html',
  styleUrl: './ca-public-hierarchy-object-page.component.scss',
})
export class CaPublicHierarchyObjectPageComponent implements OnInit {
  route = inject(ActivatedRoute);

  hierarchyObject$: Observable<CaHierarchyObject>;

  private hierarchyObjectTokenService = inject(CaHierarchyObjectTokenService);

  ngOnInit(): void {
    this.hierarchyObject$ = this.route.params.pipe(
      switchMap((params) => this.hierarchyObjectTokenService.getHierarchyObjectByToken(params.token))
    );
  }
}
