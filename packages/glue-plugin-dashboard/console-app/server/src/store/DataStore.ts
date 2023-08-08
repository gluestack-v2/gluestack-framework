import EventEmitter from 'events';
import { applyPatches, enablePatches, produceWithPatches } from 'immer';
enablePatches();
export default class DataStore extends EventEmitter {
  #patches = [] as any;
  #value = {};
  static instance: DataStore;

  static getInstance() {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  produce(draft: (draft: any) => void) {
    const originalObject = this.getValue();

    const [_nextObject, patches, _inversePatches] = produceWithPatches(
      originalObject,
      draft
    );
    this.push(patches);
  }
  push(patch: any) {
    this.#patches.push(...patch);
    //Emit Patch to the client
    this.produceValue(patch);
    this.emit('patches.pushed', patch);
  }

  hydrate(patches: any) {
    this.#patches = patches;
    this.produceValue(patches);
    this.emit('patches.pushed', patches);
  }
  produceValue(patches: any) {
    this.#value = applyPatches(this.#value, patches);
  }
  getValue() {
    return this.#value;
  }
  getPatches() {
    return this.#patches;
  }
}
