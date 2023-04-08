import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { TaskDragService } from './task-drag.service';

@Directive({
  selector: '[taskDroppable]',
})
export class TaskDroppableDirective implements OnInit, OnDestroy {
  private onDragEnter: any;
  private onDragLeave: any;
  private onDragOver: any;
  private onDrop: any;

  public options: DroppableOptions = {
    zone: 'appZone',
  };

  @Input()
  set appDroppable(options: DroppableOptions) {
    if (options) {
      this.options = options;
    }
  }

  @Output() public droppableComplete: EventEmitter<DroppableEventObject> =
    new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private _dragService: TaskDragService,
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, 'task-droppable');
  }

  ngOnInit(): void {
    // Add available zone
    // This exposes the zone to the service so a draggable element can update it
    this._dragService.addAvailableZone(this.options.zone, {
      begin: () => {
        this.renderer.addClass(
          this.elementRef.nativeElement,
          'js-task-droppable--target',
        );
      },
      end: () => {
        this.renderer.removeClass(
          this.elementRef.nativeElement,
          'js-task-droppable--target',
        );
      },
    });
    this.addOnDragEvents();
  }

  ngOnDestroy() {
    // Remove zone
    this._dragService.removeAvailableZone(this.options.zone);

    // Remove events
    this.onDragEnter();
    this.onDragLeave();
    this.onDragOver();
    this.onDrop();
  }

  private addOnDragEvents(): void {
    // Drag Enter
    this.onDragEnter = this.renderer.listen(
      this.elementRef.nativeElement,
      'dragenter',
      (event: DragEvent): void => {
        this.handleDragEnter(event);
      },
    );
    this.onDragLeave = this.renderer.listen(
      this.elementRef.nativeElement,
      'dragleave',
      (event: DragEvent): void => {
        this.handleDragLeave(event);
      },
    );
    // Drag Over
    this.onDragOver = this.renderer.listen(
      this.elementRef.nativeElement,
      'dragover',
      (event: DragEvent): void => {
        this.handleDragOver(event);
      },
    );
    // Drag Drop
    this.onDrop = this.renderer.listen(
      this.elementRef.nativeElement,
      'drop',
      (event: DragEvent): void => {
        this.handleDrop(event);
      },
    );
  }

  private handleDragEnter(event: DragEvent): void {
    if (this._dragService.accepts(this.options.zone)) {
      // Prevent default to allow drop
      console.log('Handle Drag Enter');
      event.preventDefault();
      // Add styling
      this.renderer.addClass(event.target, 'js-app-droppable--zone');
    }
  }

  private handleDragLeave(event: DragEvent): void {
    if (this._dragService.accepts(this.options.zone)) {
      console.log('Handle Drag Leave');
      // Remove styling
      this.renderer.removeClass(event.target, 'js-app-droppable--zone');
    }
  }

  private handleDragOver(event: DragEvent): void {
    if (this._dragService.accepts(this.options.zone)) {
      // Prevent default to allow drop
      console.log('Handle DragOver');
      event.preventDefault();
    }
  }

  private handleDrop(event: DragEvent): void {
    // Remove styling
    this._dragService.removeHighLightedAvailableZones();
    this.renderer.removeClass(event.target, 'js-app-droppable--zone');
    // Emit successful event
    // if(event.dataTransfer)
    //   const data = JSON.parse(event.dataTransfer.getData('Text'));
    console.log('Handle Drop');
    // this.droppableComplete.emit({
    //   data: data,
    //   zone: this.options.data,
    // });
  }
}

export interface DroppableOptions {
  data?: any;
  zone: string;
}

// Droppable Event Object
export interface DroppableEventObject {
  data: any;
  zone: any;
}
