import { defaultConfig } from "./packages/commitsmile/dist/index";

export default defaultConfig().deepMerge({
  prompts: {
    scopes: { workspaces: true },
    description: false,
  },
});
