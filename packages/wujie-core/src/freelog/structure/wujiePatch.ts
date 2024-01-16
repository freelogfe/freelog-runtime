import { startApp, destroyApp, preloadApp } from "wujie";

export async function destroyWidget(
  name: string | undefined,
  widgetId: string
) {
  return destroyApp(widgetId);
}

export async function preloadWidget(
  name: string | undefined,
  widgetId: string
) {
  // @ts-ignore
  return preloadApp({ name: widgetId });
}
