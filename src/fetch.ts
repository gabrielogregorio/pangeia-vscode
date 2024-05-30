import * as vscode from 'vscode';
import { mainDataTags } from './data';

import { getTemplateErrorMessageNeedsConfig, getTemplateErrorMessageResponseApi } from './templates';
import { logger } from './setupOutputChannel';

import('node-fetch');

async function fetchData(apiTags: string): Promise<any> {
  try {
    const response = await fetch(apiTags);
    if (!response.ok) {
      throw new Error('Error not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('error fetch:', error);
    throw error;
  }
}

const DEFAULT_API_URL = 'http://127.0.0.1:3333';

export function fetchTags() {
  const baseUrlTags = (vscode.workspace.getConfiguration().get('pangeiaVscode.apiTags') as string) || DEFAULT_API_URL;

  // if (!baseUrlTags) { // TODO: handle this
  //   logger(getTemplateErrorMessageNeedsConfig());
  //   return;
  // }

  fetchData(baseUrlTags.endsWith('/') ? baseUrlTags + 'schemas/tags' : baseUrlTags + '/schemas/tags')
    .then((res) => {
      mainDataTags.setData(res);
      logger(`${res?.length} tags obtained from the pangeia API`);
      logger('Everything ok, pangeia-vscode working...');
    })
    .catch((error) => {
      logger(getTemplateErrorMessageResponseApi(error, baseUrlTags));
    })
    .finally(() => {
      mainDataTags.setHasResponse(true);
    });
}
