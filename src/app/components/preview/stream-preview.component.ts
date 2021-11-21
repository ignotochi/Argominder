import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { streamingEventMode } from "src/app/enums/enums";
import { previewType } from "src/app/enums/preview-enum";
import { IStreamProperties } from "src/app/interfaces/IStreamProperties";
import { SharedService } from "src/app/services/shared.service";

@Component({
    selector: 'stream-preview',
    templateUrl: 'stream-preview.component.html',
    styleUrls: ['./stream-preview.component.scss'],
  })
  export class StreamPreview implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('streaming', { static: false }) streaming: ElementRef<HTMLImageElement>;
    @ViewChild('spinner', { read: ElementRef }) spinner: ElementRef<HTMLElement>;
    @ViewChild('detailInfoPreview', { read: ElementRef }) detailInfoPreview: ElementRef<HTMLElement>;

     private streamUrl: string;
     public showInVideoElement: boolean;

     private streamingProperties: IStreamProperties;
     private streamingProperties$: Subscription;

    constructor(private sharedService: SharedService) {
      this.streamingProperties$ = this.sharedService.getStreamingProperties().subscribe(result => { this.streamingProperties = result; });
      this.streamUrl = this.streamingProperties.streamUrl;
    }

    ngOnInit() {
      this.showInVideoElement = this.streamingProperties.previewType === previewType.eventDetail && this.streamingProperties.streamingMode === streamingEventMode.video ? true : false;
    }

    ngOnDestroy() {
      this.streamingProperties$.unsubscribe()
    }

    ngAfterViewInit() {
      this.sharedService.updatePreviewStatus(true);
      
    }

    stopStreaming(): void {
      if (this.streaming) this.streaming.nativeElement.src = null;
      this.sharedService.updatePreviewStatus(false);
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
      return this.sharedService.getPreviewInfo(this.streamingProperties.camId, this.streamingProperties.previewType);
    }

  }