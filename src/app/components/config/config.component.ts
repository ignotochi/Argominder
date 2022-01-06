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
import { ZmService } from 'src/app/services/zm.service';
import { ChangeDetectorConfigurations } from '../detectors/configurations.service';
import { CommoneInitializer } from 'src/app/services/common-initializer.service';
import { convertDateToString, convertStringToDate } from 'src/app/utils/helper';
import { DateAdapter } from '@angular/material/core';


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
  public datasource: IMonitors = (<IMonitors>{ monitors: [] });
  public panelOpenState = false;
  public showDateRangeSpinner: boolean = false;
  public startDate: Date = new Date();
  public startTime: string;
  public endTime: string;
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
  public configurationsList: IConfigurationsList = null;

  constructor(private configurations: ChangeDetectorConfigurations, public zmService: ZmService, private changeRef: ChangeDetectorRef,
    private dbService: NgxIndexedDBService, public commonInitializer: CommoneInitializer, private dateAdapter: DateAdapter<Date>) {

    this.configurationList$ = this.configurations.getDataChanges().pipe(
      filter(
        tt => tt.action === configurationsActions.CamDiapason ||
          tt.action === configurationsActions.StreamingConfChanges ||
          tt.action === configurationsActions.EventsFilter || !this.configurationsList))
      .subscribe(result => {
        if (result.action === configurationsActions.StreamingConfChanges) {
          this.detectNewStreamingConf(result.payload.streamingConfChanges);
        };
        if (result.payload.camDiapason.length > 0) {
          this.mapCamsNames(result.payload.camDiapason);
          this.selectedCam.id = result.payload.eventsFilter?.cam;
          this.selectedCam.name = this.camsList.find(x => x.id === result.payload.eventsFilter?.cam)?.name;
        }
        this.configurationsList = result.payload;
        this.startDate = convertStringToDate(result.payload.eventsFilter.startDate);
        this.startTime = result.payload.eventsFilter.startTime;
        this.endTime = result.payload.eventsFilter.endTime;;
      });
    this.loadIndexedDbSettings();
    this.dateAdapter.setLocale(this.zmService.conf.language);
  }

  ngOnInit() {
    if (!window.indexedDB) { console.log("Il tuo browser non supporta indexedDB"); }
  }

  ngOnDestroy() {
    this.configurationList$?.unsubscribe();
    this.dbConf$?.unsubscribe();
    this.dbService$?.unsubscribe();
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

  loadIndexedDbSettings() {
    return this.dbService.getAll(this.database).pipe(
      switchMap((settingsDbObjects: DbConfgigObject[]) => {
        if (settingsDbObjects.length > 0) {
          const defaultSettingsDb: DbConfgigObject[] = settingsDbObjects.map(x => x);
          this.isLoadedFromDb = defaultSettingsDb.length > 0;
          this.mapSettings(defaultSettingsDb)
          return defaultSettingsDb;
        }
        else {
          const defaultSettingsDb: DbConfgigObject[] = [
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
            }];
          this.mapSettings(defaultSettingsDb)
          return this.dbService.bulkAdd(this.database, defaultSettingsDb);
        }
      })
    );
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

  setEventsFilters() {
    const filters: IEventsFilter = {
      startDate: convertDateToString(this.startDate),
      endDate: convertDateToString(this.startDate),
      startTime: this.startTime,
      endTime: this.endTime,
      cam: this.selectedCam.id
    }
    this.configurations.setEventsFilters(filters);
    this.showDateRangeSpinner = true;
    setTimeout(() => {
      this.showDateRangeSpinner = false;
      this.changeRef.markForCheck();
    }, 1500);
  }

  resetFilters() {
    this.commonInitializer.setDefaultTime();
    const currentDate = new Date();
    const resettedfilters: IEventsFilter = {
      startDate: convertDateToString(currentDate),
      endDate: convertDateToString(currentDate),
      startTime: this.startTime,
      endTime: this.endTime,
      cam: null
    }
    this.configurations.setEventsFilters(resettedfilters);
    this.startDate = currentDate;
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