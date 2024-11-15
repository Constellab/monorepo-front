import { Injectable } from '@angular/core';
import { FlApiService, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import {
  HaBrick,
  HaBrickCreationDTO,
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
  HaEditBrickDTO,
} from '../ha-model/ha-entities/ha-brick.class';
import { HaNode } from '../ha-model/ha-entities/ha-node.class';
import { HaDocumentation, HaDocumentationSearchDTO } from '../ha-model/ha-entities/ha-documentation.class';
import { HaNewVersionDTO, HaReferenceDTO } from '../ha-model/ha-entities/ha-version.class';
import { HaBrickVersion } from '../ha-model/ha-entities/ha-brick-version.class';
import { TdTypeEntity } from '@monorepo/technical-doc';
import { HaBrickUser } from '../ha-model/ha-entities/ha-brick-user';
import { ClPage, ClVersion } from '@monorepo/core-lib';
import { HaBrickCoAuthorInvite } from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaCoAuthorService } from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import { HaUser } from '../ha-model/ha-entities/ha-user';
import { HaStory } from '../ha-model/ha-entities/ha-story.class';
import { HaProfileDatasourceFilters } from '../../ha-profile/component/ha-profile/ha-profile.component';

@Injectable({
  providedIn: 'root',
})
export class HaBrickService implements HaCoAuthorService {
  private readonly route: string = 'brick';

  constructor(private apiService: FlApiService) {}

  /**
   * Call http create
   * @param object json object
   */
  public create(object: Partial<HaBrickCreationDTO>): Observable<HaBrick> {
    object.version = object.isBeta
      ? ClVersion.fromString(object.version + '-beta.' + object.subPatch)
      : ClVersion.fromString(object.version as string);
    return this.apiService.post(this.route, object, HaBrick);
  }

  /**
   * Call http get to get the brick documentations
   */
  public getBrickDocs(brickId: string, version: string): Observable<HaNode> {
    return this.apiService.get(`${this.route}/docs/${brickId}/${version}`);
  }

  /**
   * Call http get to get brick getting started documentation
   */
  public getBrickGettingStarted(brickName: string, version: string): Observable<HaDocumentation> {
    return this.apiService.get(`${this.route}/first-doc/${brickName}/${version}`);
  }

  public getAllPaginated(): HaBrickDatasourcePaginated {
    return new FlEntityPaginatedDatasource((page, size) => this.getAll(page, size), 10);
  }

  private getAll(page: number, size: number): Observable<ClPage<HaBrick>> {
    return this.apiService.get(this.route, HaStory, { page: page, pageSize: size, resultIsPaginated: true });
  }

