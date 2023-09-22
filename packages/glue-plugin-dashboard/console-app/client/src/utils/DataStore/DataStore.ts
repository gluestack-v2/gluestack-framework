import EventEmitter from 'events';
import { applyPatches, enablePatches, produceWithPatches } from 'immer';
enablePatches();
export default class DataStore extends EventEmitter {
  private patches = [] as any;
  private value = {};
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
    this.patches.push(...patch);
    //Emit Patch to the client
    this.produceValue(patch);
    this.emit('patches.pushed', patch);
  }

  hydrate(patches: any) {
    this.patches = patches;
    this.produceValue(patches);
    this.emit('patches.pushed', patches);
  }
  produceValue(patches: any) {
    console.log('PATCH applied --', patches);
    const newValue = applyPatches(this.value, patches);
    console.log('PATCH applied --', this.value == newValue);
    this.value = newValue;
  }
  getValue() {
    return this.value;
  }
  getPatches() {
    return this.patches;
  }
  emitEvent() {
    this.emit('run.command', 'main');
  }
}