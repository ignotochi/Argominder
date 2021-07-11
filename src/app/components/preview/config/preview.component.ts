import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ComponentFactoryResolver, ElementRef, Input, OnInit,
    ViewChild, ViewChildren
  } from '@angular/core';

  
  
  @Component({
    selector: 'preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
  })
  export class ConfigComponent implements OnInit, AfterViewInit {

    constructor() {
    }
  
    ngOnInit() {
    }
  
    ngAfterViewInit() {

    }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
  //     width: '250px',
  //     data: {name: this.name, animal: this.animal}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //   });
  // }
  

  }