# pangeia-vscode

## Requirements

This project requires node 18 and url API pangeia-api, example `http://localhost:3333/` if pangeia-api run in your localhost

## How install in my vscode?

1. Run `npm install`
2. Generate `pangeia.x.y.z.vsix` file with `npm run local`

![run npm run local and accept by pass](./public/build-pangeia.png)

3. In vscode extensions, install from vsix

![open tab extensions, click in dots and choice instal vsix](./public/install_from_vsix.png)

4. Choice `.visx file`

![Install vsix with double click](./public/install_vsix.png)

5. Restart your IDE, and follow output tab from vscode

![output tab with errors](./public/output-tab.png)

6. Set pangeiaVscode config, or use default, default is `http://127.0.0.1:3333`

## How set custom config?

1. In Ubuntu `ctrl` + `p`

![open user settings](./public/pangeia-config.png)

2. And add this config, put apiTags to `pangeia-api`, example:

```json
{
  "pangeiaVscode": {
    "apiTags": "http://127.0.0.1:3333"
  }
}
```
