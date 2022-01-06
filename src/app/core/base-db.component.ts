import { Component } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { DbConfgigObject } from '../components/config/config.component';
import { streamingSettings } from '../enums/enums';
import { ZmService } from '../services/zm.service';

@Component({
    template: ''
})

export abstract class BaseIndexedDbConfigurationComponent {
    public dbConf$: Subscription;
    private database: string = 'settings';
    public selectedLiveStreamingScale: number = null;
    public selectedDetailStreamingScale: number = null;
    public selectedLiveStreamingFps: number = null;
    public selectedDetailStreamingFps: number = null;
    public liveStreamingMaxScale = 100;
    public liveStreamingMinScale = 5;
    public detailStreamingMaxScale = 100;
    public detailStreamingMinScale = 5;
    public liveStreamingMaxFps = 10;
    public liveStreamingMinFps = 1;
    public detailStreamingMaxFps = 10;
    public detailStreamingMinFps = 1;

    constructor(public dbService: NgxIndexedDBService, public zmService: ZmService) {
        if (!window.indexedDB) { console.log("Il tuo browser non supporta indexedDB"); }
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.dbConf$?.unsubscribe();
    }

    loadIndexedDbSettings() {
        this.dbConf$ = this.dbService.getAll(this.database).subscribe((defaultSettingsDb: DbConfgigObject[]) => {
            if (defaultSettingsDb.length > 0) {
                this.setLoadedConf(defaultSettingsDb);
            }
            else {
                const defaultSettingsDb = [
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
                this.dbService.add(this.database, defaultSettingsDb).subscribe(() => { });
                this.setLoadedConf(defaultSettingsDb);
            }
        });
    }

    setLoadedConf(result: DbConfgigObject[]) {
        result.some(conf => {
            if (conf.id === streamingSettings.liveStreamingScale && this.selectedLiveStreamingScale === null) {
                this.selectedLiveStreamingScale = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.liveStreamingScale);
            }
            if (conf.id === streamingSettings.detailStreamingScale && this.selectedDetailStreamingScale === null) {
                this.selectedDetailStreamingScale = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.detailStreamingScale);
            }
            if (conf.id === streamingSettings.liveStreamingMaxFps && this.selectedLiveStreamingFps === null) {
                this.selectedLiveStreamingFps = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.liveStreamingMaxFps);
            }
            if (conf.id === streamingSettings.detailStreamingMaxfps && this.selectedDetailStreamingFps === null) {
                this.selectedDetailStreamingFps = conf.value ? parseInt(conf.value) : parseInt(this.zmService.conf.detailStreamingMaxfps);
            }
        });
    }

    updateConfDB(key: string, value: string) {
        this.dbService.update(this.database, { id: key, value: value }).subscribe(() => { });
    }

}