  public getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<HaBrick>> {
    return this.apiService.post(
      `${this.route}/filters`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter },
      HaBrick,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  public getAllWithFiltersPaginated(pageSize = 10): HaBrickDatasourcePaginated<HaBrickDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllWithFilters(
          requestData.filtersCriteria.spacesFilter,
          requestData.filtersCriteria.titleFilter,
          page,
          size
        ),
      pageSize,
      { initFirstPage: false }
    );
  }

  public getUserBricks(userId: string, page: number, size: number): Observable<ClPage<HaBrick>> {
    return this.apiService.get(`${this.route}/user/${userId}`, HaBrick, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getUserBricksPaginated(pageSize = 4): HaBrickDatasourcePaginated<HaProfileDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) => this.getUserBricks(requestData.filtersCriteria.userId, page, size),
      pageSize,
      { initFirstPage: false }
    );
  }

  /**
   * Call http get
   * @param name name of the entity
   */
  public getByName(name: string): Observable<HaBrick> {
    return this.apiService.get(`${this.route}/name/${name}`, HaBrick);
  }

  public checkIfBrickExistByName(name: string): Observable<boolean> {
    return this.apiService.get(`${this.route}/check-brick-existence/${name}`);
  }

  public getRootFolderId(brickId: string, version: string): Observable<any> {
    return this.apiService.get(this.route + `/root-folder/${brickId}/${version}`);
  }

  public createNewVersion(
    newVersion: Partial<HaNewVersionDTO>,
    technicalInfo: Record<string, any>,
    references?: HaReferenceDTO[]
  ): Observable<any> {
    if (references && references.length > 0) {
      newVersion.references = references;
    }
    newVersion.technicalInfo = technicalInfo;
    return this.apiService.post(this.route + '/new-version', newVersion);
  }

  public getLastVersion(brickName: string): Observable<HaBrickVersion> {
    return this.apiService.get(`${this.route}/latest/${brickName}`, HaBrickVersion);
  }

  /*Import the technical documentation of the brick*/
  public importTechnicalDocumentation(object: any): Observable<boolean> {
    return this.apiService.post(this.route + '/create-technical-doc', object);
  }

  public getTechnicalDocumentation(brickId: string, version: string): Observable<HaNode> {
    return this.apiService.get(`${this.route}/technical-doc/${brickId}/${version}`);
  }

  public getTechDocByPath(
    brickName: string,
    brickVersion: string,
    techDocType: string,
    techDocUniqueName: string
  ): Observable<TdTypeEntity> {
    return this.apiService.post(`${this.route}/technical-doc-by-path`, {
      brickName: brickName,
      brickVersion: brickVersion,
      techDocType: techDocType,
      techDocUniqueName: techDocUniqueName,
    });
  }

  //EDIT BRICK
  public editBrick(editedBrick: HaEditBrickDTO): Observable<HaBrick> {
    return this.apiService.put(`${this.route}/edit`, editedBrick);
  }

  public editBrickImage(brickId: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);
    return this.apiService.put(`${this.route}/edit-image/${brickId}`, formData);
  }

  getImageUrl(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  deleteBrickImage(filename: string): Observable<any> {
    return this.apiService.delete(`${this.route}/image/${filename}`);
  }

  //VERIFY IF BRICK IT'S A NEW BRICK VERSION
  public isActualBrickAndNewVersion(
    brickId: string,
    inputBrickName: string,
    inputBrickVersion: string
  ): Observable<[boolean, boolean]> {
    return this.apiService.post(`${this.route}/is-actual-brick-and-new-version`, {
      brickId,
      inputBrickName,
      inputBrickVersion,
    });
  }

  public findDocumentationByBrickNameMajor(
    brickName: string,
    major: string
  ): Observable<HaDocumentationSearchDTO[]> {
    return this.apiService.get(`${this.route}/get-docs-by-name/${brickName}/${major}`);
  }

  public findDocumentationByLink(link: string): Observable<HaDocumentationSearchDTO> {
    return this.apiService.post(`${this.route}/get-doc-by-link`, { link: link });
  }

  public getBrickUsers(brickId: string): Observable<HaBrickUser[]> {
    return this.apiService.get(`${this.route}/${brickId}/users`);
  }

  public inviteUser(brickId: string, email: string): Observable<any> {
    return this.apiService.put(`${this.route}/${brickId}/invite-user`, { email: email });
  }

  public removeBrickUser(brickUser: HaBrickUser): Observable<any> {
    return this.apiService.delete(`${this.route}/remove-brick-user/${brickUser.id}`);
  }

  isCoAuthorInviteValid(token: string): Observable<HaBrickCoAuthorInvite> {
    return this.apiService.get(`${this.route}/invite/${token}/is-valid`);
  }

  acceptInvite(token: string): Observable<HaBrick> {
    return this.apiService.put(`${this.route}/invite/${token}/accept`, {});
  }

  deleteCoAuthorInvite(inviteId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/invite/${inviteId}`);
  }

  getCoAuthors(brickId: string): Observable<HaUser[]> {
    return this.apiService.get(`${this.route}/${brickId}/co-authors`, HaUser);
  }

  getCoAuthorsPendingInvites(brickId: string): Observable<HaBrickCoAuthorInvite[]> {
    return this.apiService.get(`${this.route}/${brickId}/co-authors-pending-invites`, HaBrickCoAuthorInvite, {
      resultIsPaginated: false,
    });
  }

  inviteCoAuthor(brickId: string, coAuthorMail: string): Observable<boolean> {
    return this.apiService.post(
      `${this.route}/${brickId}/invite-co-author`,
      { coAuthorMail: coAuthorMail },
      Boolean
    );
  }

  removeCoAuthor(brickId: string, coAuthorId: string): Observable<any> {
    return this.apiService.put(`${this.route}/${brickId}/remove-co-author/${coAuthorId}`, {}, HaStory);
  }

  ////////////////////////////////////////// USER RIGHTS ON BRICK //////////////////////////////
  checkUserRights(brickId: string, fullRight: boolean = true): Observable<boolean> {
    return this.apiService.post(`${this.route}/check-user-rights`, {
      brickId: brickId,
      fullRight: fullRight,
    });
  }
}
