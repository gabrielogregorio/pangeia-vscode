import * as vscode from 'vscode';
import { logger } from './setupOutputChannel';

type configType = {
  limitCharactersCache: number;
  limitCharactersItem: number;
};

/*doc 
tags: [cache]

Este é o sistema de cache vscode pangea, é usado para criar um cache toda vez que alguém usa o recurso de preenchimento automático ou para verificar se existe um recurso de referência, esses recursos são pesados ​​​​e notáveis ​​​​em cache

Esses são as configurações dos caches

[ref.pangeia-vscode.cache.instance]
*/

class Cache<T> {
  private cache: { [key: string]: T | undefined };
  private sizeCache: number;
  private config: configType;

  constructor(config: { limitCharactersCache: number; limitCharactersItem: number }) {
    this.cache = {};
    this.sizeCache = 0;
    this.config = config;
  }

  private resetCache() {
    this.cache = {};
    this.sizeCache = 0;
  }

  private verifyOverflowLimit = () => {
    if (this.sizeCache > this.config.limitCharactersCache) {
      this.resetCache();
      logger(`⚠️ cache was reset due to "${this.config.limitCharactersCache}" limit being exceeded`);
    }
  };

  get(key: string): T | undefined {
    return this.cache[key];
  }

  /**
   *
   * @param {String} key key cache
   * @param {String} value cache as string
   * @returns if cache has inserted or not
   */
  trySet(key: string, value: T): boolean {
    this.verifyOverflowLimit();
    const sizeValueAsStringify = JSON.stringify(value).length;

    const exceededTheLimitPerItem = sizeValueAsStringify > this.config.limitCharactersItem;
    if (exceededTheLimitPerItem) {
      logger(`⚠️ the cache is too large and will not save "${sizeValueAsStringify}"`);
      return false;
    }

    const cacheExists = key in this.cache;
    if (cacheExists) {
      this.sizeCache -= key.length + JSON.stringify(this.cache[key]).length;
    }

    this.sizeCache += key.length + sizeValueAsStringify;
    this.cache[key] = value;
    return true;
  }
}

/*doc 
tags: [cache, instance, autocomplete]

# instancia do cache de autocomplete

Esta é a configuração do cache, o limite é de 100_000 caracteres no valor e de 1 milhão para o conjunto total.

*/
export const cacheAutoComplete = new Cache<vscode.CompletionItem[]>({
  limitCharactersCache: 1_000_000,
  limitCharactersItem: 100_000,
});

/*doc
tags: [cache, instance, reference]
# instancia do cache de referências

Esta é a configuração do cache, o limite é de 10 caracteres no valor e de 50 mil para o conjunto total.

*/
export const cacheReferenceExists = new Cache<boolean>({
  limitCharactersCache: 50_000,
  limitCharactersItem: 10,
});
