import { TdParamSpecEntry, TdParamSpecParamSet, TdParamSpecTypeEnum } from '../../model/td-config-spec.class';

const FIELD_TOKEN_REGEX = /@(@?)([a-zA-Z_][a-zA-Z0-9_]*(?:\[\]\.[a-zA-Z_][a-zA-Z0-9_]*)?)/g;

export function tdBuildFieldSpecMap(specs: TdParamSpecEntry[]): Map<string, TdParamSpecEntry> {
  const map = new Map<string, TdParamSpecEntry>();
  for (const entry of specs) {
    map.set(entry.key, entry);
    if (entry.spec.type === TdParamSpecTypeEnum.PARAM_SET) {
      const paramSet = (entry.spec as TdParamSpecParamSet).additional_info.param_set;
      for (const [colKey, colSpec] of Object.entries(paramSet)) {
        const compositeKey = `${entry.key}[].${colKey}`;
        map.set(compositeKey, {
          key: compositeKey,
          spec: {
            ...colSpec,
            human_name: `${entry.spec.human_name || entry.key}[].${colSpec.human_name || colKey}`,
          },
        });
      }
    }
  }
  return map;
}

export interface TdExpressionTextSegment {
  type: 'text';
  value: string;
}

export interface TdExpressionFieldSegment {
  type: 'field';
  key: string;
  entry: TdParamSpecEntry | null;
  isOuter: boolean;
}

export type TdExpressionSegment = TdExpressionTextSegment | TdExpressionFieldSegment;

export class TdParsedExpression {
  private segments: TdExpressionSegment[];

  constructor(
    private expression: string,
    private specMap: Map<string, TdParamSpecEntry>,
    private outerSpecMap?: Map<string, TdParamSpecEntry>
  ) {
    this.segments = this.parse();
  }

  getSegments(): TdExpressionSegment[] {
    return this.segments;
  }

  buildHtml(): string {
    return this.segments
      .map((seg) => {
        if (seg.type === 'text') {
          return this.escapeHtml(seg.value);
        }
        const displayName = this.escapeHtml(seg.entry?.spec.human_name || seg.key);
        if (seg.isOuter) {
          return `<span class="td-field-token td-field-token-outer" data-key="${this.escapeHtml(seg.key)}" data-outer="true">@@${displayName}</span>`;
        }
        return `<span class="td-field-token" data-key="${this.escapeHtml(seg.key)}">@${displayName}</span>`;
      })
      .join('');
  }

  private parse(): TdExpressionSegment[] {
    const segments: TdExpressionSegment[] = [];
    let lastIndex = 0;

    FIELD_TOKEN_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = FIELD_TOKEN_REGEX.exec(this.expression)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', value: this.expression.substring(lastIndex, match.index) });
      }
      const isOuter = match[1] === '@';
      const key = match[2];
      const lookupMap = isOuter ? this.outerSpecMap : this.specMap;
      segments.push({ type: 'field', key, entry: lookupMap?.get(key) ?? null, isOuter });
      lastIndex = FIELD_TOKEN_REGEX.lastIndex;
    }

    if (lastIndex < this.expression.length) {
      segments.push({ type: 'text', value: this.expression.substring(lastIndex) });
    }

    return segments;
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
