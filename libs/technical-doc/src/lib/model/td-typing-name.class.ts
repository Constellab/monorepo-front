import { TdTypeObjectType } from './td-type.class';

/**
 * Base class to find the unique name or brick name of a typing name
 */
export class TdTypingName {
  public static model = {
    //Typing name of the resource class
    resource: 'labTypingNameResource',
  };

  public static task = {
    input: {
      typingName: 'TASK.gws_core.InputTask',
      configName: 'resource_id',
    },
    output: {
      typingName: 'TASK.gws_core.OutputTask',
      resourceInput: 'resource',
    },
    tableImporter: 'TASK.gws_core.TableImporter',
    viewer: 'TASK.gws_core.Viewer',
    pyAgent: 'TASK.gws_core.PyAgent',
  };

  public static resource = {
    resource: 'RESOURCE.gws_core.Resource',
    file: 'RESOURCE.gws_core.File',
    folder: 'RESOURCE.gws_core.Folder',
    tableFile: 'RESOURCE.gws_core.TableFile',
  };

  public static importer = {
    tableImporter: 'TASK.gws_core.TableImporter',
    jsonImporter: 'TASK.gws_core.JSONImporter',
    textImporter: 'TASK.gws_core.TextImporter',
    decompressImporter: 'TASK.gws_core.FileDecompressTask',
  };

  typingName: string;

  type: TdTypeObjectType;
  brickName: string;
  uniqueName: string;

  constructor(typingName: string) {
    this.typingName = typingName;

    const split = typingName.split('.'); // 0: type, 1: brickName, 2: uniqueName;
    this.type = split[0] as TdTypeObjectType;
    this.brickName = split[1];
    this.uniqueName = split[2];
  }
}

export interface TdTaskSourceConfig {
  resource_id: string;
}

// configuration object for the Viewer
export interface TdTaskViewerConfig {
  resource_typing_name: string;
  view_config: {
    view_method_name: string;
    config_values: Record<string, any>;
  };
}
