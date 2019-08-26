import { Injectable } from '@angular/core';

export function InitConfig(config: AppConfig) {
    return () => config.load();
}
@Injectable()
export class AppConfig {

    private config: any = null;
    constructor() { }
    load() {
        return new Promise((resolve) => {
            let jsonConfig = "assets/jsonatte/config.json" + "?_cache_buster=" + new Date().getTime();
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', jsonConfig, false); // false for synchronous request
            xmlHttp.send(null);
            this.config = JSON.parse(xmlHttp.responseText);
            resolve(true);
        });
    }

    public get(): any {
        return this.config;
    }
}