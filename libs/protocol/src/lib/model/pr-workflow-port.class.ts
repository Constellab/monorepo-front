import {FlColorHelper} from '@monorepo/front-core-lib';
import {PrPort} from './pr-io.class';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {TdIOSpec} from '@monorepo/technical-doc';
import {computed, signal, Signal, WritableSignal} from '@angular/core';

export type PrWorkflowPortType = 'input' | 'output';

export class PrWorkflowPort {

  private static readonly INPUT_NAME_PREFIX: string = 'input_';
  private static readonly OUTPUT_NAME_PREFIX: string = 'output_';

  private object$: BehaviorSubject<PrPort>;
  private objectSignal: WritableSignal<PrPort>;


  constructor(public name: string,
              port: PrPort,
              public type: PrWorkflowPortType) {
    this.object$ = new BehaviorSubject(port);
    this.objectSignal = signal(port);
  }

  /////////////////////////////// OBJECT //////////////////////////////

  public get currentObject(): PrPort {
    return this.object$.value;
  }

  public getObject$(): Observable<PrPort> {
    return this.object$.asObservable();
  }

  public updateObject(object: PrPort): void {
    this.object$.next(object);
    this.objectSignal.set(object);
  }

  public get currentSpecs(): TdIOSpec {
    return this.currentObject.specs;
  }

  public getResourceId$(): Observable<string> {
    return this.object$.asObservable().pipe(
      map(port => port.resource_id)
    );
  }

  public get resourceId(): Signal<string>{
    return computed(() => this.objectSignal().resource_id)
  }

  get humanName(): string {
    return this.currentSpecs.human_name;
  }

  /**
   * get the input drawflow name based on port index
   * @param index
   */
  public static getInputDrawflowName(index: string | number): string {
    return this.INPUT_NAME_PREFIX + index.toString();
  }

  /**
   * get the output drawflow name based on port index
   * @param index
   */
  public static getOutputDrawflowName(index: string | number): string {
    return this.OUTPUT_NAME_PREFIX + index.toString();
  }

  /**
   * return true if this port is compatible with the input port
   * If both port have at least on common type
   * If one is null, it is compatible with anything
   */
  public isCompatible(port: PrWorkflowPort): boolean {
    // if (this.port.specs == null || port.port.specs == null) {
    //   return true;
    // }

    return true;
    // for (const type of port.types) {
    //   if (this.types.includes(type)) {
    //     return true;
    //   }
    // }
    // return false;
  }

  /**
   * return the port color base on first type
   */
  public getDefaultColor(): string {
    if (this.currentSpecs == null || this.currentSpecs.resource_types.length === 0) {
      return '#ffffff';
    } else {
      if (this.currentSpecs.resource_types[0].typing_name == null || this.currentSpecs.resource_types[0].typing_name.length === 0) {
        return '#ffffff';
      } else {
        return FlColorHelper.stringToRGBColor(this.currentSpecs.resource_types[0].typing_name);
      }
    }
  }

  public getResourceTypingNames(): string[] {
    return this.currentSpecs.resource_types.map(spec => spec.typing_name);
  }

  public destroy(): void {
    this.object$.complete();
  }
}
