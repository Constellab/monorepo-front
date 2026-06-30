import { inject, Injectable } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import {
  LiCurrentMonitorDTO,
  LiDiskFolderSizesDTO,
  LiMonitorGraphicsBetweenDates,
  LiUploadSpaceCheckDTO,
} from '../model/entities/li-monitor.entity';

@Injectable({
  providedIn: 'root',
})
export class LiMonitorService {
  private apiService = inject(FlApiService);

  private readonly route = 'monitor';

  public getCurrentMonitor(): Observable<LiCurrentMonitorDTO> {
    return this.apiService.get(`${this.route}/current`, LiCurrentMonitorDTO);
  }

  public getMonitorGraphics(
    fromDate: DateTime,
    toDate: DateTime,
    timezoneNumber: number
  ): Observable<LiMonitorGraphicsBetweenDates> {
    return this.apiService.post(
      `${this.route}/graphics`,
      {
        from_date: ClDateHelper.serializeDateTime(fromDate),
        to_date: ClDateHelper.serializeDateTime(toDate),
        timezone_number: timezoneNumber,
      },
      LiMonitorGraphicsBetweenDates
    );
  }

  public getFolderSizes(): Observable<LiDiskFolderSizesDTO> {
    return this.apiService.get(`${this.route}/folder-sizes`, LiDiskFolderSizesDTO);
  }

  /**
   * Check whether the disk has enough free space to upload a file (or folder) of the given size.
   * @param fileSize the total size in bytes (for a folder, sum of all files' sizes)
   */
  public checkUploadSpace(fileSize: number): Observable<LiUploadSpaceCheckDTO> {
    return this.apiService.get(`${this.route}/check-upload-space`, LiUploadSpaceCheckDTO, {
      params: { file_size: String(fileSize) },
    });
  }
}
