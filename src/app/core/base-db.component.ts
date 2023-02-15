import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription, takeUntil } from 'rxjs';
import { DbConfgigObject } from '../components/configuration-component/zm-configurator.component';
import { streamingSettings } from '../enums/enums';
import { ZmService } from '../services/zm.service';
import { isArray } from '../utils/helper';

@Component({
    template: ''
})

export abstract class BaseIndexedDbConfigurationComponent {
    public dbConf$: Subscription;
    private database: string = 'settings';
    public selectedLiveStreamingScale: number;
    public selectedDetailStreamingScale: number;
    public selectedLiveStreamingFps: number;
    public selectedDetailStreamingFps: number;
    public liveStreamingMaxScale = 99;
    public liveStreamingMinScale = 5;
    public detailStreamingMaxScale = 99;
    public detailStreamingMinScale = 5;
    public liveStreamingMaxFps = 10;
    public liveStreamingMinFps = 1;
    public detailStreamingMaxFps = 10;
    public detailStreamingMinFps = 1;

    constructor(public dbService: NgxIndexedDBService, public zmService: ZmService) {
        if (!window.indexedDB) { console.log("Il tuo browser non supporta indexedDB"); }
    }

    loadIndexedDbSettings() {
        this.dbConf$ = this.dbService.getAll(this.database).subscribe((defaultSettingsDb: DbConfgigObject[]) => {
            if (defaultSettingsDb.length > 0) {
                this.mapLoadedConf(defaultSettingsDb);
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
                defaultSettingsDb.forEach(conf => this.updateConfDB(conf.id, conf.value));
                this.mapLoadedConf(defaultSettingsDb);
            }
        });
    }

    mapLoadedConf(result: DbConfgigObject[]) {
        result.forEach(conf => {
            if (conf.id === streamingSettings.liveStreamingScale)
                this.selectedLiveStreamingScale = parseInt(conf.value) ?? parseInt(this.zmService.conf.liveStreamingScale);

            if (conf.id === streamingSettings.detailStreamingScale)
                this.selectedDetailStreamingScale = parseInt(conf.value) ?? parseInt(this.zmService.conf.detailStreamingScale);

            if (conf.id === streamingSettings.liveStreamingMaxFps)
                this.selectedLiveStreamingFps = parseInt(conf.value) ?? parseInt(this.zmService.conf.liveStreamingMaxFps);

            if (conf.id === streamingSettings.detailStreamingMaxfps)
                this.selectedDetailStreamingFps = parseInt(conf.value) ?? parseInt(this.zmService.conf.detailStreamingMaxfps);
        });
    }

    updateConfDB(key: string, value: string) {
        this.dbService.update(this.database, { id: key, value: value }).subscribe(() => {
            console.log("Updated DB: " + key + " = " + value);
        });
    }

}