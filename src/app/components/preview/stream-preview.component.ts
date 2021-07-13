import { AfterViewInit, Component, ElementRef, Injectable, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
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

    constructor(private sharedService: SharedService) {
      this.streamUrl = this.sharedService.streamUrl;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    stopStreaming(): void {
      this.streaming.nativeElement.src = null;
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
      }
    }

  }