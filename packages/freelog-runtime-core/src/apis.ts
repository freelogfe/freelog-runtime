import type { ParcelConfigObject } from 'single-spa';
import { mountRootParcel} from './single-spa/single-spa';
import type { ObjectType } from './interfaces';
import type { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp, MicroApp } from './interfaces';
import type { ParcelConfigObjectGetter } from './loader';
import { loadApp } from './loader';
import {  getContainer, getXPathForElement, } from './utils';

 
// eslint-disable-next-line import/no-mutable-exports
export let frameworkConfiguration: FrameworkConfiguration = {fetch: window.fetch};
const appConfigPromiseGetterMap = new Map<string, Promise<ParcelConfigObjectGetter>>();

export function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: FrameworkConfiguration,
  lifeCycles?: FrameworkLifeCycles<T>,
): MicroApp {
  const { props, name } = app;
  frameworkConfiguration = {...frameworkConfiguration, fetch: configuration?.fetch ? configuration?.fetch : frameworkConfiguration.fetch}
  const getContainerXpath = (container: string | HTMLElement): string | void => {
    const containerElement = getContainer(container);
    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }

    return undefined;
  };

  const wrapParcelConfigForRemount = (config: ParcelConfigObject): ParcelConfigObject => {
    return {
      ...config,
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: () => Promise.resolve(),
    };
  };

  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */
  const memorizedLoadingFn = async (): Promise<ParcelConfigObject> => {
    const userConfiguration = configuration ?? { ...frameworkConfiguration, singular: false };
    const { $$cacheLifecycleByAppName } = userConfiguration;
    const container = 'container' in app ? app.container : undefined;

    if (container) {
      // using appName as cache for internal experimental scenario
      if ($$cacheLifecycleByAppName) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);
        if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }

      const xpath = getContainerXpath(container);
      if (xpath) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(`${name}-${xpath}`);
        if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }
    }

    const parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);

    if (container) {
      if ($$cacheLifecycleByAppName) {
        appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
      } else {
        const xpath = getContainerXpath(container);
        if (xpath) appConfigPromiseGetterMap.set(`${name}-${xpath}`, parcelConfigObjectGetterPromise);
      }
    }

    return (await parcelConfigObjectGetterPromise)(container);
  };
  // @ts-ignore
  return mountRootParcel(memorizedLoadingFn, { domElement: document.createElement('div'), ...props });
}

 
