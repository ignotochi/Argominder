import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';

  export abstract class BasePreviewDetail implements OnInit, AfterViewInit, OnDestroy {
  
    constructor() {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

    abstract loadPreview(preview: boolean): void;

    abstract startStream(): void;

    abstract stopStream(): void;

  }