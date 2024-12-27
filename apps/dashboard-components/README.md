# Dashboard components

Special app to build component for streamlit.

## Apps

- `dc_text_editor`: Text editor component for streamlit

## Develop a component

To develop a component, you need to create a new folder in the `src` folder. A new project must also be created in the `project.json` file.

To test your component, run the apps in dev environment using `nx run` (see `package.json` for more details).

Start the python streamlit server inside the lab or using the `gws streamlit run-dev` command. The streamlit app must use the component with `StreamlitComponentLoader` and `is_release=False`.

## Build a component

Push a tag corresponding to the version of the component:

- `dc_text_editor_*` for the text editor component

The component will be built and published to the https://github.com/Constellab/dashboard-components public github repository as release.
