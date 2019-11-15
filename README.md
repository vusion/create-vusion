# Vusion CLI

CLI for init Vusion Projects.

## Install

``` shell
npm install -g vusion-cli
```

## Quick Start

``` shell
npm init vusion ./app
// same as
npm create vusion ./app
```

## Commands

- `npm init vusion help`: Show help of all commands
- `npm init vusion -V, --version`: Show the version of current CLI

### User

- `npm create vusion <dir> [templateName]`: Initalize a vusion project base on [templateName](default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))

### Contributor

#### command

- `npm init vusion block <name> [dir]`: Initalize a block
- `npm init vusion repository <name> [dir]`: Initalize a repository
- `npm init vusion component <name> [dir]`: Initalize a component
- `npm init vusion template [options] <name> [dir]`: Initalize a template
  - `-t, --template <templateName>`: Initalize a template base on templateName (default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))
- `npm init vusion config <action> [key] [value]`: get or set config
  - `list`: show config
  - `get [key]`: show config[key] or config
  - `set [key] [value]`: set config

#### prompt

- `npm init vusion`: into prompt mode
