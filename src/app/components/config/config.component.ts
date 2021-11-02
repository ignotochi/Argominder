import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { streamingConf, streamingEventMode, streamingSettings } from 'src/app/enums/enums';
import { IConfigStreaming } from 'src/app/interfaces/IConfStreaming';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { SharedService } from 'src/app/services/shared.service';
import { zmService } from 'src/app/services/zm.service';

export interface DbConfgigObject {
  id: string,
  value: string
}

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
  public database: string = 'settings';

  public liveStreamingMaxScale = 100;
  public liveStreamingMinScale = 5;
  public selectedLiveStreamingScale: number = null;

  public detailStreamingMaxScale = 100;
  public detailStreamingMinScale = 5;
  public selectedDetailStreamingScale: number = null;

  public liveStreamingMaxFps = 10;
  public liveStreamingMinFps = 1;
  public selectedLiveStreamingFps: number = null;

  public detailStreamingMaxFps = 10;
  public detailStreamingMinFps = 1;
  public selectedDetailStreamingFps: number = null;

  public newStreamingParametrs: IConfigStreaming[] = [{}] as IConfigStreaming[];
  public streamingConfChanges = new BehaviorSubject(this.newStreamingParametrs);

  public isLoadedFromDb: boolean;


  constructor(public sharedService: SharedService, public zmService: zmService, private changeRef: ChangeDetectorRef, private dbService: NgxIndexedDBService) {
    this.setDefaultTime();
    const streamModes = Object.keys(streamingEventMode);
    streamModes.forEach(mode => {
      this.eventStreamMode.push({ name: mode, value: streamingEventMode[mode] })
    })
    this.setDefaulEventStreamingConf(streamModes)
    this.selectedEventMode = this.sharedService.eventStreamingMode;
    this.popolateSettingsDB();
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
    if (!window.indexedDB) { console.log("Il tuo browser non supporta indexedDB"); }
  }

  ngAfterViewInit() {
  }

  popolateSettingsDB() {
    let defaultSettingsDb: DbConfgigObject[] = [];

    return this.dbService.getAll(this.database).pipe(
      switchMap((settingsDbObjects: DbConfgigObject[]) => {
        if (settingsDbObjects.length > 0) {
          defaultSettingsDb = settingsDbObjects.map(x => x);
          this.isLoadedFromDb = defaultSettingsDb.length > 0;
          return defaultSettingsDb;
        }
        else {
          this.isLoadedFromDb = false;
          defaultSettingsDb.push(
            {
              id: streamingSettings.liveStreamingScale,
              value: this.zmService.conf.liveStreamingScale
            },
            {
              id: streamingSettings.detailStreamingScale,
              value: this.zmService.conf.detailStreamingScale
            },
            {
              id: streamingSettings.liveStreamingMaxFps,
              value: this.zmService.conf.liveStreamingMaxFps
            },
            {
              id: streamingSettings.detailStreamingMaxfps,
              value: this.zmService.conf.detailStreamingMaxfps
            },
          )
          return this.dbService.bulkAdd(this.database, defaultSettingsDb);
        }
      })
    ).subscribe(() => (
      this.mapSettings(defaultSettingsDb)
    ))
  }

  mapSettings(result: DbConfgigObject[]) {
    result.some(conf => {
      if (conf.id === streamingSettings.liveStreamingScale && this.selectedLiveStreamingScale === null) {
        this.selectedLiveStreamingScale = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.liveStreamingScale);
        this.applyNewStreamingConf(parseInt(conf.value), streamingConf.liveStreaming);
      }

      if (conf.id === streamingSettings.detailStreamingScale && this.selectedDetailStreamingScale === null) {
        this.selectedDetailStreamingScale = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.detailStreamingScale);
        this.applyNewStreamingConf(parseInt(conf.value), streamingConf.detailStreaming);
      }

      if (conf.id === streamingSettings.liveStreamingMaxFps && this.selectedLiveStreamingFps === null) {
        this.selectedLiveStreamingFps = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.liveStreamingMaxFps);
        this.applyNewStreamingConf(parseInt(conf.value), streamingConf.maxLiveFps);
      }

      if (conf.id === streamingSettings.detailStreamingMaxfps && this.selectedDetailStreamingFps === null) {
        this.selectedDetailStreamingFps = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.detailStreamingMaxfps);
        this.applyNewStreamingConf(parseInt(conf.value), streamingConf.maxDetailFps);
      }
    });
  }

  restetDbConf() {
    this.dbService.clear(this.database).subscribe(() => {
      this.isLoadedFromDb = false;
      this.changeRef.markForCheck();
    });
  }

  getStreamingConf(): Observable<IConfigStreaming[]> {
    return this.streamingConfChanges;
  }

  applyNewStreamingConf(value: number, type: string) {
    this.sharedService.applyNewStreamingConf(this.streamingConfChanges, value, type);
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
    const defaultMinute = timeNow.getMinutes() < 10 ? '0' + timeNow.getMinutes() : timeNow.getMinutes();
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
    this.sharedService.applyNewEventsFilters(
      this.converDateFormat(this.startDateFilter),
      this.converDateFormat(this.endtDateFIlter),
      this.dateRange.startTime, this.dateRange.endTime,
      this.selectedCam.id);
    
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
    this.sharedService.resetEventsFilters(
      this.converDateFormat(currentDate),
      this.converDateFormat(currentDate),
      this.dateRange.startTime, 
      this.dateRange.endTime,
      null);   
    this.startDateFilter = currentDate;
    this.selectedCam = { name: null, id: null };
  }

  changeEventStreamingMode(mode: streamingEventMode) {
    this.sharedService.eventStreamingMode = mode;
  }

  relaodLiveStreaming() {
    this.sharedService.relaodLiveStreaming();
  }

  setLiveStreamingScale(value: number) {
    this.zmService.conf.liveStreamingScale = value.toString();
    this.updateConfDB(streamingSettings.liveStreamingScale, value.toString());
    this.relaodLiveStreaming();
  }

  setDetailStreamingScale(value: number) {
    this.zmService.conf.detailStreamingScale = value.toString();
    this.updateConfDB(streamingSettings.detailStreamingScale, value.toString());
    this.relaodLiveStreaming();
  }

  setLiveStreamingFps(value: number) {
    this.zmService.conf.liveStreamingMaxFps = value.toString();
    this.updateConfDB(streamingSettings.liveStreamingMaxFps, value.toString());
    this.relaodLiveStreaming();
  }

  setDetailStreamingFps(value: number) {
    this.zmService.conf.detailStreamingMaxfps = value.toString();
    this.updateConfDB(streamingSettings.detailStreamingMaxfps, value.toString());
    this.relaodLiveStreaming();
  }

  updateConfDB(key: string, value: string) {
    this.dbService.update(this.database, { id: key, value: value });
  }

}