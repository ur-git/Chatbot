import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Storage {

  constructor() { }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

}
