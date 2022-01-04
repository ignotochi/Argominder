import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { filter } from "rxjs/operators";
import { configurationsActions, streamingEventMode } from "src/app/enums/enums";
import { previewType } from "src/app/enums/preview-enum";
import { ZmService } from '../../services/zm.service';
import { ChangeDetectorConfigurations } from "../detectors/configurations.service";
import { Subscription } from "rxjs";
import { IConfigurationsList } from "src/app/interfaces/IConfigurationsList";

@Component({
  selector: 'stream-preview',
  templateUrl: 'stream-preview.component.html',
  styleUrls: ['./stream-preview.component.scss'],
})
export class StreamPreview implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('streaming', { static: false }) streaming: ElementRef<HTMLImageElement>;
  @ViewChild('spinner', { read: ElementRef }) spinner: ElementRef<HTMLElement>;
  @ViewChild('detailInfoPreview', { read: ElementRef }) detailInfoPreview: ElementRef<HTMLElement>;

  public streamUrl: string;
  public showInVideoElement: boolean;
  private dataChange$: Subscription;
  public configurationsList: IConfigurationsList;

  constructor(private configurations: ChangeDetectorConfigurations, private zmService: ZmService) {
    this.dataChange$ = this.configurations.getDataChanges().pipe(
      filter(tt => (tt.action === configurationsActions.StreamingProperties || tt.action === configurationsActions.CamDiapason))).subscribe(result => {
        this.configurationsList = result.payload;
      });
    this.configurationsList = this.configurations.getDataChangesValues().payload;
  }

  ngOnInit() {
    this.streamUrl = this.configurationsList.streamingProperties.streamUrl;
    this.showInVideoElement = this.configurationsList.streamingProperties.previewType === previewType.eventDetail &&
      this.configurationsList.streamingProperties.eventStreamingMode === streamingEventMode.video ? true : false;
  }

  ngOnDestroy() {
    this.dataChange$.unsubscribe();
  }

  ngAfterViewInit() {
    this.configurations.setPreviewStatus(true);
  }

  stopStreaming(): void {
    if (this.streaming) this.streaming.nativeElement.src = null;
    this.configurations.setPreviewStatus(false);
  }

  hideSpinners(loadStatus: boolean) {
    if (loadStatus === true) { this.spinner.nativeElement.classList.add('hidden'); }
  }

  onImageLoad(evt: any) {
    if (evt && evt.target) {
      const width = evt.target.naturalWidth;
      const height = evt.target.naturalHeight;
      const status = evt.target.complete;
      const isLoaded = (width !== 0 && height !== 0 && status === true) ? true : false;
      this.hideSpinners(isLoaded);
      this.loadDetailStreamInfo();
    }
  }

  loadDetailStreamInfo() {
    this.detailInfoPreview.nativeElement.innerText = this.getPreviewInfo();
  }

  getPreviewInfo() {
    return this.zmService.getPreviewInfo(
      this.configurationsList.camDiapason,
      this.configurationsList.streamingProperties.camId,
      this.configurationsList.streamingProperties.previewType
    );
  }

}