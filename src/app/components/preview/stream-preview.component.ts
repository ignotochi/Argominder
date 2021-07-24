import { AfterViewInit, Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { previewType } from "src/app/enums/preview-enum";
import { SharedService } from "src/app/services/shared.service";

@Injectable()

@Component({
    selector: 'stream-preview',
    templateUrl: 'stream-preview.component.html',
    styleUrls: ['./stream-preview.component.scss'],
  })
  export class StreamPreview implements OnInit, AfterViewInit {
    @ViewChild('streaming', { static: false }) streaming: ElementRef<HTMLImageElement>;
    @ViewChild('spinner', { read: ElementRef }) spinner: ElementRef<HTMLElement>;
     streamUrl: string;
     previewActive: boolean;
     showInfoDetail: boolean =  false;

    constructor(private sharedService: SharedService) {
      this.streamUrl = this.sharedService.streamProperties.streamUrl;
      this.previewActive = this.sharedService.previewIsActive;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
      this.sharedService.previewStatus.next(true);
    }

    stopStreaming(): void {
      this.streaming.nativeElement.src = null;
      this.sharedService.previewStatus.next(false);
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
        this.showInfoDetail = true;
      }
    }

    getPreviewInfo() {
      return this.sharedService.getPreviewInfo(this.sharedService.streamProperties.camId, this.sharedService.streamProperties.previewType);
    }

  }