import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskDragService {
  private zoneIDs: Array<string> = [];
  private availableZones: any = {};

  constructor() {}

  public startDrag(zoneIDs: Array<string>): void {
    console.log('drag start');
    this.zoneIDs = zoneIDs;
    this.highLightAvailableZones();
  }

  public accepts(zoneID: string): boolean {
    return this.zoneIDs.indexOf(zoneID) > -1;
  }

  private highLightAvailableZones(): void {
    // this.zoneIDs.forEach((zone: string) => {
    //   this.availableZones[zone].begin();
    // });
  }

  public removeAvailableZone(zoneID: string): void {
    delete this.availableZones[zoneID];
  }

  public addAvailableZone(zoneID: string, obj: { begin: any; end: any }): void {
    this.availableZones[zoneID] = obj;
  }

  public removeHighLightedAvailableZones(): void {
    console.log('Dragend');
    // this.zoneIDs.forEach((zone: string) => {
    //   this.availableZones[zone].end();
    // });
  }
}
