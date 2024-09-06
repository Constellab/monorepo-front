import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Page of a folder chat
 */
@Component({
  selector: 'ca-chat-detail-page',
  templateUrl: './ca-chat-detail-page.component.html',
  styleUrl: './ca-chat-detail-page.component.scss'
})
export class CaChatDetailPageComponent {


  folderId$: Observable<string> = inject(ActivatedRoute).params.pipe(map(params => params.id));
}
