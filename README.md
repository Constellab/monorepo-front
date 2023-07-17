# Monorepo front

This project contains all the gencovery code for Angular front app.

All the app and libraries hava a prefix to simplify search

## Apps

### Central front : Ca
The angular front app for central (constellab). 

Prefix : Ca

To build the app, push a tag with the version number and the prefix 'ca_'. 
For example, to build the version 1.0.0, push the tag `ca_1.0.0`.

Then execute the npm script ```ca-central-front:caprover-deploy-preprod``` or ```ca-central-front:caprover-deploy-prod```
to deploy the app to caprover. Be careful of the image tag.

### Lab front
The angular front app for the lab. One front is available per lab. 

Prefix : Lab

### Hub front (ha-hub) : Da
The hub angular app containing the documentation.

Prefix : Ha

## Libraries

### core-lib : Cl
Typescript library for font and back for services, helpers, classes

Prefix : Cl

### front-core-lib : Fl
Library for angular app that contains modules, components, directives, pipes and classes

Prefix : Fl


