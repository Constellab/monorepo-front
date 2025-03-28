import { Expose } from 'class-transformer';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';

export class LiBrickData {
  @Expose({ name: 'brick_name' })
  brickName: string;

  @Expose({ name: 'fs_node_name' })
  fsNodeName: string;

  @Expose({ name: 'fs_node_size' })
  fsNodeSize: number;

  @Expose({ name: 'fs_node_path' })
  fsNodePath: string;

  @Expose({ name: 'fs_node_type' })
  fsNodeType: 'file' | 'folder';
}

export class LiBrickDataArrayObs extends FlArrayObs<LiBrickData> {
  protected equals(a: LiBrickData, b: LiBrickData): boolean {
    return a.fsNodePath === b.fsNodePath;
  }
}
