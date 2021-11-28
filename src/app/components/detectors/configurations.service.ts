import { Injectable } from "@angular/core";
import { configurationsActions } from "src/app/enums/enums";
import { ICamRegistry } from "src/app/interfaces/ICamRegistry";
import { IConfigurationsList } from "src/app/interfaces/IConfigurationsList";
import { IConfigStreaming } from "src/app/interfaces/IConfStreaming";
import { IEventsFilter } from "src/app/interfaces/IEventsFilter";
import { IStreamProperties } from "src/app/interfaces/IStreamProperties";
import { DataStoreDetector } from "src/app/services/change-detector.service";

@Injectable()
export class ChangeDetectorConfigurations extends DataStoreDetector<IConfigurationsList, configurationsActions> {

    setAll(input: IConfigurationsList) {
        this.updateDataChanges({ action: configurationsActions.All, payload: input });
    }
    setPreviewStatus(previewStatus: boolean) {
        this.updateDataChanges({ action: configurationsActions.PreviewStatus, payload: { ...this.getClonedDataChange(), previewStatus: previewStatus } });
    }
    setCamDiapason(incCamDiapason: ICamRegistry) {
        this.updateDataChanges({ action: configurationsActions.CamDiapason, payload: { ...this.getClonedDataChange(), camDiapason: [...this.getClonedDataChange()?.camDiapason, incCamDiapason] } });
    }
    setEventsFilters(eventsFilter: IEventsFilter) {
        this.updateDataChanges({ action: configurationsActions.EventsFilter, payload: { ...this.getClonedDataChange(), eventsFilter: eventsFilter } });
    }
    setStreamingChanges(streamingConfChanges: IConfigStreaming[]) {
        this.updateDataChanges({ action: configurationsActions.StreamingConfChanges, payload: { ...this.getClonedDataChange(), streamingConfChanges: streamingConfChanges } });
    }
    setStreamingProperties(streamingProperties: IStreamProperties) {
        this.updateDataChanges({ action: configurationsActions.StreamingProperties, payload: { ...this.getClonedDataChange(), streamingProperties: streamingProperties } });
    }
}