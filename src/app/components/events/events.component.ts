import {
  ChangeDetectionStrategy, Component, Input, ViewChild
}
  from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap, take } from 'rxjs/operators';
import { BasePreviewDetail } from 'src/app/core/base-preview.component';
import { streamingEventMode } from 'src/app/enums/enums';
import { previewType } from 'src/app/enums/preview-enum';
import { ICamEvents } from 'src/app/interfaces/ICamEvent';
import { SharedService } from 'src/app/services/shared.service';
import { zmService } from '../../services/zm.service';
import { StreamPreview } from '../preview/stream-preview.component';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class EventsComponent implements BasePreviewDetail {
  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public showPreview: boolean;
  public displayedColumns: string[] = ['EventID', 'Name', 'Cause', 'MonitorId', 'StartTime', 'EndTime', 'Length', 'Frames', 'MaxScore'];
  public datasource: ICamEvents = (<ICamEvents>{ events: [], pagination: {} });
  public streamUrl: string;
  public dataGrid: MatTableDataSource<object>;
  public streamingMode: streamingEventMode;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private zmService: zmService, private dialog: MatDialog, public sharedService: SharedService) {
    this.showPreview = false;
  }

  ngOnInit() {
    this.getEvents();
  }

  ngAfterViewInit() {
    this.sort.sort(({ id: 'StartTime', start: 'desc' }) as MatSortable);
  }

  ngOnDestroy() {

  }

  getEvents() {
    this.sharedService.getEventFiltersConf().pipe(
      switchMap((dataRange) => {
        return this.zmService.getEventsList(this.localToken, dataRange.startDate, dataRange.endDate, dataRange.startTime, dataRange.endTime, dataRange.cam)
      })
    ).subscribe(result => {
      this.dataGrid = new MatTableDataSource(result.events.map(data => {
        data.Event.Name = this.getCamName(data.Event.MonitorId);
        return data.Event;
      }));
      this.dataGrid.sort = this.sort;
      this.dataGrid.paginator = this.paginator;
      this.datasource = result;
    })

  }

  getStreamPreview(eventId: string) {
    this.streamingMode = this.sharedService.eventStreamingMode;
    return this.zmService.getEventStreamDetail(eventId, this.localToken, this.streamingMode, this.zmService.conf.detailStreamingMaxfps);
  }

  setPreview(eventId: string, camId: string, startTime: string, length: string, maxScore: string, target: HTMLElement) {
    this.sharedService.setStreamProperties(previewType.eventDetail, this.getStreamPreview(eventId), camId, this.streamingMode),
      this.sharedService.camSpecializedInfo.find(cam => {
        if (cam.Id === camId) {
          cam.StartTime = startTime;
          cam.Length = length;
          cam.MaxScore = maxScore;
        }
      })
    this.loadPreview(target);
  }

  loadPreview(target: HTMLElement): void {
    const dialogRef = this.dialog.open(StreamPreview);
    dialogRef.afterClosed().subscribe(() => {
      this.sharedService.flushStreamProperties();
      this.markEvent(target);
    });
  }

  getCamName(camId: string) {
    if (this.sharedService.camSpecializedInfo.find(cam => (cam.Id === camId))) {
      return this.sharedService.camSpecializedInfo.find(cam => cam.Id === camId).Name;
    }
  }

  stopStream() {

  }

  startStream() {

  }

  markEvent(target: HTMLElement) {
    if (!target.className.includes('eventShown')) target.classList.add('eventShown');
  }




}