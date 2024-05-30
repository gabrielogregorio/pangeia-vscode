export const getTemplateErrorMessageNeedsConfig =
  () => `❌ ERROR: You need to configure the pangeia-api url in your vscode settings, either in the project's .vscode/settings.json or in the user's global settings in vscode. Configuration example

{
  "pangeiaVscode": {
    "apiTags":"http://127.0.0.1:3333/"
  }
}

After configuring it is necessary to restart vscode.`;

export const getTemplateErrorMessageResponseApi = (
  error: any,
  baseUrlTags: string,
) => `❌ ERROR: Error on connecting with pangeia-api, check if the "${baseUrlTags}" api is available which you have configured in your vscode configuration like:

{
  "pangeiaVscode": {
    "apiTags":"${baseUrlTags}"
  }
}

Error: ${error}`;

export const getTemplateRefNotFound = (tags: string[]): string => {
  return `There is no reference that has the tags "${tags.join(
    ',',
  )}", if it exists, restart your vscode for pangeia-vscode to update the available tags`;
};

export const getTemplateNoHasDataTags = (): string => {
  return `There is no tag obtained, check the OUTPUT tab > [Pangeia VSCode] to verify that there were no errors.
You need to configure the pangeia-api url in your vscode, in settings.json or by configuring it in the user's settings.

After configuring it is necessary to restart vscode. Configuration example
{
pangeiaVscode": {
  "apiTags": "http://127.0.0.1:3333"
}
}          
`;
};
