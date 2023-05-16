import {Pipe, PipeTransform} from '@angular/core';
import hljs from 'highlight.js/lib/core';

@Pipe({
  name: 'labOpenAiMessageContent'
})
export class LabOpenAiMessageContentPipe implements PipeTransform {

  transform(value: string): string {
    if (value == null) return null;

    // replace all ```python with ``` and ```\n with ```
    value = value.replace(/```python/g, '```')
      .replace(/```\n/g, '```');

    // apply hljs.highlight to all values between ```python and ```
    const regex = /```([\s\S]*?)```/g;
    return value.replace(regex, (match, p1) => {
      return '<code>' + hljs.highlight(p1, {language: 'python'}).value + '</code>';
    });
  }

}
