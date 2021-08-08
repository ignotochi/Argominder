import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { streamingConf, streamingEventMode } from 'src/app/enums/enums';
import { IConfigStreaming } from 'src/app/interfaces/IConfStreaming';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { SharedService } from 'src/app/services/shared.service';
import { zmService } from 'src/app/services/zm.service';


@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ConfigComponent implements OnInit, AfterViewInit {
  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });
  public panelOpenState = false;
  public dateRange: IEventsFilter = {} as IEventsFilter;
  public showDateRangeSpinner: boolean = false;
  public startDateFilter: Date = new Date();
  public endtDateFIlter: Date = null;
  public camSelection = new FormControl();
  public camsList: { name: string, id: string }[] = [];
  public selectedCam: { name: string, id: string } = { name: null, id: null };
  public eventStreamMode: { name: string, value: streamingEventMode }[] = [];
  public selectedEventMode: streamingEventMode;

  public liveStreamingMaxScale = 100;
  public liveStreamingMinScale = 5;
  public selectedLiveStreamingScale: number;

  public detailStreamingMaxScale = 100;
  public detailStreamingMinScale = 5;
  public selectedDetailStreamingScale: number;

  public liveStreamingMaxFps = 10;
  public liveStreamingMinFps = 1;
  public selectedLiveStreamingFps: number;

  public detailStreamingMaxFps = 10;
  public detailStreamingMinFps = 1;
  public selectedDetailStreamingFps: number;

  public newStreamingParametrs: IConfigStreaming[] = [{}] as IConfigStreaming[];
  public streamingConfChanges = new BehaviorSubject(this.newStreamingParametrs);


  constructor(public sharedService: SharedService, public zmService: zmService, private changeRef: ChangeDetectorRef) {
    this.setDefaultTime();

    const streamModes = Object.keys(streamingEventMode);
    streamModes.forEach(mode => {
      this.eventStreamMode.push({ name: mode, value: streamingEventMode[mode] })
    })
    this.setDefaulEventStreamingConf(streamModes)
    this.selectedEventMode = this.sharedService.eventStreamingMode;
    this.selectedLiveStreamingScale = parseInt(this.zmService.conf.liveStreamingScale);
    this.selectedDetailStreamingScale = parseInt(this.zmService.conf.detailStreamingScale);
    this.selectedLiveStreamingFps = parseInt(this.zmService.conf.liveStreamingMaxFps);
    this.selectedDetailStreamingFps = parseInt(this.zmService.conf.detailStreamingMaxfps);
    this.ifNewStreamingConf();
  }

  setDefaulEventStreamingConf(streamModes: string[]) {
    const defaultEventStreamMode = this.zmService.conf.defaultEventStreamingMode;
    const defaultModeToEnum = streamingEventMode[streamModes.find(mode => (mode === defaultEventStreamMode))];
    this.sharedService.eventStreamingMode = defaultModeToEnum;
  }

  ngOnInit() {
    this.setEventsFilters(true);
    this.sharedService.getCamRegistry().subscribe(result => {
      result.forEach(ele => {
        if (ele.Name && ele.Id) {
          this.camsList.push({ name: ele.Name, id: ele.Id });
        }
      });
    })
  }

  ngAfterViewInit() {
  }

  getStreamingConf(): Observable<IConfigStreaming[]> {
    return this.streamingConfChanges;
  }

  applyNefStreamingConf(value: number, type: string) {
    const streamConf = Object.keys(streamingConf);
    streamConf.forEach(conf => {
      if (conf === type) {
        this.streamingConfChanges.next([{ value: value, type: streamingConf[type] }]);
      }
    })
  }

  ifNewStreamingConf() {
    this.getStreamingConf().subscribe(result => {
      result.map(data => {
        if (data.type === streamingConf.liveStreaming) {
          this.setLiveStreamingScale(data.value);
        };
        if (data.type === streamingConf.maxLiveFps) {
          this.setLiveStreamingFps(data.value);
        };
        if (data.type === streamingConf.detailStreaming) {
          this.setDetailStreamingScale(data.value);
        };
        if (data.type === streamingConf.maxDetailFps) {
          this.setDetailStreamingFps(data.value);
        };
      })
    })
  }

  setDefaultTime() {
    const timeNow = new Date();
    const defaulHour = timeNow.getHours();
    const defaultMinute = timeNow.getMinutes();
    this.dateRange.startTime = (defaulHour - 1).toString() + ':' + defaultMinute.toString();
    this.dateRange.endTime = (defaulHour).toString() + ':' + defaultMinute.toString();
  }

  converDateFormat(date: Date) {
    let d = date, month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  setEventsFilters(isOnLoad: boolean) {
    this.endtDateFIlter = this.startDateFilter;
    this.sharedService.eventsFilterSearch.next({
      startDate: this.converDateFormat(this.startDateFilter),
      endDate: this.converDateFormat(this.endtDateFIlter),
      startTime: this.dateRange.startTime,
      endTime: this.dateRange.endTime,
      cam: this.selectedCam.id,
    });

    if (!isOnLoad) {
      this.showDateRangeSpinner = true;
      this.sharedService.getEventFiltersConf().subscribe(result => {
        setTimeout(() => {
          if (result) {
            this.showDateRangeSpinner = false;
            this.changeRef.markForCheck();
          }
        }, 1500);
      })
    }
  }

  resetFilters() {
    this.setDefaultTime();
    const currentDate = new Date();
    this.sharedService.eventsFilterSearch.next({
      startDate: this.converDateFormat(currentDate),
      endDate: this.converDateFormat(currentDate),
      startTime: this.dateRange.startTime,
      endTime: this.dateRange.endTime,
      cam: null,
    });
    this.startDateFilter = currentDate;
    this.selectedCam = { name: null, id: null };
  }

  changeEventStreamingMode(mode: streamingEventMode) {
    this.sharedService.eventStreamingMode = mode;
  }

  relaodLiveStreaming() {
    this.sharedService.previewStatus.next(true);
    this.sharedService.previewStatus.next(false);
  }

  setLiveStreamingScale(value: number) {
    this.zmService.conf.liveStreamingScale = value.toString();
    this.relaodLiveStreaming();
  }

  setDetailStreamingScale(value: number) {
    this.zmService.conf.detailStreamingScale = value.toString();
    this.relaodLiveStreaming();
  }

  setLiveStreamingFps(value: number) {
    this.zmService.conf.liveStreamingMaxFps = value.toString();
    this.relaodLiveStreaming();
  }

  setDetailStreamingFps(value: number) {
    this.zmService.conf.detailStreamingMaxfps = value.toString();
    this.relaodLiveStreaming();
  }

}