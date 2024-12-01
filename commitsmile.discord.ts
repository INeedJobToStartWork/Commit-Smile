import { defaultConfig } from "./packages/commitsmile/lib/index.js";

export default await defaultConfig();
// export default await defaultConfig().deepMerge({
//   prompts: {
//     SCOPES: {
//       custom: {
//         value: true,
//         amount: 99,
//       },
//       // message:
//       //   "What is the scope of this change (e.g. component or file name)?",
//       multiple: true,
//       required: true,
//       options: [
//         { label: "CHUUUUUUUUUUUUUJ", value: "enviroment" },
//         { label: "📖 Docs", value: "docs" },
//       ],
//     },
//   },
// });
