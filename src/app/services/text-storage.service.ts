import {Injectable} from '@angular/core';

/**
 * Service to store a text, used to show JSON format of the invoice app data
 */
@Injectable({
  providedIn: 'root'
})
export class TextStorageService {

  textStored = '';

  constructor() {
  }

  store(text): void {
    this.textStored = text;
  }

  getStoredText(): string {
    return this.textStored;
  }
}
