import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { configurationsActions, streamingEventMode, streamingSettings } from 'src/app/enums/enums';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { ZmService } from 'src/app/services/zm.service';
import { ChangeDetectorConfigurations } from '../detectors/configurations.service';
import { CommoneInitializer } from 'src/app/services/common-initializer.service';
import { convertDateToString, convertStringToDate } from 'src/app/utils/helper';
import { DateAdapter } from '@angular/material/core';
import { BaseArgComponent } from 'src/app/core/base-arg-component.component';
import { ChangeDetectorJwt } from '../detectors/jwt.service';


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

export class ConfigComponent extends BaseArgComponent<IMonitors> implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  public panelOpenState = false;
  public showDateRangeSpinner: boolean = false;
  public startDate: Date = new Date();
  public startTime: string;
  public endTime: string;
  public camSelection = new FormControl();
  public camsList: { name: string, id: string }[] = [];
  public selectedCam: { name: string, id: string } = { name: null, id: null };
  public eventStreamMode: { name: string, value: streamingEventMode }[] = [];
  public languages: { name: string, value: string }[] = [{ name: "Italiano", value: "it-IT" }, { name: "English", value: "en-EN" }];
  private configurationList$: Subscription;
  public configurationsList: IConfigurationsList = null;

  constructor(public dbService: NgxIndexedDBService, private configurations: ChangeDetectorConfigurations, public zmService: ZmService, 
    private changeRef: ChangeDetectorRef, private commonInitializer: CommoneInitializer, private dateAdapter: DateAdapter<Date>, public auth: ChangeDetectorJwt) {
    super(dbService, auth, zmService);
    Object.keys(streamingEventMode).forEach(mode => { this.eventStreamMode.push({ name: mode, value: streamingEventMode[mode] }) });

    this.configurationList$ = this.configurations.getDataChanges().pipe(
      filter(tt => tt.action === configurationsActions.CamDiapason || tt.action === configurationsActions.EventsFilter || !this.configurationsList))
      .subscribe(result => {
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

    this.dateAdapter.setLocale(this.zmService.conf.language);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.configurationList$?.unsubscribe();
    this.dbConf$?.unsubscribe();
  }

  ngAfterViewInit() {
  }

  mapCamsNames(camDiapason: ICamRegistry[]) {
    camDiapason.forEach(ele => { if (ele.Name && ele.Id) this.camsList.push({ name: ele.Name, id: ele.Id });});
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
    this.configurations.setStreamingStatus(true);
    this.configurations.setStreamingStatus(false);
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

}