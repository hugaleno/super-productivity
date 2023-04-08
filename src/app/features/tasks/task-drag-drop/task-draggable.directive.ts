import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { TaskDragService } from './task-drag.service';

@Directive({
  selector: '[taskDraggable]',
})
export class TaskDraggableDirective implements OnInit, OnDestroy {
  constructor(
    private _dragService: TaskDragService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.options = { zones: [], data: {} };
    this.renderer.setProperty(this.elementRef.nativeElement, 'draggable', true);
    this.renderer.setProperty(this.elementRef.nativeElement, 'isTask', 'true');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'isTask', 'true');
    //this.renderer.setStyle(this.elementRef.nativeElement, 'opacity', 0.5);
    //this.renderer.removeClass(this.elementRef.nativeElement, 'draggable');
  }

  private onDragStart: any;
  private onDragEnd: any;

  private options: DraggableOptions;
  private task: Task | undefined;

  // @Input()
  // set taskDraggable(options: DraggableOptions) {
  //   if (options) {
  //     this.options = options;
  //   }
  // }

  @Input()
  set taskDraggable(task: Task) {
    this.task = task;
  }
  ngOnInit(): void {
    this.registerDragEvents();
  }

  registerDragEvents(): void {
    this.onDragStart = this.renderer.listen(
      this.elementRef.nativeElement,
      'dragstart',
      (event: DragEvent): void => {
        this.renderer.addClass(this.elementRef.nativeElement, 'task-drag');
        this._dragService.startDrag(this.options.zones);
        event.dataTransfer?.setData('Text', JSON.stringify(this.task));
      },
    );

    this.onDragEnd = this.renderer.listen(
      this.elementRef.nativeElement,
      'dragend',
      (event: DragEvent): void => {
        this.renderer.removeClass(this.elementRef.nativeElement, 'task-drag');
        this._dragService.removeHighLightedAvailableZones();
      },
    );
  }
  ngOnDestroy(): void {
    this.onDragStart();
    this.onDragEnd();
  }
}

export interface DraggableOptions {
  zones: Array<string>;
  data?: any;
}
