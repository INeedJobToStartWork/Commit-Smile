![CommitSmileBanner](https://github.com/INeedJobToStartWork/Commit-Smile/assets/97305201/7b18af3e-7472-47f5-99e8-6f97574d2ea7)

<h1 align="center">Commit-Smile</h1>
<p align="center"><b>Simple Commit Handler!</b></p>
<p align="center"><a href="https://github.com/INeedJobToStartWork/Commit-Smile/milestone/1">Next MileStones</a></p>

<hr/>

[![output](https://github.com/user-attachments/assets/dc4c77cc-de51-4657-820d-5ee142176ad9)](https://asciinema.org/a/zvxJCwhOPCXdnuyIEehfC2DJo)

<!-- [![asciicast](https://asciinema.org/a/zvxJCwhOPCXdnuyIEehfC2DJo.svg)](https://asciinema.org/a/zvxJCwhOPCXdnuyIEehfC2DJo) -->

What you get:

- 🌈 Beautiful Commits
- 📝 Standardized commit messages
- 🎯 Simplified commit process

About package:

- 🚀 Install & Use
- ⚙️ Easy in Configuring
- 🔧 High Customizable (Prompts, Formatters)
- 📦 Support Monorepo
- 📖 TSDocs (Internal documentation)
- ♻️ Minified & Compressed
- ✅ Support JS/TS & CJS/ESM

# 📜 List of Contest

- [📜 List of Contest](#-list-of-contest)
  - [Install](#install)
  - [How to start](#how-to-start)
  - [Commands](#commands)
  - [Config](#config)
    - [Location / Naming](#location--naming)
      - [Dedicated File](#dedicated-file)
      - [package.json](#packagejson)
    - [Default Config \& Types](#default-config--types)
    - [Explaination](#explaination)
      - [Formatters](#formatters)
      - [Prompts](#prompts)
      - [finalCommands](#finalcommands)
    - [Short hands](#short-hands)
  - [Questions and Answers](#questions-and-answers)
    - [Can i Remove emojis? (Yes)](#can-i-remove-emojis-yes)
      - [Removing All](#removing-all)
      - [Removing From Label](#removing-from-label)
      - [Removing From Value](#removing-from-value)

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

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `pnpm i -D commitsmile` | Install it at repo                  |
| `pnpm commitsmile init` | Init and configure **_(Optional)_** |
| `pnpm commitsmile`      | Use! :D                             |

## Commands

| Command   | Description                |
| --------- | -------------------------- |
| (default) | Commit Handler (CLI APP)   |
| init      | Init config file (CLI APP) |

To get more information about commands, use `--help`

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

### Default Config & Types

Package export `defaultConfig` which can be configured and deep merge your config!

```ts
import { defaultConfig } from "commitsmile";

export default defaultConfig({
	/* There config for defaultConfig */
}).deepMerge({
	/* There your config which will be merged with default config*/
});
```

More info in **internal Documentation** (Code)

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

| Stage name    | type of prompt | Special properties                               |
| ------------- | -------------- | ------------------------------------------------ |
| `type`        | multiselect    |                                                  |
| `scopes`      | multiselect    | `workspaces` - Show found workspaces in monorepo |
| `isBreaking`  | confirm        |                                                  |
| `title`       | text           |                                                  |
| `description` | select         | `always` - Always select that in select menu     |

Every Step is Optional and can be skipped. To do it just use value `false` or `undefined` / `void 0`

#### finalCommands

Commands which will be executed at the end (In key order).

example:

```ts
{
  gitAdd: "git add .",
  commit: (results) => `git commit -m '${results.format()}' ${results.commitDescription ? `-m "${results.commitDescription}"` : ''}`,
  gitPush:"git push"
}
```

### Short hands

Every shorthand it's provided by our parser.

| At                             | Description                           | From                          | To                                              |
| ------------------------------ | ------------------------------------- | ----------------------------- | ----------------------------------------------- |
| `Config.prompts.stage`         | If value is just a string             | `type:"What type of changes"` | `type:{message:"What type of changes"}`         |
| `Config.prompts.stage.options` | If option is just a string            | `["Option 1"]`                | `[{value:"Option 1"}]` and continue below logic |
| `Config.prompts.stage.options` | If option has a value but not a label | `[{value:"Option 1"}]`        | `[{value:"Option 1", label:"Option 1"}]`        |
| `Config.prompts.stage.options` | If option has a label but not a value | `[{label:"Option 1"}]`        | `[{value:"Option 1", label:"Option 1"}]`        |

## Questions and Answers

### Can i Remove emojis? (Yes)

Yes, you can do this,this way:

#### Removing All

If you want to remove them totally in CLI view commit

```ts
{
	emoji: false;
}
```

#### Removing From Label

If you want to remove them in CLI view but stay in commit

```ts
{
	emoji: {
		label: false;
	}
}
```

#### Removing From Value

If you want to remove them in commit but stay in CLI view

```ts
{
	emoji: {
		value: false;
	}
}
```
