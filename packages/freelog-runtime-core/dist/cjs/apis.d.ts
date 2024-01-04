import type { ObjectType } from './interfaces';
import type { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp, MicroApp } from './interfaces';
export declare let frameworkConfiguration: FrameworkConfiguration;
export declare function loadMicroApp<T extends ObjectType>(app: LoadableApp<T>, configuration?: FrameworkConfiguration, lifeCycles?: FrameworkLifeCycles<T>): MicroApp;
