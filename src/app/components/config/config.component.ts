import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { configurationsActions, streamingConf, streamingEventMode, streamingSettings } from 'src/app/enums/enums';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IConfigStreaming } from 'src/app/interfaces/IConfStreaming';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { zmService } from 'src/app/services/zm.service';
import { ChangeDetectorConfigurations } from '../detectors/configurations.service';

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

export class ConfigComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });
  public panelOpenState = false;
  public dateRange: IEventsFilter = {} as IEventsFilter;
  public showDateRangeSpinner: boolean = false;
  public startDateFilter: Date = new Date();
  private endtDateFIlter: Date = null;
  public camSelection = new FormControl();
  public camsList: { name: string, id: string }[] = [];
  public selectedCam: { name: string, id: string } = { name: null, id: null };
  public eventStreamMode: { name: string, value: streamingEventMode }[] = [];
  private database: string = 'settings';
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
  public isLoadedFromDb: boolean;
  private configurationList$: Subscription;
  private dbConf$: Subscription;
  private dbService$: Subscription;
  public configurationsList: IConfigurationsList;


  constructor(private configurations: ChangeDetectorConfigurations, public zmService: zmService, private changeRef: ChangeDetectorRef, private dbService: NgxIndexedDBService) {
    this.setDefaultTime();
    const streamModes = Object.keys(streamingEventMode);
    streamModes.forEach(mode => {
      this.eventStreamMode.push({ name: mode, value: streamingEventMode[mode] })
    })
    this.setDefaulEventStreamingConf(streamModes)
    this.configurationList$ = this.configurations.getDataChanges().pipe(
      filter(
        tt => tt.action === configurationsActions.CamDiapason ||
        tt.action === configurationsActions.StreamingConfChanges ||
        tt.action === configurationsActions.EventsFilter)).subscribe(result => {
          if (result.action === configurationsActions.CamDiapason) this.mapCamsNames(result.payload.camDiapason);
          if (result.action === configurationsActions.StreamingConfChanges) this.detectNewStreamingConf(result.payload.streamingConfChanges);
          this.configurationsList = result.payload;
        });
    this.popolateSettingsDB();
  }

  setDefaulEventStreamingConf(streamModes: string[]) {
    const defaultEventStreamMode = this.zmService.conf.defaultEventStreamingMode;
    const defaultModeToEnum = streamingEventMode[streamModes.find(mode => (mode === defaultEventStreamMode))];
    this.configurations.setStreamingProperties({ eventStreamingMode: defaultModeToEnum } as IStreamProperties);
  }

  ngOnInit() {
    this.setEventsFilters(true);
    if (!window.indexedDB) { console.log("Il tuo browser non supporta indexedDB"); }
  }

  ngOnDestroy() {
    this.configurationList$.unsubscribe();
    this.dbConf$.unsubscribe();
    this.dbService$.unsubscribe();
  }

  ngAfterViewInit() {
  }

  mapCamsNames(camDiapason: ICamRegistry[]) {
    camDiapason.forEach(ele => {
      if (ele.Name && ele.Id) {
        this.camsList.push({ name: ele.Name, id: ele.Id });
      }
    });
  }

  popolateSettingsDB() {
    let defaultSettingsDb: DbConfgigObject[] = [];

    return this.dbConf$ = this.dbService.getAll(this.database).pipe(
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
    this.dbService$ = this.dbService.clear(this.database).subscribe(() => {
      this.isLoadedFromDb = false;
      this.changeRef.markForCheck();
    });
  }


  applyNewStreamingConf(value: number, type: string) {
    this.configurations.setStreamingChanges([{ value: value, type: type }] as IConfigStreaming[]);
  }

  detectNewStreamingConf(streamingConfChanges: IConfigStreaming[]) {
    streamingConfChanges.map(data => {
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
    if(isOnLoad) {
      this.endtDateFIlter = this.startDateFilter;
      const filters: IEventsFilter = {
        startDate: this.converDateFormat(this.startDateFilter),
        endDate: this.converDateFormat(this.endtDateFIlter),
        startTime: this.dateRange.startTime,
        endTime: this.dateRange.endTime,
        cam: this.selectedCam.id
      }
      this.configurations.setEventsFilters(filters);
    }
    if (!isOnLoad) {
      this.showDateRangeSpinner = true;
      setTimeout(() => {
          this.showDateRangeSpinner = false;
          this.changeRef.markForCheck();  
      }, 1500);
    }
  }

  resetFilters() {
    this.setDefaultTime();
    const currentDate = new Date();
    const resettedfilters: IEventsFilter = {
      startDate: this.converDateFormat(currentDate),
      endDate: this.converDateFormat(currentDate),
      startTime: this.dateRange.startTime,
      endTime: this.dateRange.endTime,
      cam: null
    }
    this.configurations.setEventsFilters(resettedfilters);
    this.startDateFilter = currentDate;
    this.selectedCam = { name: null, id: null };
  }

  changeEventStreamingMode(eventStreamingMode: streamingEventMode) {
    this.configurations.setStreamingProperties({ eventStreamingMode: eventStreamingMode } as IStreamProperties);
  }

  relaodLiveStreaming() {
    this.configurations.setPreviewStatus(true);
    this.configurations.setPreviewStatus(false);
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