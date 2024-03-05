export type TdTypeObjectType = 'TASK' | 'RESOURCE' | 'PROTOCOL' | 'MODEL';

export type TdTypeObjectSubType = 'TASK' | 'RESOURCE' | 'PROTOCOL' | 'TRANSFORMER' | 'IMPORTER' | 'EXPORTER';

export type TdTypeObjectStatus = 'OK' | 'UNAVAILABLE';

export type TdTypeStyleIconType = 'MATERIAL_ICON' | 'COMMUNITY_ICON' | 'COMMUNITY_IMAGE';

export interface TdTypeStyle {
  icon: string;
  icon_type: TdTypeStyleIconType;
  background_color?: string;
  icon_color?: string;
}

export interface TdSimpleTypeEntity {
  human_name?: string;
  short_description?: string;
  style?: TdTypeStyle;
}

export interface TdTypeEntity {

  typingName: string;

  brickVersion?: string;

  humanName: string;

  shortDescription: string | undefined;

  doc: string;

  parentTypingName: string | undefined;

  parentHumanName: string | undefined;

  parentVersion: string | undefined;

  objectType: TdTypeObjectType;

  objectSubType: TdTypeObjectSubType;

  status: TdTypeObjectStatus | undefined;

  deprecatedSince: string | undefined;

  deprecatedMessage: string | undefined;

  style: TdTypeStyle | undefined;
}


export interface TdUniqueType {
  typingName: string;

  humanName: string;

  version: string;
}
