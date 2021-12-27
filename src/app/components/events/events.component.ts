import {
  AfterViewInit,
  ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild
}
  from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BaseDetailComponent } from 'src/app/core/base-preview.component';
import { previewType } from 'src/app/enums/preview-enum';
import { ICamEvents } from 'src/app/interfaces/ICamEvent';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { ZmService } from '../../services/zm.service';
import { ChangeDetectorConfigurations } from '../detectors/configurations.service';
import { ChangeDetectorJwt } from '../detectors/jwt.service';
import { StreamPreview } from '../preview/stream-preview.component';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class EventsComponentDetail extends BaseDetailComponent<ICamEvents> implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public showPreview: boolean;
  public displayedColumns: string[] = ['EventID', 'Name', 'Cause', 'MonitorId', 'StartTime', 'EndTime', 'Length', 'Frames', 'MaxScore'];
  public streamUrl: string;
  public dataGrid: MatTableDataSource<object>;
  private configurationList: IConfigurationsList;
  private configurationList$: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private zmService: ZmService, private dialog: MatDialog, public configurations: ChangeDetectorConfigurations, public auth: ChangeDetectorJwt) {
    super(auth);
    this.showPreview = false;
  }

  ngOnInit() {
    this.configurationList$ = this.configurations.getDataChanges().subscribe(result => {
      this.configurationList = result.payload;
      if (result.payload.eventsFilter) this.getEvents();
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.configurationList$.unsubscribe();
  }

  getEvents() {
    this.zmService.getEventsList(
      this.token,
      this.configurationList.eventsFilter.startDate,
      this.configurationList.eventsFilter.endDate,
      this.configurationList.eventsFilter.startTime,
      this.configurationList.eventsFilter.endTime,
      this.configurationList.eventsFilter.cam
    ).subscribe(result => {
      this.dataGrid = new MatTableDataSource(result.events.map(data => {
        data.Event.Name = this.getCamName(data.Event.MonitorId);
        return data.Event;
      }));
      this.sort.sort(({ id: 'StartTime', start: 'desc' }) as MatSortable);
      this.dataGrid.sort = this.sort;
      this.dataGrid.paginator = this.paginator;
      this.datasource = result;
    })
  }

  getStreamPreview(eventId: string) {
    return this.zmService.getEventStreamDetail(
      eventId,
      this.token,
      this.configurationList.streamingProperties.streamingMode,
      this.zmService.conf.detailStreamingMaxfps
    );
  }

  setPreview(eventId: string, camId: string, startTime: string, length: string, maxScore: string, target: HTMLElement) {
    const streamingProperties: IStreamProperties = {
      previewType: previewType.eventDetail,
      streamUrl: this.getStreamPreview(eventId),
      camId: camId,
      streamingMode: this.configurationList.streamingProperties.streamingMode,
      eventStreamingMode: null
    }
    this.configurations.setStreamingProperties(streamingProperties);
    this.configurationList.camDiapason.find(cam => {
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
      this.configurations.setStreamingProperties({} as IStreamProperties);
      this.markEvent(target);
    });
  }

  getCamName(camId: string) {
    if (this.configurationList.camDiapason.find(cam => (cam.Id === camId))) {
      return this.configurationList.camDiapason.find(cam => cam.Id === camId).Name;
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