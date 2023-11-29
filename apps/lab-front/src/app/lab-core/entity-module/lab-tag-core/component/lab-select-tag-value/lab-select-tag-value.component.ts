import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {
  FlBasicDatasourcePaginated,
  FlFormFieldDirective,
  FlTagValue,
  FlTranslatableText
} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {NgControl} from '@angular/forms';
import {LabTagService} from '../../../../entity-service/lab-tag.service';
import {map} from 'rxjs/operators';
import {ClPage} from '@monorepo/core-lib';
import {LabTag} from '../../../../model/entities/lab-tag.entity';

@Component({
  selector: 'lab-select-tag-value',
  templateUrl: './lab-select-tag-value.component.html',
  styleUrls: ['./lab-select-tag-value.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectTagValueComponent}]
})
export class LabSelectTagValueComponent extends FlFormFieldDirective<FlTagValue>
  implements OnInit {

  @Input() key: string;

  @Input() placeholder: FlTranslatableText = {text: 'tag_value', translateText: true};

  @Output() tagChange: EventEmitter<FlTagValue> = new EventEmitter();

  selectedTag: FlTagValue | Observable<FlTagValue>;

  datasource: FlBasicDatasourcePaginated<FlTagValue>;

  constructor(@Optional() @Self() ngControl: NgControl,
              private tagService: LabTagService) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlBasicDatasourcePaginated<FlTagValue>(
      (page, size, name) =>
        this.tagService.searchValues(this.key, name, page, size).pipe(
          map(tags => ClPage.fromInterface(tags).map(tag => tag.value))
        ),
      20, false);
  }

  writeValue(obj: FlTagValue): void {
    if (obj instanceof LabTag) {
      this.selectedTag = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: FlTagValue): void {
    this.tagChange.next(value);
    this.selectedTag = value;
  }

  onDisableChange(): void {
  }

}
