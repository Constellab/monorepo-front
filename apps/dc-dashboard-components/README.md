# Dashboard components

Special app to build component for streamlit.

## Apps

- `dc-components`: Library of components available for streamlit or reflex.
- `dc-streamlit-iframe-message` : A small app that a streamlit component run in the Iframe. It sends messages to the parent window dc_streamlit_components which generate the actual component.

## Dev a component

To dev a component, start the dc-components app:

```bash
npm run dc-components
```

Open the http://localhost:4201. This mode is not supposed to be used in a streamlit app.

To run in dev mode in streamlit app, execute the following command:

```bash
npm run dc-streamlit-components:serve-iframe
```

Then in python back, mark the StreamlitComponentLoader a not release `IS_RELEASE=False`, this will use
the local running component.

## Dev the iframe-message

To dev the iframe-message, start the dc-iframe-message app:

```bash
npm run dc-streamlit-iframe-message:serve
```

Then in python back, mark the StreamlitComponentLoader a not release `IS_RELEASE=False`, this will use
the local running component.

You must test the streamlit app using `http://localhost:8511` and not sub domain like `http://dev-app.localhost:8510/` because of cross origin restriction.
It must use streamlit-components built in production mode as only on dev app can be run in dev mode at the same time.

## Build

Push a tag corresponding to the version of the component:

- `dc_*` for the text editor component

The streamlit and reflex components will be built automatically in the CI/CD pipeline.

Now the component can be used in released mode `IS_RELEASE=True` in the StreamlitComponentLoader.
