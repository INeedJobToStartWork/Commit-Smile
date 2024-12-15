![CommitSmileBanner](https://github.com/INeedJobToStartWork/Commit-Smile/assets/97305201/7b18af3e-7472-47f5-99e8-6f97574d2ea7)

# 📜 List of Contest

- [📜 List of Contest](#-list-of-contest)
  - [Install](#install)
    - [How to start](#how-to-start)
    - [Config](#config)
      - [Location / Naming](#location--naming)
        - [Package.json](#packagejson)
        - [Dedicated file](#dedicated-file)
      - [Config Type](#config-type)
      - [Config Builder (defaultConfig)](#config-builder-defaultconfig)
    - [Custom file path](#custom-file-path)
    - [Init config](#init-config)
    - [Formatter](#formatter)

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

### How to start

👋Hello! Glad to see you! There is order task to setup:

| Command | Description | Link |
| ------- | ----------- | ---- |

### Config

#### Location / Naming

##### Package.json

Add "commitsmile" property to `package.json` file

##### Dedicated file

In Default execute app is looking for files names match
`/commitsmile.*\.(js|ts|mjs|cjs|mts|json|jsonc|json5|yaml|yml|toml)/iu`

- Name: commitsmile (lette rs can be uppercase or lowercase or mixed)
- pre ext (optional)
- Ext: `js|ts|mjs|cjs|mts|json|jsonc|json5|yaml|yml|toml`

examples:

- `commitsmile.discord.ts`
- `coMMitSmile.json`

#### Config Type

#### Config Builder (defaultConfig)

### Custom file path

To set custom path to config we can use optional parameter `-C,--config` where `<PATH>` can be relative or absolute
path:

```bash copy
npm run commitsmile -C <PATH>
```

If Path:

- do not include filename it will use standard process to find.
- include - will just check this file (faster way)

### Init config

to init config we use `init`:

```bash copy
npm run commitsmile init
```

### Formatter

You format your commit message at your rules!
