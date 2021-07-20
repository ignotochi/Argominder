import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, ElementRef, Input, OnInit,
  ViewChild, ViewChildren
}
  from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { switchMap, take } from 'rxjs/operators';
import { BasePreviewDetail } from 'src/app/core/base-preview.component';
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

  constructor(private zmService: zmService, private dialog: MatDialog, public sharedService: SharedService) {
    this.showPreview = false;
  }

  ngOnInit() {
    this.getEvents();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  getEvents() {
    this.sharedService.getEventSearchConf().pipe(
      switchMap((dataRange) => {
        return this.zmService.getEventsList(this.localToken, dataRange.startDate, dataRange.endDate)
      })
    ).subscribe(result => {
      this.datasource = result;
    })
    
  }

  getStreamPreview(eventId: string) {
    return this.zmService.getEventPreview(eventId, this.localToken);
  }

  setPreview(eventId: string) {
    this.sharedService.streamProperties.streamUrl = this.getStreamPreview(eventId);
    this.loadPreview();
  }

  loadPreview(): void {
    const dialogRef = this.dialog.open(StreamPreview);
    dialogRef.afterClosed().subscribe(() => {
      this.sharedService.streamProperties.streamUrl = '';
    });
  }

  getCamName(camId: string) {
    return this.sharedService.camsRegistry.find(cam => cam.Id === camId).Name;
  }

  stopStream() {

  }

  startStream() {

  }


}