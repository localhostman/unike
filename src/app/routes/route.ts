import { getRoutes as getRoutesIt } from "./route-it";
import { getRoutes as getRoutesCn } from "./route-cn";
import { Route } from "@angular/router";

export interface ITranslateRoute {
    language: string,
    translate: string,
    routes?: Route[],
    children?: ITranslateRoute[];
}


export function getRoutes(mobile: boolean = false) {
    return {
        "It": getRoutesIt(mobile),
        "Cn": getRoutesCn(mobile),
    };
}