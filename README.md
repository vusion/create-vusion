# Create Vusion

CLI for init Vusion Projects.

## Quick Start

``` shell
npm create vusion
// same as
npm init vusion
```

``` shell
npm create vusion admin-cloud-lite my-app
// same as
npm init vusion admin-cloud-lite my-app
```

## Install

``` shell
npm install -g create-vusion
```

## Commands

- `npm init vusion help`: Show help of all commands
- `npm init vusion -V, --version`: Show the version of current CLI

### User

- `npm create vusion app [package-name] --client-template [client-template-name]`: Initialize a vusion project based on [client-template-name].

- `npm create vusion app [package-name] --client-template [client-template-name] --server-template [server-template-name]`: Initialize a vusion project based on [client-template-name] with [server-template-name].
  - `-c, --client-template [client-template-name]`:Based on template-name (default: [cloud-admin-lite](https://github.com/vusion-templates/cloud-admin-lite))
  - `-s, --server-template [server-template-name]`:Based on template-name (default: [cloud-admin-fullstack](https://github.com/vusion-templates/cloud-admin-fullstack))

### Contributor

#### command

- `npm init vusion block [package-name]`: Initialize a vusion block
- `npm init vusion component [package-name]`: Initialize a vusion component
- `npm init vusion repository [package-name]`: Initialize a vusion repository
- `npm init vusion template [package-name] [options]`: Initialize a template based on an existing template
  - `-t, --template <template-name>`: Based on template-name (default: [cloud-admin-lite](https://github.com/vusion-templates/cloud-admin-lite))

#### prompt

- `npm init vusion`: into prompt mode
