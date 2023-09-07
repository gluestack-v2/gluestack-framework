import { produce, applyPatches } from 'immer';
import { enablePatches } from 'immer';
enablePatches();

export default class GlobalServiceClass {
  private rootState = {};
  private globalPatches = [] as any;
  private currentObject;
  private io;
  constructor(initialRootState: any, initialGlobalPatches: any, io: any) {
    this.rootState = initialRootState;
    this.globalPatches = initialGlobalPatches;
    // Fork Root State
    this.currentObject = this.rootState;
    this.io = io;
    this.io.on('connection', (socket: any) => {
      socket.emit('handshake', this.globalPatches);
    });
  }

  getCurrentObject() {
    return this.currentObject;
  }
  getGlobalPatches() {
    return this.globalPatches;
  }
  setRootState(rootState: any) {
    produce(
      this.currentObject,
      rootState,
      // The third argument to produce is a callback to which the patches will be fed
      (patches) => {
        this.globalPatches.push(...patches);
        this.io.emit('receive_patch', patches);
        //Emit Patch to the client
        this.rootState = applyPatches(this.rootState, patches);
      }
    );

    //Apply the patches to the root state
  }
}
