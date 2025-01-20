import { Pipe, PipeTransform } from '@angular/core';
import { TeHighlight } from '@monorepo/technical-doc';

@Pipe({
    name: 'labOpenAiMessageContent',
    standalone: false
})
export class LabOpenAiMessageContentPipe implements PipeTransform {
  transform(value: string): string {
    if (value == null) return null;

    // replace all ```python with ``` and ```\n with ```
    value = value.replace(/```python/g, '```').replace(/```\n/g, '```');

    // apply hljs.highlight to all values between ```python and ```
    const regex = /```([\s\S]*?)```/g;
    return value.replace(regex, (match, p1) => {
      return '<code>' + TeHighlight.highlight(p1, 'python') + '</code>';
    });
  }
}
