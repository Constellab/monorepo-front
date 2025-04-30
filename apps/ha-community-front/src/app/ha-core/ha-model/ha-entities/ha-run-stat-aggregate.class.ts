export enum HaRunStatAggregateObjectType {
  AGENT = 'AGENT',
  AGENT_VERSION = 'AGENT_VERSION',
  TASK = 'TASK',
  PROTOCOL = 'PROTOCOL',
  BRICK = 'BRICK',
  USER = 'USER',
}

export class HaRunStatAggregate {
  id: string;

  objectId: string;

  objectType: HaRunStatAggregateObjectType;

  executionCount: number;

  successRate: number;

  averageElapseTime: number;
}
