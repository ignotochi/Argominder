export enum streamingEventMode {
    jpeg = 'jpeg',
    video = 'video'
}

export enum streamingConf {
    liveStreaming = 'liveStreaming',
    detailStreaming = 'detailStreaming',
    maxLiveFps = 'maxLiveFps',
    maxDetailFps = 'maxDetailFps',
}

export enum streamingSettings {
    liveStreamingScale = 'liveStreamingScale',
    detailStreamingScale = 'detailStreamingScale',
    liveStreamingMaxFps = 'liveStreamingMaxFps',
    detailStreamingMaxfps = 'detailStreamingMaxfps',
}

export enum zmUrl {
    percent = '%20',
    endtime = 'EndTime%20<=:',
    startTime = 'StartTime%20>=:',
    json = 'json',
    token = 'token',
    events = 'events/index/',
    monitorId = 'MonitorId',
    cgiBinPath = '/zm/cgi-bin/nph-zms',
    scale = 'scale',
    mode = 'mode', 
    frame = 'frame',
    event = 'replay=none&source=event&event',
    index = '/zm/index.php',
    view = 'view=view_video&eid',
    monitor = 'monitor',
    monitors = 'monitors',
    buffer = 'buffer',
    maxfps = 'maxfps',
    user = 'user',
    pass = 'pass',
    login = 'login',
    host = 'host'
}

export enum separators {
    slash = '/',
    and = '&',
    question = '?',
    equal = '=',
    dot = '.',
    doublePoints = ':'
}

export enum configurationsActions {
    All = "All",
    PreviewStatus = "PreviewStatus",
    CamDiapason = "CamDiapason",
    EventsFilter = "EventsFilter",
    StreamingProperties = "StreamingProperties",
}

export enum authActions {
    All = "All",
    token = "token"
}

export interface Enum {
    [id: number]: string;
  }

export enum Menu {
    Home = '',
    Live = 'live',
    Settings = 'settings',
    Events = 'events'
}