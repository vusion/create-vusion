# Create Vusion

CLI for init Vusion Projects.

## Quick Start

``` shell
npm create vusion
// same as
npm init vusion
```

``` shell
npm create vusion admin-cloud-lite my-admin
// same as
npm init vusion admin-cloud-lite my-admin
```

## Install

``` shell
npm install -g create-vusion
```

## Commands

- `npm init vusion help`: Show help of all commands
- `npm init vusion -V, --version`: Show the version of current CLI

### User

- `npm create vusion [template-name] [package-name]`: Initialize a vusion project based on [template-name]

### Contributor

#### command

- `npm init vusion block [package-name]`: Initialize a vusion block
- `npm init vusion component [package-name]`: Initialize a vusion component
- `npm init vusion repository [package-name]`: Initialize a vusion repository
- `npm init vusion template [package-name] [options]`: Initialize a template based on an existing template
  - `-t, --template <template-name>`: Based on template-name (default: [cloud-admin-lite](https://github.com/vusion-templates/cloud-admin-lite))
- `npm init vusion multifile-block [package-name]`: Initialize a vusion multifile block. Compat old version
- `npm init vusion multifile-component [package-name]`: Initialize a vusion multifile component. Compat old version

#### prompt

- `npm init vusion`: into prompt mode
