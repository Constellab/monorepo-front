import { ClClassReference, ClConstructorFunction, ClCoreJsonConvert } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';

import { LiBaseEntity } from './li-entity.entity';

/**
 * Class for a tree of object by python type
 */
export class LiTypedTree<T> {
  @Expose({ name: 'type_part' })
  typePart: string;

  @Expose({ name: 'sub_trees' })
  @Type(() => LiTypedTree)
  subTrees?: LiTypedTree<T>[];

  /**
   * object if the tree is a leaf
   * instantiate with createTypedTree method
   */
  object?: T;

  hasChildren(): boolean {
    return this.subTrees?.length > 0;
  }

  isLeaf(): boolean {
    return this.object != null;
  }

  /**
   * return true if we can 'merge' this type with its child, because this tree only contain on child that
   * is not a leaf
   */
  isReducable(): boolean {
    return !this.isLeaf() && this.subTrees?.length === 1 && !this.subTrees[0].isLeaf();
  }

  /**
   * Recursive method to create a tree where the node that are reducable are merge
   * It reduces the hierarchy by merging node (folder) that are not useful
   */
  reduceHierarchy(): LiTypedTree<T> {
    const current: LiTypedTree<T> = new LiTypedTree<T>();
    current.typePart = this.typePart;
    current.subTrees = [];
    current.object = this.object;

    // if the node is reducable, we merge it with its child
    if (this.isReducable()) {
      const child = this.subTrees[0].reduceHierarchy();
      current.typePart += ' / ' + child.typePart; // merge names
      current.subTrees = child.subTrees; // get child sub trees
      current.object = child.object; // get child object
    } else if (this.hasChildren()) {
      // reduce the children
      for (const child of this.subTrees) {
        current.subTrees.push(child.reduceHierarchy());
      }
    }

    return current;
  }
}

/**
 * Function to instantiate the view model and instantiate the model under it
 * @param modelClassReference class reference of the model under the view model
 */
export function liCreateTypedTree<T extends LiBaseEntity>(
  modelClassReference: ClClassReference<T>
): ClConstructorFunction<LiTypedTree<T> | LiTypedTree<T>[]> {
  return (json: any): LiTypedTree<T> | LiTypedTree<T>[] => {
    // instantiate the view model or view models
    const typedTree: LiTypedTree<T> | LiTypedTree<T>[] = ClCoreJsonConvert.deserialize(
      json,
      LiTypedTree
    ) as any;

    // if this is an array
    if (typedTree instanceof Array) {
      labInstantiateTypedTreeObjectRecur(typedTree, modelClassReference);
    } else {
      labInstantiateTypedTreeObjectRecur([typedTree], modelClassReference);
    }
    return typedTree;
  };
}

/**
 * Instantiate object of the input tree if they exists and do the same for sub trees
 * @param typedTrees
 * @param modelClassReference
 */
function labInstantiateTypedTreeObjectRecur<T extends LiBaseEntity>(
  typedTrees: LiTypedTree<T>[],
  modelClassReference: ClClassReference<T>
): void {
  for (const tree of typedTrees) {
    if (tree.isLeaf()) {
      // instantiate tree object
      tree.object = ClCoreJsonConvert.deserializeObject(tree.object, modelClassReference);
    }

    if (tree.hasChildren()) {
      labInstantiateTypedTreeObjectRecur(tree.subTrees, modelClassReference);
    }
  }
}
