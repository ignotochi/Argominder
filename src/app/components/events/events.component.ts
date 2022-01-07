import {
  AfterViewInit,
  ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild
}
  from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BaseCoreUtilsComponent } from 'src/app/core/base-arg-component.component';
import { CoreMainServices } from 'src/app/core/core-main-services.service';
import { configurationsActions, streamingEventMode } from 'src/app/enums/enums';
import { previewType } from 'src/app/enums/preview-enum';
import { ICamEvents } from 'src/app/interfaces/ICamEvent';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { StreamPreview } from '../preview/stream-preview.component';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [CoreMainServices]
})

export class EventsComponentDetail extends BaseCoreUtilsComponent<ICamEvents> implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public showPreview: boolean;
  public displayedColumns: string[] = ['EventID', 'Name', 'Cause', 'MonitorId', 'StartTime', 'EndTime', 'Length', 'Frames', 'MaxScore'];
  public streamUrl: string;
  public dataGrid: MatTableDataSource<object>;
  private configurationList: IConfigurationsList = null;
  private configurationList$: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public mainServices: CoreMainServices, private dialog: MatDialog) {
    super(mainServices);
    this.showPreview = false;
  }

  ngOnInit() {
    this.configurationList$ = this.mainServices.configurations.getDataChanges().pipe(
      filter(tt => tt.action === configurationsActions.CamDiapason || 
        tt.action === configurationsActions.EventsFilter || 
        tt.action === configurationsActions.StreamingProperties || this.configurationList === null))
        .subscribe(result => {
      this.configurationList = result.payload;
      const defaultModeToEnum = streamingEventMode[ Object.keys(streamingEventMode).find(mode => (mode === this.zmService.conf.defaultEventStreamingMode))];      
      if (!result.payload.streamingProperties.eventStreamingMode) this.configurationList.streamingProperties.eventStreamingMode = defaultModeToEnum;      
      if (result.payload.eventsFilter) this.getEvents();
    });
  }

  ngAfterViewInit() {
    this.sort.sort(({ id: 'StartTime', start: 'desc' }) as MatSortable);
  }

  ngOnDestroy() {
    this.mainServices.configurations.setStreamingProperties({} as IStreamProperties);
    this.configurationList$.unsubscribe();
    this.dbConf$?.unsubscribe();
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
      this.dataGrid.sort = this.sort;
      this.dataGrid.paginator = this.paginator;
      this.datasource = result;
    })
  }

  getStreamPreview(eventId: string) {
    return this.zmService.getEventStreamDetail(eventId, this.token, this.configurationList.streamingProperties.eventStreamingMode, this.zmService.conf.detailStreamingMaxfps, this.selectedLiveStreamingScale.toString());
  }

  setPreview(eventId: string, camId: string, startTime: string, length: string, maxScore: string, target: HTMLElement) {
    const streamingProperties: IStreamProperties = {
      previewType: previewType.eventDetail,
      streamUrl: this.getStreamPreview(eventId),
      camId: camId,
      eventStreamingMode: this.configurationList.streamingProperties.eventStreamingMode
    }
    this.mainServices.configurations.setStreamingProperties(streamingProperties);
    
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
      this.markEvent(target);
    });
  }

  getCamName(camId: string) {
    if (this.configurationList.camDiapason.find(cam => (cam.Id === camId))) {
      return this.configurationList.camDiapason.find(cam => cam.Id === camId).Name;
    }
  }

  markEvent(target: HTMLElement) {
    if (!target.className.includes("eventMarked")) { 
      target.classList.add("eventMarked"); 
    };
  }

}