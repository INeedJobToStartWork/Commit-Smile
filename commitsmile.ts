import { defaultConfig } from "./packages/commitsmile/lib/index";

export default defaultConfig().deepMerge({
  prompts: {
    scopes: { workspaces: true },
    description: false,
  },
});
