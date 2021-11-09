import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
}
