# Create Vusion

CLI for init Vusion Projects.

## Quick Start

``` shell
npm create vusion ./app
// same as
npm init vusion ./app
```

## Install

``` shell
npm install -g create-vusion
```

## Commands

- `npm init vusion help`: Show help of all commands
- `npm init vusion -V, --version`: Show the version of current CLI

### User

- `npm create vusion <dir> [templateName]`: Initalize a vusion project base on [templateName](default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))

### Contributor

#### command

- `npm init vusion block <npmName> [dir]`: Initalize a block
- `npm init vusion repository <npmName> [dir]`: Initalize a repository
- `npm init vusion component <npmName> [dir]`: Initalize a component
- `npm init vusion template [options] <npmName> [dir]`: Initalize a template
  - `-t, --template <templateName>`: Initalize a template base on templateName (default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))

#### prompt

- `npm init vusion`: into prompt mode
