import { TdParamSpecEntry } from '../../model/td-config-spec.class';

const FIELD_TOKEN_REGEX = /@([a-zA-Z_][a-zA-Z0-9_]*)/g;

export interface TdExpressionTextSegment {
  type: 'text';
  value: string;
}

export interface TdExpressionFieldSegment {
  type: 'field';
  key: string;
  entry: TdParamSpecEntry | null;
}

export type TdExpressionSegment = TdExpressionTextSegment | TdExpressionFieldSegment;

export class TdParsedExpression {
  private segments: TdExpressionSegment[];

  constructor(
    private expression: string,
    private specMap: Map<string, TdParamSpecEntry>
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
      const key = match[1];
      segments.push({ type: 'field', key, entry: this.specMap.get(key) ?? null });
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
