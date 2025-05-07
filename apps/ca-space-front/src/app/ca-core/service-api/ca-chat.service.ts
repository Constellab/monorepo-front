import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { CaChatFolder } from '../model/entities/folder/ca-hierarchy-object.class';
import { CaFolder } from '../model/entities/folder/ca-folder.class';
import { CaChatMessage } from '../model/entities/ca-chat-message';
import { ClPage } from '@monorepo/core-lib';
import { TeBlockFigureUploadedResponse, TeRichText } from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root',
})
export class CaChatService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'chat';

  public getChatRootFolders(): Observable<CaChatFolder[]> {
    return this.apiService.get(`${this.route}/folder-tree`, CaChatFolder);
  }

  public activateChat(folderId: string, enable: boolean): Observable<CaFolder> {
    return this.apiService.put(`${this.route}/folder/${folderId}/activate/${enable}`, null, CaFolder);
  }

  public getFolderMessages(folderId: string, page: number, size: number): Observable<ClPage<CaChatMessage>> {
    return this.apiService.get(`${this.route}/folder/${folderId}/message`, CaChatMessage, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public createMessage(folderId: string, richText: TeRichText): Observable<CaChatMessage> {
    return this.apiService.post(
      `${this.route}/folder/${folderId}/message`,
      { content: richText.toJson() },
      CaChatMessage
    );
  }

  public updateMessage(folderId: string, messageId: string, richText: TeRichText): Observable<CaChatMessage> {
    return this.apiService.put(
      `${this.route}/folder/${folderId}/message/${messageId}`,
      { content: richText.toJson() },
      CaChatMessage
    );
  }

  public deleteMessage(folderId: string, messageId: string): Observable<CaChatMessage> {
    return this.apiService.delete(`${this.route}/folder/${folderId}/message/${messageId}/delete`, null);
  }

  uploadMessageImage(file: File, folderId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/folder/${folderId}/message/image`, formData);
  }

  public getMessageImageUrl(filename: string, folderId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/folder/${folderId}/message/image/${filename}`);
  }
}
