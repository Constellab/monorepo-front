import { Pipe, PipeTransform } from '@angular/core';
import { FlHighlight } from '@monorepo/front-core-lib/fl-markdown';

@Pipe({ name: 'labOpenAiMessageContent' })
export class LiOpenAiMessageContentPipe implements PipeTransform {
  transform(value: string): string {
    if (value == null) return null;

    // replace all ```python with ``` and ```\n with ```
    value = value.replace(/```python/g, '```').replace(/```\n/g, '```');

    // apply hljs.highlight to all values between ```python and ```
    const regex = /```([\s\S]*?)```/g;
    return value.replace(regex, (match, p1) => {
      return '<code>' + FlHighlight.highlight(p1, 'python') + '</code>';
    });
  }
}
