import { Injectable } from '@angular/core';
import { WzzStorage } from '../fw/utils/wzz-storage';
import { Subject } from 'rxjs';

const SEARCH_HISTORY_STORAGE_KEY = "search_history";

@Injectable({
    providedIn: 'root'
})
export class SearchExtension {

    hots!: string[];
    histories: string[] = [];

    change$ = new Subject<void>();

    constructor() {
    }

    async init(hots: string[]) {
        this.hots = hots;
        const histories = await WzzStorage.get(SEARCH_HISTORY_STORAGE_KEY);
        if (!histories) {
            this.histories = [];
        }
        else {
            this.histories = histories;
        }
    }

    async push(q: string) {
        const lowerQ = q.toLowerCase();
        const foundIndex = this.histories.findIndex(item => item.toLowerCase() == lowerQ);
        if (foundIndex !== 0) {
            if (foundIndex != -1) {
                this.histories.splice(foundIndex, 1);
            }
            this.histories.unshift(q);
            WzzStorage.set(SEARCH_HISTORY_STORAGE_KEY, this.histories);
            this.change$.next();
        }
    }

    async clearHistory() {
        this.histories.splice(0, this.histories.length);
        WzzStorage.set(SEARCH_HISTORY_STORAGE_KEY, []);
    }

}