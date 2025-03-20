export interface HaDifyKnowledgeBase {
  id: string;
  name: string;
}

export interface HaDifyOptions{
  separator: string;
  maxTokens: number;
  indexingTechnique: 'high_quality' | 'economy';
}
