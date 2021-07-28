import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  template: ''
})

  export abstract class BasePreviewDetail implements OnInit, AfterViewInit, OnDestroy {
  
    constructor() {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

    abstract loadPreview(target?: HTMLElement): void;

    abstract startStream(): void;

    abstract stopStream(): void;

  }