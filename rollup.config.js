import babel from "rollup-plugin-babel"
import analyze from "rollup-plugin-analyzer"
import minify from "rollup-plugin-babel-minify"
import typescript from "rollup-plugin-typescript2"
let production = false
//import banner from "rollup-plugin-banner"
export default {
	input: ["./src/index.ts"],
	output: {
		name: "CCL",
		file: "./dist/index.js",
		format: "umd",
		sourcemap: true,
	},
	plugins: [
		typescript({
			tsconfig: "./tsconfig.json",
		}),

		babel({
			exclude: "node_modules/**",
			sourceMaps: true,
		}),
		analyze({
			summaryOnly: true,
		}),
		production
			? minify({
					comments: false,
					sourcemap: true,
			  })
			: undefined,
		//banner("Zuckor <%= pkg.version %> - <%= pkg.author %>")
	],
}
