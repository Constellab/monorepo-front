export type FlObjectNodeType = 'null' | 'object' | 'array' | 'boolean' | 'number' | 'string';

export interface FlObjectNode {
  id: number;
  children?: FlObjectNode[];
  key: string;
  value?: any;
  type: FlObjectNodeType;
  preview?: string | null;
}

export interface FlObjectFlatNode {
  id: number;
  expandable: boolean;
  level: number;
  key: string;
  value?: any;
  type: FlObjectNodeType;
  preview?: string | null;
  className: string;
}
