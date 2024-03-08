export type TdTypeObjectType = 'TASK' | 'RESOURCE' | 'PROTOCOL';

export type TdTypeObjectSubType = 'TASK' | 'RESOURCE' | 'PROTOCOL' | 'TRANSFORMER' | 'IMPORTER' | 'EXPORTER';

export type TdTypeObjectStatus = 'OK' | 'UNAVAILABLE';

export type TdTypeStyleIconType = 'MATERIAL_ICON' | 'COMMUNITY_ICON' | 'COMMUNITY_IMAGE';

export interface TdTypeStyle {
  icon_technical_name: string;
  icon_type: TdTypeStyleIconType;
  background_color: string;
  icon_color: string;
}

export const tdTypeStyleDefault: TdTypeStyle = {
  icon_technical_name: 'process',
  icon_type: 'MATERIAL_ICON',
  background_color: '#af3e01',
  icon_color: '#ffffff'
};

export interface TdSimpleTypeEntity {
  human_name: string;
  short_description?: string;
}

export interface TdTypeRefDTO {
  typing_name: string;

  human_name: string;

  brick_version: string;

  style?: TdTypeStyle;
}

export interface TdTypeEntity {

  typingName: string;

  brickVersion?: string;

  humanName: string;

  shortDescription: string | undefined;

  doc: string;

  objectType: TdTypeObjectType;

  objectSubType: TdTypeObjectSubType;

  status: TdTypeObjectStatus | undefined;

  deprecatedSince: string | undefined;

  deprecatedMessage: string | undefined;

  style: TdTypeStyle;

  // TODO to check with val if we can convert to TdTypeRefDTO
  parentTypingName: string | undefined;

  parentHumanName: string | undefined;

  parentVersion: string | undefined;

  parentStyle: TdTypeStyle | undefined;
}
