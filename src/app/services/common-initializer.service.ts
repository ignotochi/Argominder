import { Injectable } from '@angular/core';
import { ZmService } from 'src/app/services/zm.service';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { Subscription } from 'rxjs';
import { ChangeDetectorConfigurations } from '../components/detectors/configurations.service';
import { streamingEventMode } from '../enums/enums';
import { IStreamProperties } from '../interfaces/IStreamProperties';
import { IEventsFilter } from '../interfaces/IEventsFilter';
import { convertDateToString } from '../utils/helper';

@Injectable()
export class CommoneInitializer {
    private camInfo$: Subscription;
    private streamModes = Object.keys(streamingEventMode);
    public dateRange: IEventsFilter = {} as IEventsFilter;
    private startDateFilter: Date = new Date();
    private endtDateFIlter: Date = null;

    constructor(private zmService: ZmService, private configurations: ChangeDetectorConfigurations) {
    }

    public getCamList(token: string) {
        this.camInfo$ = this.zmService.getCamListInfo().subscribe((result) => {

            result.monitors.forEach(result => {
                const registry: ICamRegistry = {
                    Name: result.Monitor.Name,
                    Id: result.Monitor.Id,
                    DayEvents: result.Monitor.DayEvents,
                    MonthEvents: result.Monitor.MonthEvents,
                    TotalEvents: result.Monitor.TotalEvents,
                    Function: result.Monitor.Function,
                    MaxFPS: result.Monitor.MaxFPS,
                    Path: result.Monitor.Path,
                    Type: result.Monitor.Type,
                    Width: result.Monitor.Width,
                    Height: result.Monitor.Height,
                }
                this.configurations.setCamDiapason(registry);
            });
        }, (err: Error) => {
            console.log(err);
        });
    }

    public setDefaulEventStreamingConf() {
        const defaultEventStreamMode = this.zmService.conf.defaultEventStreamingMode;
        const defaultModeToEnum = streamingEventMode[this.streamModes.find(mode => (mode === defaultEventStreamMode))];
        this.configurations.setStreamingProperties({ eventStreamingMode: defaultModeToEnum } as IStreamProperties);
    }

    public setDefaultTime() {
        const timeNow = new Date();
        const defaulHour = timeNow.getHours();
        const defaultMinute = timeNow.getMinutes() < 10 ? '0' + timeNow.getMinutes() : timeNow.getMinutes();
        this.dateRange.startTime = (defaulHour - 1).toString() + ':' + defaultMinute.toString();
        this.dateRange.endTime = (defaulHour).toString() + ':' + defaultMinute.toString();
    }

    public setDefaultEventsFilters() {
        this.setDefaultTime();
        this.endtDateFIlter = this.startDateFilter;
        const filters: IEventsFilter = {
            startDate: convertDateToString(this.startDateFilter),
            endDate: convertDateToString(this.endtDateFIlter),
            startTime: this.dateRange.startTime,
            endTime: this.dateRange.endTime,
            cam: null
        }
        this.configurations.setEventsFilters(filters);
    }
}


