import { defaultConfig } from "./packages/commitsmile/lib/index";

export default defaultConfig().deepMerge({
  prompts: {
    SCOPES: { workspaces: true },
    COMMIT_DESCRIPTION: { always: "skip" },
  },
});
// export default defaultConfig().deepMerge({
//   prompts: {
//     CHANGES: {
//       options: [
//         "Test",
//         "Test2",
//         { value: 123 },
//         { label: 123 },
//         { label: "oh", value: 123 },
//         { value: {test:"abc"} },
//       ],
//     },
//   },
// });
