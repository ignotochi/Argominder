import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { configurationsActions, streamingEventMode, streamingSettings } from 'src/app/enums/enums';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { IConfigurationsList } from 'src/app/interfaces/IConfigurationsList';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { IStreamProperties } from 'src/app/interfaces/IStreamProperties';
import { convertDateToString, convertStringToDate, convertTimeStringToHHmm } from 'src/app/utils/helper';
import { DateAdapter } from '@angular/material/core';
import { BaseCoreUtilsComponent } from 'src/app/core/base-arg-component.component';
import { CoreMainServices } from 'src/app/core/core-main-services.service';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';


export interface DbConfgigObject {
  id: string,
  value: string
}

@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [CoreMainServices]
})

export class ConfigComponent extends BaseCoreUtilsComponent<IMonitors> implements OnInit, OnDestroy, AfterViewInit {
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

  constructor(public mainServices: CoreMainServices, private changeRef: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>) {
    super(mainServices);
    Object.keys(streamingEventMode).forEach(mode => { this.eventStreamMode.push({ name: mode, value: streamingEventMode[mode] }) });

    this.configurationList$ = this.mainServices.configurations.getDataChanges().pipe(
      filter(tt => tt.action === configurationsActions.CamDiapason || tt.action === configurationsActions.EventsFilter || !this.configurationsList))
      .subscribe(result => {
        if (result.payload.camDiapason.length > 0) {
          this.mapCamsNames(result.payload.camDiapason);
          this.selectedCam.id = result.payload.eventsFilter?.cam;
          this.selectedCam.name = this.camsList.find(x => x.id === result.payload.eventsFilter?.cam)?.name;
        }
        if (result.action === configurationsActions.EventsFilter && this.showDateRangeSpinner) {
          this.showDateRangeSpinner = false;
          this.changeRef.markForCheck();
        }
        this.configurationsList = result.payload;
        this.startDate = convertStringToDate(result.payload.eventsFilter.startDate);
        this.startTime = convertTimeStringToHHmm(result.payload.eventsFilter.startTime);
        this.endTime = convertTimeStringToHHmm(result.payload.eventsFilter.endTime);
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
    this.showDateRangeSpinner = true;
    const filters: IEventsFilter = {
      startDate: convertDateToString(this.startDate),
      endDate: convertDateToString(this.startDate),
      startTime: this.startTime,
      endTime: this.endTime,
      cam: this.selectedCam.id
    }
    setTimeout(() => {
      this.mainServices.configurations.setEventsFilters(filters);
    }, 1500);
  }

  resetFilters() {
    this.mainServices.commonInitializer.setDefaultTime();
    const currentDate = new Date();
    const resettedfilters: IEventsFilter = {
      startDate: convertDateToString(currentDate),
      endDate: convertDateToString(currentDate),
      startTime: (currentDate.getHours() - 1).toString() + ":" + currentDate.getMinutes().toString(),
      endTime: currentDate.getHours().toString() + ":" + currentDate.getMinutes().toString(),
      cam: null
    }
    this.mainServices.configurations.setEventsFilters(resettedfilters);
    this.startDate = currentDate;
    this.selectedCam = { name: null, id: null };
  }

  changeEventStreamingMode(eventStreamingMode: streamingEventMode) {
    this.mainServices.configurations.setStreamingProperties({ eventStreamingMode: eventStreamingMode } as IStreamProperties);
  }

  setLiveStreamingScale(value: number) {
    this.updateConfDB(streamingSettings.liveStreamingScale, value.toString());
  }

  setDetailStreamingScale(value: number) {
    this.updateConfDB(streamingSettings.detailStreamingScale, value.toString());
  }

  setLiveStreamingFps(value: number) {
    this.updateConfDB(streamingSettings.liveStreamingMaxFps, value.toString());
  }

  setDetailStreamingFps(value: number) {
    this.updateConfDB(streamingSettings.detailStreamingMaxfps, value.toString());
  }

}