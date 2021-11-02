import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { streamingEventMode } from "src/app/enums/enums";
import { previewType } from "src/app/enums/preview-enum";
import { SharedService } from "src/app/services/shared.service";

@Component({
    selector: 'stream-preview',
    templateUrl: 'stream-preview.component.html',
    styleUrls: ['./stream-preview.component.scss'],
  })
  export class StreamPreview implements OnInit, AfterViewInit {
    @ViewChild('streaming', { static: false }) streaming: ElementRef<HTMLImageElement>;
    @ViewChild('spinner', { read: ElementRef }) spinner: ElementRef<HTMLElement>;
    @ViewChild('detailInfoPreview', { read: ElementRef }) detailInfoPreview: ElementRef<HTMLElement>;

     streamUrl: string;
     previewActive: boolean;
     showInVideoElement: boolean;

    constructor(private sharedService: SharedService) {
      this.streamUrl = this.sharedService.streamProperties.streamUrl;
      this.previewActive = this.sharedService.previewIsActive;
    }

    ngOnInit() {
      this.showInVideoElement = 
      this.sharedService.streamProperties.previewType === previewType.eventDetail && 
      this.sharedService.streamProperties.streamingMode === streamingEventMode.video ? true : false;
    }

    ngAfterViewInit() {
      this.sharedService.setPreviewStatus(true);
      
    }

    stopStreaming(): void {
      if (this.streaming) this.streaming.nativeElement.src = null;
      this.sharedService.setPreviewStatus(false);
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
      return this.sharedService.getPreviewInfo(this.sharedService.streamProperties.camId, this.sharedService.streamProperties.previewType);
    }

  }