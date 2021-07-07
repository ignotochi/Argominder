import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, ElementRef, Input, OnInit,
  ViewChild, ViewChildren
} from '@angular/core';
import { StreamStatus } from 'src/app/enums/stream-enum';
import { IMonitor } from 'src/app/interfaces/IMonitor';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { ConfigService } from '../../services/zm.service';


@Component({
  selector: 'live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LiveStreamComponent implements OnInit, AfterViewInit {
  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });

  constructor(private pageService: ConfigService, private changeRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getCamList();
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

  showStream(status: string) {
    return status === StreamStatus.Running;
  }


}