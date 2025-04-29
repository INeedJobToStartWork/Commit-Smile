import ineedj from "@ineedj/eslintrc";

export default ineedj({
	formatters: {
		json: false,
		stylistic: false,
		stylisticJSX: false,
		stylisticTS: false,
		perfectionistSorters: false
	},
	modifiers: {
		commands: true
	},
	syntax: {
		vitest: true,
		eslint: true,
		jsx: false,
		next: false,
		node: true,
		react: false,
		storybook: false,
		tailwindcss: false,
		typescript: true,
		toml: false,
		yaml: false,
		ignoreGlobalFiles: { gitIgnore: true, basicIgnores: true }
	}
}).removeRules(
	"@typescript-eslint/no-throw-literal" /** Use custom Error */,
	"@EslintSecurity/detect-object-injection",
	"MD010/no-hard-tabs",
	"@EslintTSDocs/syntax",
	"@EslintNode/no-process-env",
	"@EslintNode/no-process-exit",
	"@EslintUnicorn/no-process-exit",
	"@EslintNode/hashbang"
);
