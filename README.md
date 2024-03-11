![CommitSmileBanner](https://github.com/INeedJobToStartWork/Commit-Smile/assets/97305201/7b18af3e-7472-47f5-99e8-6f97574d2ea7)

# 📜 List of Contest

- [Install](#-list-of-contest)
- [How to start](#how-to-start)
- [Config](#config)
  - [Custom file path](#custom-file-path)
  - [Init config](#init-config)
  - [Formatter](#formatter)
  - [Prompts](#prompts)

## Install

NPM

```bash copy
npm install -D commitSmile
```

PNPM

```bash copy
pnpm add -D commitSmile
```

Yarn

```bash copy
yarn add -D commitSmile
```

### How to start

👋Hello! Glad to see you! There is order task to setup:

### Config

In Default execute app is looking for files names match `/commitsmile.*\.(json|mjs|cjs|js|mts|cts|ts)/iu`

- Name: commitsmile (letters can be uppercase or lowercase or mixed)
- pre ext (optional)
- Ext: `json|mjs|cjs|js|mts|cts|ts`

examples:

- `commitsmile.discord.ts`
- `coMMitSmile.json`

### Custom file path

To set custom path to config we can use optional parameter `-C,--config` where `<PATH>` can be relative or absolute
path:

```bash copy
npm run commitSmile -C <PATH>
```

If Path:

- do not include filename it will use standard process to find.
- include - will just check this file (faster way)

### Init config

to init config we use `init`:

```bash copy
npm run commitSmile init
```

### Formatter

You format your commit message at your rules!
