import {
  ChangeDetectionStrategy, Component, ElementRef, Input, QueryList, ViewChildren
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasePreviewDetail } from 'src/app/core/base-preview.component';
import { StreamStatus } from 'src/app/enums/stream-enum';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { SharedService } from 'src/app/services/shared.service';
import { zmService } from '../../services/zm.service';
import { StreamPreview } from '../preview/stream-preview.component';

@Component({
  selector: 'live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LiveStreamComponent implements BasePreviewDetail {
  @ViewChildren('spinner', { read: ElementRef }) spinners: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('stream', { read: ElementRef }) streams: QueryList<ElementRef<HTMLImageElement>>;
  @ViewChildren('expand', { read: ElementRef }) expands: QueryList<ElementRef<HTMLElement>>;


  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });
  public preview: { enabled: boolean, stream: string } = { enabled: false, stream: '' };
  public showPreview: boolean = false;
  public showPreviewDetail: boolean;

  constructor(private zmService: zmService, public sharedService: SharedService, private dialog: MatDialog) {
    this.previewStatus();
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getCamList();
    this.showPreviewDetail = true;
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

  getStream(cam: string, index: number, status: string) {
    if (status !== StreamStatus.Connected) return 'assets/img/broken.jpg';
    if (status === StreamStatus.Connected) return this.zmService.getLiveStream(cam, this.localToken, index);
  }

  getStreamPreview(cam: string) {
    return this.zmService.getCamDetailStreamPreview(cam, this.localToken);
  }

  getCamList() {
    this.zmService.getCamListInfo(this.localToken).subscribe((result) => {
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
        this.sharedService.camsRegistry.push(registry)
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

    })
    this.showPreviewDetail = true;
  }

  setPreview(value: boolean, stream: string, camId: string) {
    this.preview = { enabled: value, stream: stream };
    this.sharedService.streamProperties.streamUrl = this.preview.stream;
    this.sharedService.streamProperties.camId = camId;
    this.sharedService.previewIsActive = true;
    this.showPreviewDetail = false;
    this.loadPreview();
  }

  loadPreview(): void {
    let dialogRef: MatDialogRef<StreamPreview>;
    dialogRef = this.dialog.open(StreamPreview);
    dialogRef.afterClosed().subscribe(() => {
      this.sharedService.streamProperties.streamUrl = null;
      this.sharedService.streamProperties.camId = null;
      this.sharedService.previewIsActive = false;
    });
  }

  previewStatus() {
    this.sharedService.getPreviewStatus().subscribe(result => {
      if (result === true) { if (this.streams && this.streams.length > 0) this.stopStream(); }
      else if (result === false) { if (this.streams && this.streams.length > 0) this.startStream(); }
    })
  }

  getPreviewInfo(camId: string) {
    return this.sharedService.getPreviewInfo(camId, false);
  }

}