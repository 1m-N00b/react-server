import { AsyncLocalStorage } from "node:async_hooks";

export const ContextStorage = (globalThis.__react_server_context__ =
  globalThis.__react_server_context__ || new AsyncLocalStorage());

export function getContext(type) {
  const store = ContextStorage.getStore();
  if (!type) return store;
  return store?.[type] ?? null;
}

/**
 * @template T
 * @param {string | Symbol} type
 * @param {T} context
 * */
export function context$(type, context) {
  const store = ContextStorage.getStore();
  const delta = typeof type === "object" ? type : { [type]: context };
  Reflect.ownKeys(delta).forEach((type) => {
    store[type] = delta[type];
  });
}

export async function init$(initialContext, callback) {
  return new Promise((resolve) => {
    ContextStorage.run(initialContext, async () => {
      await callback();
      resolve();
    });
  });
}
