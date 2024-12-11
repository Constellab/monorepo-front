export type TdTypeObjectType = 'TASK' | 'RESOURCE' | 'PROTOCOL' | 'OTHER_CLASS';

export type TdTypeObjectSubType = 'TASK' | 'RESOURCE' | 'PROTOCOL' | 'TRANSFORMER' | 'IMPORTER' | 'EXPORTER';

export type TdTypeObjectStatus = 'OK' | 'UNAVAILABLE';

export type TdTypeStyleIconType = 'MATERIAL_ICON' | 'COMMUNITY_ICON' | 'COMMUNITY_IMAGE';

export type TdTypeStyleBackgroundColor = 'primary' | 'accent' | 'warn' | string;
export type TdTypeStyleIconColor = 'primaryContrast' | 'accentContrast' | 'warnContrast' | string;

export interface TdTypeStyle {
  icon_technical_name: string;
  icon_type: TdTypeStyleIconType;
  background_color?: TdTypeStyleBackgroundColor;
  icon_color?: TdTypeStyleIconColor;
}

export const tdTypeStyleDefault: TdTypeStyle = {
  icon_technical_name: 'process',
  icon_type: 'MATERIAL_ICON',
  background_color: '#af3e01',
  icon_color: '#ffffff',
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

  short_description?: string;
}

export interface TdTypeTypingEntity extends TdTypeEntity {
  typingName: string;

  shortDescription: string | undefined;

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

export interface TdTypeEntity {
  brickVersion?: string;

  humanName: string;

  doc: string;

  objectType: TdTypeObjectType;

  typingName?: string;

  style?: TdTypeStyle;

  objectSubType?: TdTypeObjectSubType;

  deprecatedSince?: string | undefined;
}
