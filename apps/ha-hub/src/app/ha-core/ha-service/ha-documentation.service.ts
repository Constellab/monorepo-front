import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {HaDocumentation} from '../ha-model/ha-entities/ha-documentation.class';
import {HaNodeDTO} from '../ha-model/ha-entities/ha-node.class';
import {TeRichTextContent, TeUploadedImage} from '@monorepo/text-editor';

/**
 * Service to manage documentation entity
 */
@Injectable({
  providedIn: 'root'
})
export class HaDocumentationService {

  private readonly route: string = 'documentation';

  constructor(private apiService: FlApiService) {
  }


  /**
   * Call http get one by id
   * @param id id of the entity
   */
  public getById(id: string): Observable<HaDocumentation> {
    return this.apiService.getById(this.route, id, HaDocumentation);
  }

  /**
   * Call http updateContent
   */
  public updateContent(id: string, content: TeRichTextContent): Observable<HaDocumentation> {
    return this.apiService.put(this.route + '/content/' + id, content);
  }

  /**
   * Call http update
   * @param object json object
   */
  public update(object: Partial<HaNodeDTO>): Observable<HaDocumentation> {
    return this.apiService.put(this.route, object, HaDocumentation);
  }

  /**
   * Call http delete
   * @param id id of the entity
   */
  public deleteById(id: string): Observable<HaDocumentation> {
    return this.apiService.deleteById(this.route, id, HaDocumentation);
  }

  ///////////////////////////////////////////// IMAGE /////////////////////////////////////////////


  public getFilePath(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  uploadImage(file: File, docId: string): Observable<TeUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/image/${docId}`, formData);
  }

  getImageUrl(filename: string): string {
    return this.getFilePath(filename);
  }

}
