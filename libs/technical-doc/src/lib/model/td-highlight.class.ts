import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);

export class TeHighlight {
  static getLanguage(lang: string): string {
    return hljs.getLanguage(lang) ? lang : 'python';
  }

  static highlight(code: string, lang: string): string {
    return hljs.highlight(code, {language: TeHighlight.getLanguage(lang)}).value;
  }
}
