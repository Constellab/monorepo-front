import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../../ha-model/ha-entities/ha-run-stat-aggregate.class';
import { FlDateModule, FlTextIconModule, FlTranslateModule } from '@monorepo/front-core-lib';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ha-run-stat-aggregate-panel',
  standalone: true,
  imports: [CommonModule, FlTextIconModule, MatIconModule, MatTooltip, FlTranslateModule, FlDateModule],
  templateUrl: './ha-run-stat-aggregate-panel.component.html',
  styleUrl: './ha-run-stat-aggregate-panel.component.scss',
})
export class HaRunStatAggregatePanelComponent {
  runStatAggregate = input.required<HaRunStatAggregate>();
  justifyContent = input<'start' | 'end'>('end');
  showElapseTime = input<boolean>(true);

  successRate = computed(() => {
    // Times 100 and round to the second decimal
    return this.runStatAggregate().successRate * 100;
  });

  executionCountTooltip = computed(() => {
    if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.BRICK)
      return 'execution_count_tooltip_brick';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.USER)
      return 'execution_count_tooltip_user';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.AGENT)
      return 'execution_count_tooltip_agent';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.AGENT_VERSION)
      return 'execution_count_tooltip_agent_version';
    else return 'execution_count_tooltip';
  });

  successRateTooltip = computed(() => {
    if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.BRICK)
      return 'success_rate_tooltip_brick';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.USER)
      return 'success_rate_tooltip_user';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.AGENT)
      return 'success_rate_tooltip_agent';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.AGENT_VERSION)
      return 'success_rate_tooltip_agent_version';
    else return 'success_rate_tooltip';
  });

  averageElapseTimeTooltip = computed(() => {
    if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.BRICK)
      return 'average_elapse_time_tooltip_brick';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.USER)
      return 'average_elapse_time_tooltip_user';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.AGENT)
      return 'average_elapse_time_tooltip_agent';
    else if (this.runStatAggregate().objectType === HaRunStatAggregateObjectType.AGENT_VERSION)
      return 'average_elapse_time_tooltip_agent_version';
    else return 'average_elapse_time_tooltip';
  });
}
