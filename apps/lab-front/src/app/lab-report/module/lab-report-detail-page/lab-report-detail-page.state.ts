import {Injectable, OnDestroy} from '@angular/core';
import {LabReportService} from '../../../lab-core/entity-service/lab-report.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {LabReport, LabReportContent} from '../../../lab-core/model/entities/lab-report.entity';
import {filter} from 'rxjs/operators';

@Injectable()
export class LabReportDetailPageState implements OnDestroy {

  private report$: BehaviorSubject<LabReport> = new BehaviorSubject(null);
  private reportContent$: BehaviorSubject<LabReportContent> = new BehaviorSubject(null);

  constructor(private reportService: LabReportService) {
  }

  public init(reportId: string): void {
    this.reportService.getReport(reportId).subscribe({
      next: report => this.report$.next(report),
      error: error => this.report$.error(error)
    });

    this.reportService.getReportContent(reportId).subscribe({
      next: content => this.reportContent$.next(content),
      error: error => this.reportContent$.error(error)
    });
  }

  public get currentReport(): LabReport {
    return this.report$.value;
  }

  public getReport$(): Observable<LabReport> {
    return this.report$.asObservable().pipe(filter(report => report != null));
  }

  public getContent$(): Observable<LabReportContent> {
    return this.reportContent$.asObservable().pipe(filter(report => report != null));
  }

  public updateReport(report: LabReport): void {
    const currentReport = this.currentReport;
    currentReport.title = report.title;
    currentReport.folder = report.folder;
    currentReport.isValidated = report.isValidated;
    currentReport.isArchived = report.isArchived;
    this.report$.next(currentReport);
  }

  public refreshReport(): void {
    this.reportService.getReport(this.currentReport.id).subscribe({
      next: report => this.report$.next(report),
      error: error => this.report$.error(error)
    });

  }

  public updateContent(content: LabReportContent): void {
    this.reportContent$.next(content);
  }

  ngOnDestroy(): void {
    this.report$.complete();
    this.reportContent$.complete();
  }


}
