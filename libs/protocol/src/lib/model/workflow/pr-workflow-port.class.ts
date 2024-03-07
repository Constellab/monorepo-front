import {FlColorHelper} from '@monorepo/front-core-lib';
import {PrPort} from '../pr-io.class';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {TdIOSpec} from '@monorepo/technical-doc';

export type PrWorkflowPortType = 'input' | 'output';

export class PrWorkflowPort {

  private static readonly INPUT_NAME_PREFIX: string = 'input_';
  private static readonly OUTPUT_NAME_PREFIX: string = 'output_';

  private object$: BehaviorSubject<PrPort>;


  constructor(public name: string,
              port: PrPort,
              public type: PrWorkflowPortType) {
    this.object$ = new BehaviorSubject(port);
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
  }

  public get currentSpecs(): TdIOSpec {
    return this.currentObject.specs;
  }

  public getResourceId$(): Observable<string> {
    return this.object$.asObservable().pipe(
      map(port => port.resource_id)
    );
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

  public getDefaultColor$(): Observable<string> {
    return this.getObject$().pipe(
      map(port => {
        if (port.specs == null || port.specs.resource_types.length === 0) {
          return '#ffffff';
        }

        if(port.specs.resource_types[0].style?.background_color){
          return port.specs.resource_types[0].style.background_color;
        }

        if (port.specs.resource_types[0].typing_name == null || port.specs.resource_types[0].typing_name.length === 0) {
          return '#ffffff';
        } else {
          return FlColorHelper.stringToRGBColor(port.specs.resource_types[0].typing_name);
        }

      })
    );
  }

  public getResourceTypingNames(): string[] {
    return this.currentSpecs.resource_types.map(spec => spec.typing_name);
  }

  public destroy(): void {
    this.object$.complete();
  }
}
