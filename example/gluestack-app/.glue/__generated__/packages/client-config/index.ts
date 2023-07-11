
import { config as clientConfig } from './client-config/client';
import { config as GlobalConfig } from './client-config/index';

function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const merged = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      // @ts-ignore
      const targetValue = merged[key as keyof (T & U)];

      if (sourceValue instanceof Object && targetValue instanceof Object) {
        // @ts-ignore
        merged[key as keyof (T & U)] = deepMerge(targetValue, sourceValue);
      } else {
        // @ts-ignore
        merged[key as keyof (T & U)] = sourceValue;
      }
    }
  }

  return merged as T & U;
}

type configValueType = {
  [key in keyof (typeof clientConfig &
    typeof GlobalConfig)]: (typeof clientConfig)[key] &
    (typeof GlobalConfig)[key];
};

function config(): typeof clientConfig & typeof GlobalConfig;
function config(
  key: keyof (typeof clientConfig & typeof GlobalConfig)
): configValueType;
function config(key?: keyof (typeof clientConfig & typeof GlobalConfig)) {
  const mergedConfig = deepMerge(clientConfig, GlobalConfig);
  if (typeof key !== 'undefined') {
    return mergedConfig[key];
  }
  return mergedConfig;
}
export { config };
