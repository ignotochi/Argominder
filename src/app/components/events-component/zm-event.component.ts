import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild
}
  from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BaseCoreUtilsComponent as BaseArgominderComponent } from 'src/app/core/base-arg-component.component';
import { CoreMainServices } from 'src/app/core/core-main-services.service';
import { configurationsActions, streamingEventMode } from 'src/app/enums/enums';
import { previewType } from 'src/app/enums/preview-enum';
import { ICamEvents } from 'src/app/interfaces/ICamEvent';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { ZoneminderStreamingPreview } from '../preview-component/streaming-preview.component';

@Component({
  selector: 'events',
  templateUrl: './zm-event.component.html',
  styleUrls: ['./zm-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [CoreMainServices]
})

export class ZoneminderEvents extends BaseArgominderComponent<ICamEvents> implements OnInit, AfterViewInit, OnDestroy {

  @Input() showPreview: boolean;

  public displayedColumns: string[] = ['EventID', 'Name', 'Cause', 'MonitorId', 'StartTime', 'EndTime', 'Length', 'Frames', 'MaxScore'];
  public streamUrl: string;
  public dataGrid: MatTableDataSource<object>;
  private configurationList: IConfigurationsList = null;
  private configurationList$: Subscription;
  public viewedEvents: string[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public mainServices: CoreMainServices, private dialog: MatDialog, private changeRef: ChangeDetectorRef) {
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

        const defaultModeToEnum = streamingEventMode[Object.keys(streamingEventMode).find(mode => (mode === this.zmService.conf.defaultEventStreamingMode))];

        if (!result.payload.streamingProperties.eventStreamingMode) this.configurationList.streamingProperties.eventStreamingMode = defaultModeToEnum;
        if (result.payload.eventsFilter) this.getEvents();
      });
  }

  ngAfterViewInit() {
    this.sort.sort(({ id: 'StartTime', start: 'desc' }) as MatSortable);
  }

  ngOnDestroy() {
    this.configurationList$.unsubscribe();
    this.dbConf$?.unsubscribe();
  }

  getEvents() {
    this.zmService.getEventsList(
      this.configurationList.eventsFilter.startDate,
      this.configurationList.eventsFilter.endDate,
      this.configurationList.eventsFilter.startTime,
      this.configurationList.eventsFilter.endTime,
      this.configurationList.eventsFilter.cam
    )
    
    .subscribe(result => {
    
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
    return this.zmService.getEventStreamDetail(eventId, this.configurationList.streamingProperties.eventStreamingMode, this.zmService.conf.detailStreamingMaxfps, this.selectedDetailStreamingScale.toString());
  }

  setPreview(item: any) {
   
    const streamingProperties: IStreamProperties = 
    {
      previewType: previewType.eventDetail,
      streamUrl: this.getStreamPreview(item.Id),
      camId: item.MonitorId,
      eventStreamingMode: this.configurationList.streamingProperties.eventStreamingMode
    }

    this.mainServices.configurations.setStreamingProperties(streamingProperties);

    this.configurationList.camDiapason.find(cam => {
      if (cam.Id === item.MonitorId) {
        cam.StartTime = item.StartTime;
        cam.Length = item.Length;
        cam.MaxScore = item.MaxScore;
      }
    })
    this.loadPreview(item.Id);
  }

  loadPreview(eventId: string): void {
    
    const dialogRef = this.dialog.open(ZoneminderStreamingPreview);
    
    dialogRef.afterClosed().subscribe(() => {
      this.markEvent(eventId);
      this.changeRef.markForCheck();
    });
  }

  getCamName(camId: string) {
    if (this.configurationList.camDiapason.find(cam => (cam.Id === camId))) {
      return this.configurationList.camDiapason.find(cam => cam.Id === camId).Name;
    }
  }

  markEvent(eventId: string) {
    this.viewedEvents.push(eventId);
  }

  isMarkedEvent(eventId: string): boolean {
    return this.viewedEvents.includes(eventId);
  }
}