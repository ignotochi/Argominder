import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, ElementRef, Input, OnInit,
  ViewChild, ViewChildren
}
  from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { BasePreviewDetail } from 'src/app/core/base-preview.component';
import { CamEvents } from 'src/app/interfaces/camEvent';
import { SharedService } from 'src/app/services/shared.service';
import { ConfigService } from '../../services/zm.service';
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
  public displayedColumns: string[] = ['EventID', 'Cause', 'MonitorId', 'StartTime', 'EndTime', 'Length', 'Frames', 'MaxScore'];
  public datasource: CamEvents = (<CamEvents>{ events: [], pagination: {} });

  public streamUrl: string;

  constructor(private pageService: ConfigService, private dialog: MatDialog, public sharedService: SharedService) {
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
    this.pageService.getCamEVents(this.localToken).subscribe(result => {
      this.datasource = result;
    });
  }

  getStreamPreview(eventId: string) {
    return this.pageService.getEventPreview(eventId, this.localToken);
  }

  setPreview(eventId: string) {
    this.sharedService.streamUrl = this.getStreamPreview(eventId);
    this.loadPreview();
  }

  loadPreview(): void {
    const dialogRef = this.dialog.open(StreamPreview);
    dialogRef.afterClosed().subscribe(() => {
      this.sharedService.streamUrl = '';
    });
  }

  stopStream() {

  }

  startStream() {

  }


}