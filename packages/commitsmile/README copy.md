![CommitSmileBanner](https://github.com/INeedJobToStartWork/Commit-Smile/assets/97305201/7b18af3e-7472-47f5-99e8-6f97574d2ea7)

# 📜 List of Contest

- [📜 List of Contest](#-list-of-contest)
  - [Install](#install)
  - [How to start](#how-to-start)
  - [Commands](#commands)
    - [Blank (Default)](#blank-default)
    - [init](#init)
  - [Options](#options)
  - [Config](#config)
    - [Location / Naming](#location--naming)
      - [Dedicated File](#dedicated-file)
      - [package.json](#packagejson)
    - [Explaination](#explaination)
      - [Formatters](#formatters)
      - [Prompts](#prompts)
    - [Short hands](#short-hands)

## Install

NPM

```bash copy
npm install -D commitsmile
```

PNPM

```bash copy
pnpm add -D commitsmile
```

Yarn

```bash copy
yarn add -D commitsmile
```

## How to start

👋Hello! Glad to see you! There is order task to setup:

| Command | Description | Link |
| ------- | ----------- | ---- |

## Commands

### Blank (Default)

### init

## Options

## Config

### Location / Naming

To find config we use `c12` and our system.

#### Dedicated File

In Default execute app is looking for files names match
`/commitsmile.*\.(js|ts|mjs|cjs|mts|json|jsonc|json5|yaml|yml|toml)/iu`

- Name: commitsmile (letters can be uppercase or lowercase or mixed)
- pre ext (optional)
- Ext: `js|ts|mjs|cjs|mts|json|jsonc|json5|yaml|yml|toml`

examples:

- `commitsmile.discord.ts`
- `coMMitSmile.json`

Supports to:

| ✅ Supports too |
| --------------- |
| `.config/`      |
| `.rc`           |

#### package.json

With `commitsmile` property.

### Explaination

#### Formatters

There you can make your own formatters.

| Stage name   | description                                             |
| ------------ | ------------------------------------------------------- |
| `format`     | Format formatted stages output (Final format of commit) |
| `type`       | Format of `type`                                        |
| `scopes`     | Format of `scopes`                                      |
| `isBreaking` | Format of `isBreaking`                                  |
| `title`      | Format of `title`                                       |

#### Prompts

Part of Config responsible for Commit Stages.

| Stage name    | type of prompt |
| ------------- | -------------- |
| `type`        | multiselect    |
| `scopes`      | multiselect    |
| `isBreaking`  | select         |
| `title`       | text           |
| `description` | text           |

Every Step is Optional and can be skipped. To do it just use value `false` or `undefined` / `void 0`

### Short hands

Every shorthand it's provided by our parser.

| At                             | Description                           | From                          | To                                              |
| ------------------------------ | ------------------------------------- | ----------------------------- | ----------------------------------------------- |
| `Config.prompts.stage`         | If value is just a string             | `type:"What type of changes"` | `type:{message:"What type of changes"}`         |
| `Config.prompts.stage.options` | If option is just a string            | `["Option 1"]`                | `[{value:"Option 1"}]` and continue below logic |
| `Config.prompts.stage.options` | If option has a value but not a label | `[{value:"Option 1"}]`        | `[{value:"Option 1", label:"Option 1"}]`        |
| `Config.prompts.stage.options` | If option has a label but not a value | `[{label:"Option 1"}]`        | `[{value:"Option 1", label:"Option 1"}]`        |
