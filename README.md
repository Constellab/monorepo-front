# Monorepo front

This project contains all the gencovery code for Angular front app.

All the app and libraries hava a prefix to simplify search.

## Getting started

This workspace uses [bun](https://bun.sh) as package manager (see `bun.lock`).

```bash
bun install          # install all dependencies (from the workspace root)
bun add <pkg>        # add a runtime dependency
bun add -d <pkg>     # add a dev dependency
bunx nx <target>     # run any Nx target, e.g. bunx nx serve ca-space-front
```

There is a single `package.json` at the root: always install from the root, never from `apps/*` or `libs/*`.

## Apps

### Space front : Ca

The angular front app for space (constellab).

Prefix : Ca

To build the app, push a tag with the version number and the prefix 'ca\_'.
For example, to build the version 1.0.0, push the tag `ca_1.0.0`.

Then run `bun run ca-space-front:caprover-deploy-preprod` or `bun run ca-space-front:caprover-deploy-prod`
to deploy the app to caprover. Be careful of the image tag.

### Lab front

The angular front app for the lab. One front is available per lab.

Prefix : Lab

### Community front (ha-community-front) : Da

The community app.

Prefix : Ha

### Design system (ds-design-system) : Ds

Showcase app for the custom components and the design system.

Prefix : Ds

To serve the app, run `bun run ds-design-system:serve`.

## Libraries

### core-lib : Cl

Typescript library for font and back for services, helpers, classes

Prefix : Cl

### front-core-lib : Fl

Library for angular app that contains modules, components, directives, pipes and classes

Prefix : Fl
