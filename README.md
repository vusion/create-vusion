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

- `npm create vusion <dir> [template-name]`: Initialize a vusion project base on [template-name](default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))

### Contributor

#### command

- `npm init vusion block <package-name> [dir]`: Initialize a block
- `npm init vusion repository <package-name> [dir]`: Initialize a repository
- `npm init vusion component <package-name> [dir]`: Initialize a component
- `npm init vusion template [options] <package-name> [dir]`: Initialize a template
  - `-t, --template <template-name>`: Initialize a template base on template-name (default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))

#### prompt

- `npm init vusion`: into prompt mode
