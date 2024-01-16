import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource, FlTextEditorUploadedImage} from '@monorepo/front-core-lib';
import {
  HaCreateLiveTaskDto,
  HaLiveTask,
  HaLiveTaskDatasourcePaginated
} from '../ha-model/ha-entities/ha-live-task.class';
import {Observable} from 'rxjs';
import {HaLiveTaskVersion, HaLiveTaskVersionFileInput} from '../ha-model/ha-entities/ha-live-task-version.class';
import {ClPage} from '@monorepo/core-lib';
import {HaBrickVersion} from '../ha-model/ha-entities/ha-brick-version.class';
import {TeRichTextContent} from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root'
})
export class HaLiveTaskService {
  private readonly route: string = 'live-task';

  constructor(private apiService: FlApiService) {

  }

  ////////////////////////////////// Live Task //////////////////////////////////

  /**
   * Call http get to get all live tasks
   * return a list of live tasks
   */
  private getAll(page: number, size: number): Observable<ClPage<HaLiveTask>> {
    return this.apiService.get(this.route, HaLiveTask, {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getAllPaginated(): HaLiveTaskDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(page, size), 10);
  }

  /**
   * Call http post to get all live tasks with spaces filter
   * @param spacesFilter
   * @param page
   * @param size
   * @return a list of live tasks
   */
  public getAllWithSpacesFilter(spacesFilter: string[], page: number, size: number): Observable<ClPage<HaLiveTask>> {
    return this.apiService.post(`${this.route}/spaces`, {spacesFilter: spacesFilter},HaLiveTask, {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getAllWithSpacesFilterPaginated(spacesFilter: string[]): HaLiveTaskDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllWithSpacesFilter(spacesFilter, page, size), 10);
  }

  /**
   * Call http get to get a live task by id
   * @param id
   * @return a live task
   */
  public getLiveTaskById(id: string): Observable<HaLiveTask> {
    return this.apiService.get(`${this.route}/${id}`, HaLiveTask);
  }

  /**
   * Create a live task
   * @param createLiveTaskDto
   * @return the created live task
   */
  public create(createLiveTaskDto: HaCreateLiveTaskDto): Observable<HaLiveTaskVersion> {
    return this.apiService.post(this.route, createLiveTaskDto, HaLiveTask);
  }

  /**
   * Call http put to update a live task description
   * @param liveTaskId
   * @param description
   * @return the updated live task
   */
  public saveLiveTaskDescription(liveTaskId: string, description: Record<string, any>): Observable<HaLiveTask> {
    return this.apiService.put(`${this.route}/description/${liveTaskId}`, description, HaLiveTask);
  }


  /**
   * Call http put to upload an image linked to a live task in the description
   * @param file
   * @param liveTaskId
   * @return the uploaded image
   */
  public uploadImage(file: File, liveTaskId: string): Observable<FlTextEditorUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/image/${liveTaskId}`, formData);
  }

  public getImagePath(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  public getImageUrl(filename: string): string {
    return this.getImagePath(filename);
  }


  //////////////////////////////////// Live Task Version //////////////////////////////////////

  /**
   * Call http get to get a live task version by id
   * @param id
   * @return a live task version
   */
  public getLiveTaskVersionById(id: string): Observable<HaLiveTaskVersion> {
    return this.apiService.get(this.route + '/version/' + id, HaLiveTaskVersion);
  }

  /**
   * Call http put to update a live task version environment
   * @param liveTaskVersionId
   * @param environment
   * @return the updated live task version
   */
  public saveLiveTaskVersionEnvironment(liveTaskVersionId: string, environment: string): Observable<HaLiveTaskVersion> {
    const environmentData = {environment: environment};
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/environment`, environmentData, HaLiveTaskVersion);
  }

  /**
   * Call http put to update a live task version code
   * @param liveTaskVersionId
   * @param code
   * @return the updated live task version
   */
  public saveLiveTaskVersionCode(liveTaskVersionId: string, code: string): Observable<HaLiveTaskVersion> {
    const codeData = {code: code};
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/code`, codeData, HaLiveTaskVersion);
  }

  /**
   * Call http put to publish a live task version
   * @param liveTaskVersionId
   * @return the published live task version
   */
  publishLiveTaskVersion(liveTaskVersionId: string): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/publish`, null, HaLiveTaskVersion);
  }

  /**
   * Call http get to get the latest published live task version by live task id
   * @param liveTaskId
   * @return the latest live task version
   */
  getLatestLiveTaskVersionByLiveTaskId(liveTaskId: string): Observable<HaLiveTaskVersion> {
    return this.apiService.get(`${this.route}/${liveTaskId}/version/latest/`, HaLiveTaskVersion);
  }

  /**
   * Call http get to get all published live task versions by live task id
   * @param liveTaskId
   * @return a list of live task versions
   */
  getPublishedLiveTaskVersions(liveTaskId: string): Observable<HaLiveTaskVersion[]> {
    return this.apiService.get(`${this.route}/${liveTaskId}/versions/published`, HaLiveTaskVersion);
  }

  /**
   * Call http put to create a new draft version of a live task
   * @param liveTaskId
   * @param liveTaskVersionFile
   * @return the created live task version
   */
  createNewDraftVersion(liveTaskId: string, liveTaskVersionFile: HaLiveTaskVersionFileInput): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/${liveTaskId}/version/draft`, liveTaskVersionFile, HaLiveTaskVersion);
  }

  /**
   * Call http put to save a live task version infos
   * @param liveTaskVersionId
   * @param versionInfos
   * @return the updated live task version
   */
  saveLiveTaskVersionInfos(liveTaskVersionId: string, versionInfos: TeRichTextContent): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/infos`, versionInfos, HaLiveTaskVersion);
  }

  /**
   * Call http get to get live task version brick dependencies
   * @param liveTaskId
   * return the live task version brickVersions
   */
  getLiveTaskBrickDependencies(liveTaskId: string): Observable<HaBrickVersion[]> {
    return this.apiService.get(`${this.route}/${liveTaskId}/brick-dependencies`, HaBrickVersion);
  }

  /**
   * Call http get to get live task version brick dependencies
   * @param liveTaskVersionId
   * return the live task version brickVersions
   */
  getLiveTaskVersionBrickDependencies(liveTaskVersionId: string): Observable<HaBrickVersion[]> {
    return this.apiService.get(`${this.route}/version/${liveTaskVersionId}/brick-dependencies`, HaBrickVersion);
  }
}
