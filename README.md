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

- `npm init vusion block <package-name> [dir]`: Initialize a vusion block
- `npm init vusion component <package-name> [dir]`: Initialize a vusion component
- `npm init vusion repository <package-name> [dir]`: Initialize a vusion repository
- `npm init vusion template [options] <package-name> [dir]`: Initialize a template based on an existing template
  - `-t, --template <template-name>`: Based on template-name (default: [cloud-admin-template](https://github.com/vusion-templates/cloud-admin-template))

#### prompt

- `npm init vusion`: into prompt mode
