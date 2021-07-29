import { streamingEventMode } from "../enums/enums";
import { previewType } from "../enums/preview-enum";

export interface IStreamProperties {
    streamUrl: string;
    camId: string;
    previewType: previewType;
    streamingMode: streamingEventMode;
}