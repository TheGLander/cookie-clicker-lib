import { injectCode } from "./helpers"
import Game from "./gameType"

declare global {
	interface Window {
		Game: Game
		CCL: any
		Beautify: Function
	}
}
export function main() {
	class Injection {
		constructor(
			public value: string,
			public defValue: any,
			public func?: Function
		) {}
	}
	let dummy = {}
	const injections: Array<Injection> = [
		//Custom menus
		new Injection("customMenu", [], () => {
			window.Game.UpdateMenu = injectCode({
				func: window.Game.UpdateMenu,
				where: "before",
				target: `
					// CCLib
			switch (Game.onMenu) {
				case "prefs":
					for(const i in CCL.customOptionsMenu) CCL.customOptionsMenu[i]();
					break;
				case "stats":
					for(const i in CCL.customStatsMenu) CCL.customStatsMenu[i]();
					break;
				case "log":
					for(const i in CCL.customInfoMenu) CCL.customInfoMenu[i]();
					break;
				default:
					break;
			}
			for(const i in CCL.customMenu) CCL.customMenu[i]();`,
			})
		}),
		new Injection("customOptionsMenu", []),
		new Injection("customStatsMenu", []),
		new Injection("customInfoMenu", []),
		//Data manipulation
		new Injection("customLoad", [], () => {
			window.Game.LoadSave = injectCode({
				func: window.Game.LoadSave,
				source: "if (Game.prefs.showBackupWarning==1)",
				where: "before",
				target: `
			// CCLib
			for(const i in CLL.customLoad) CLL.customLoad[i](); `,
			})
		}),
		new Injection("customReset", [], () => {
			window.Game.Reset = injectCode({
				func: window.Game.Reset,
				where: "before",
				target: `
			// CCLib
			for(const i in CCL.customReset) CCL.customReset[i](hard);
		`,
			})
		}),
		//Misc
		new Injection("customBeautify", [], () => {
			window.Beautify = injectCode({
				func: window.Beautify,
				source: "return negative?'-'+output:output+decimal;",
				target: `// CCLib
  let ret = negative?'-'+output:output+decimal;
	for(const i in CCL.customBeautify) {
		let returnedValue = CCL.customBeautify[i](value, floats, ret)
		ret = returnedValue ? returnedValue : ret
	};
	return ret;`,
				where: "replace",
			})
		}),
		//Tooltips
		new Injection("customTooltipDraw", [], () => {
			window.Game.tooltip.draw = injectCode({
				func: window.Game.tooltip.draw,
				where: "before",
				target: `
			// CCLib
			for(const i in CCL.customTooltipDraw) CLL.customTooltipDraw[i](from, text, origin);
		`,
			})
		}),
		new Injection("customTooltipUpdate", [], () => {
			window.Game.tooltip.update = injectCode({
				func: window.Game.tooltip.update,
				where: "before",
				target: `
			// CCLib
			for(const i in CCL.customTooltipUpdate) CLL.customTooltipUpdate[i]();
		`,
			})
		}),
	]
	injections.forEach(inject => {
		dummy[inject.value] = inject.defValue
		if (inject.func) inject.func()
	})
	//Misc stuff
	window.Game.Loader.Load = injectCode({
		func: window.Game.Loader.Load,
		where: "replace",
		source: "img.src=this.domain",
		target: "img.src=(assets[i].indexOf('http') !== -1 ? \"\" : this.domain)",
	})
	return dummy
}
export function a() {}
