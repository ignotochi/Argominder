import {
  AfterContentInit,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, ContentChildren, ElementRef, Input, OnInit,
  QueryList, Renderer2, ViewChild, ViewChildren
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StreamStatus } from 'src/app/enums/stream-enum';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { ConfigService } from '../../services/zm.service';

@Component({
  selector: 'live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LiveStreamComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChildren('spinner', { read: ElementRef }) spinners: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('stream', { read: ElementRef }) stream: QueryList<ElementRef<HTMLImageElement>>;

  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });

  constructor(private pageService: ConfigService, private changeRef: ChangeDetectorRef) {
  }

  ngAfterContentInit() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getCamList();  
  }

  alignSpinners(camId: string, loadStatus: boolean) {
    const matchedEle = this.spinners.find(spinner => spinner.nativeElement.id.includes(camId));
    if (loadStatus === true) { matchedEle.nativeElement.classList.add('hidden'); }
  }

  getStream(cam: string, index: number) {
    return this.pageService.getZmStream(cam, this.localToken, index);  
  }

  getCamList() {
    this.pageService.zmCamsList(this.localToken).subscribe((result) => {
      this.datasource.monitors = result.monitors;
    }, (err: Error) => {
      console.log(err);
    });
  }

  getClassStream(status: string) {
    if (status === StreamStatus.NotRunning) {
      return StreamStatus.NotRunning;
    }
    if (status === StreamStatus.Running) {
      return StreamStatus.Running;
    }
  }

  viewStream(status: string) {
    return status === StreamStatus.Running;
  }

  onImageLoad(evt: any, camId: string) {
    if (evt && evt.target) {
      const width = evt.target.naturalWidth;
      const height = evt.target.naturalHeight;
      const status = evt.target.complete;
      const isLoaded = (width !== 0 && height !== 0 && status === true) ? true : false;
      this.alignSpinners(camId, isLoaded);
    }
  }

  stopStream() {
    this.stream.forEach(stream => {
      stream.nativeElement.classList.add('hidden');
      stream.nativeElement.src = null;
    })
  }

  startStream() {
    this.stream.forEach((stream, index) => {
      const camId = stream.nativeElement.getAttribute('camId');
      const streamUrl = this.getStream(camId, index + 1);
      stream.nativeElement.src = streamUrl;
      stream.nativeElement.classList.remove('hidden');
    })
  }

  resetStream() {
    this.stopStream();
    setTimeout(() => { this.startStream(); }, 200);
  }

}