# Dashboard components

Special app to build component for streamlit.

## Apps

- `dc-streamlit-components`: Library of components available for streamlit.
- `dc-iframe-message` : A small app that a streamlit component run in the Iframe. It sends messages to the parent window dc_streamlit_components which generate the actual component.

## Dev a component

To dev a component, start the dc-streamlit-components app:

```bash
npm run dc-streamlit-components
```

Then in python back, mark the StreamlitComponentLoader a not release `IS_RELEASE=False`, this will use
the local running component.

## Dev the iframe-message

To dev the iframe-message, start the dc-iframe-message app:

```bash 
npm run dc-iframe-message
```

Then in python back, mark the StreamlitComponentLoader a not release `IS_RELEASE=False`, this will use
the local running component.

It must use streamlit-components built in production mode as only on dev app can be run in dev mode at the same time.

## Build a component

Push a tag corresponding to the version of the component:

- `dc_streamlit_components_*` for the text editor component

The component will be built and published to the https://github.com/Constellab/dashboard-components public github repository as release.

Now the component can be used in released mode `IS_RELEASE=True` in the StreamlitComponentLoader.
