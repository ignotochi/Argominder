import {
  AfterViewInit,
  ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BasePreviewDetail } from 'src/app/core/base-preview.component';
import { configurationsActions } from 'src/app/enums/enums';
import { previewType } from 'src/app/enums/preview-enum';
import { StreamStatus } from 'src/app/enums/stream-enum';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { zmService } from '../../services/zm.service';
import { ChangeDetectorConfigurations } from '../detectors/configurations.service';
import { StreamPreview } from '../preview/stream-preview.component';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';

@Component({
  selector: 'live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LiveStreamComponent implements BasePreviewDetail, OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('spinner', { read: ElementRef }) spinners: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('stream', { read: ElementRef }) streams: QueryList<ElementRef<HTMLImageElement>>;
  @ViewChildren('expand', { read: ElementRef }) expands: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('detailInfo', { read: ElementRef }) detailInfo: QueryList<ElementRef<HTMLElement>>;

  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });
  private detail: { enabled: boolean, stream: string } = { enabled: false, stream: null };
  public showInfoDetail: boolean = false;
  private configurationsList: IConfigurationsList;
  private dataChange$: Subscription;
  private streamChanges$: Subscription;
  private camInfo$: Subscription;
  private dialog$: Subscription;

  constructor(private zmService: zmService, private configurations: ChangeDetectorConfigurations, private dialog: MatDialog) {
    this.dataChange$ = this.configurations.getDataChanges()?.pipe(
      filter(tt => tt.action === configurationsActions.CamDiapason || tt.action === configurationsActions.PreviewStatus)).subscribe(result => {
        this.configurationsList = result.payload;
        if (result.action === configurationsActions.PreviewStatus) this.previewStatus(result.payload.previewStatus);
      })
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
    this.dataChange$.unsubscribe();
    this.streamChanges$.unsubscribe();
    this.camInfo$.unsubscribe();
    this.dialog$.unsubscribe();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getCamList();
    this.streamChanges$ = this.streams.changes.subscribe((result) => { if (result.length > 0) this.startStream(); });
  }

  showExpands(camId: string, loadStatus: boolean) {
    const matchedEle = this.expands.map(expand => expand.nativeElement);
    if (loadStatus === true) matchedEle.forEach(ele => { if (ele.getAttribute('camId') === camId) ele.classList.remove('hidden'); });
  }

  hideExpands() {
    const matchedEle = this.expands.map(expand => expand.nativeElement);
    matchedEle.forEach(ele => { ele.classList.add('hidden'); });
  }

  ShowOrhideSpinners(camId: string, loadStatus: boolean) {
    const matchedEle = this.spinners.find(spinner => spinner.nativeElement.id.includes(camId));
    if (loadStatus === true) matchedEle.nativeElement.classList.add('hidden');
    if (loadStatus === false) matchedEle.nativeElement.classList.remove('hidden');
  }

  loadDetailStreamInfo(camId: string) {
    this.detailInfo.forEach(detail => {
      if (detail.nativeElement.getAttribute('id') === camId) {
        detail.nativeElement.innerText = this.getPreviewInfo(camId);
      }
    });
  }

  getStream(cam: string, index: number, status: string) {
    if (status !== StreamStatus.Connected) return 'assets/img/broken.jpg';
    if (status === StreamStatus.Connected) return this.zmService.getLiveStream(cam, this.localToken, index);
  }

  getStreamPreview(cam: string) {
    return this.zmService.getLiveStreamDetail(cam, this.localToken);
  }

  getCamList() {
    this.camInfo$ = this.zmService.getCamListInfo(this.localToken).subscribe((result) => {
      this.datasource.monitors = result.monitors;

      result.monitors.forEach(result => {
        const registry: ICamRegistry = {
          Name: result.Monitor.Name,
          Id: result.Monitor.Id,
          DayEvents: result.Monitor.DayEvents,
          MonthEvents: result.Monitor.MonthEvents,
          TotalEvents: result.Monitor.TotalEvents,
          Function: result.Monitor.Function,
          MaxFPS: result.Monitor.MaxFPS,
          Path: result.Monitor.Path,
          Type: result.Monitor.Type,
          Width: result.Monitor.Width,
          Height: result.Monitor.Height,
        }
        this.configurations.setCamDiapason(registry);
      })
    }, (err: Error) => {
      console.log(err);
    });
  }

  viewStream(status: string) {
    return status === StreamStatus.Connected;
  }

  onImageLoad(evt: any, camId: string) {
    if (evt && evt.target) {
      const width = evt.target.naturalWidth;
      const height = evt.target.naturalHeight;
      const status = evt.target.complete;
      const isLoaded = (width !== 0 && height !== 0 && status === true) ? true : false;
      this.showExpands(camId, isLoaded);
      this.ShowOrhideSpinners(camId, isLoaded);
      this.loadDetailStreamInfo(camId);
    }
  }

  stopStream() {
    this.streams.forEach(stream => {
      stream.nativeElement.classList.add('hidden');
      stream.nativeElement.src = null;
    })
    this.hideExpands();
  }

  startStream() {
    this.streams.forEach((stream, index) => {
      const camId = stream.nativeElement.getAttribute('camId');
      const camObject = this.datasource.monitors.find(cam => (cam.Monitor.Id === camId));
      const hideSpinner = camObject.Monitor_Status.Status === StreamStatus.Connected ? false : true;
      this.ShowOrhideSpinners(camId, hideSpinner);
      const streamUrl = this.getStream(camId, index + 1, camObject.Monitor_Status.Status);
      stream.nativeElement.src = streamUrl;
      stream.nativeElement.classList.remove('hidden');
      this.showInfoDetail = true;
    })
  }

  setPreview(value: boolean, stream: string, camId: string) {
    this.showInfoDetail = false;
    this.detail = { enabled: value, stream: stream };
    const streamingProperties: IStreamProperties = {
      previewType: previewType.streamingDetail,
      streamUrl: this.detail.stream,
      camId: camId,
    } as IStreamProperties;
    this.configurations.setStreamingProperties(streamingProperties);
    this.configurations.setPreviewStatus(true);
    this.loadPreview();
  }

  loadPreview(): void {
    let dialogRef: MatDialogRef<StreamPreview>;
    dialogRef = this.dialog.open(StreamPreview, { panelClass: 'custom-dialog-class' });
    this.dialog$ = dialogRef.afterClosed().subscribe(() => {
      this.configurations.setStreamingProperties({} as IStreamProperties);
      this.configurations.setPreviewStatus(false);
    });
  }

  previewStatus(previewStatus: boolean) {
    if (previewStatus === true) { if (this.streams && this.streams.length > 0) this.stopStream(); }
    else if (previewStatus === false) { if (this.streams && this.streams.length > 0) this.startStream(); }
  }

  getPreviewInfo(camId: string) {
    return this.zmService.getPreviewInfo(this.configurationsList.camDiapason, camId, previewType.streaming);
  }

}