import { injectCode } from "./helpers"

declare global {
	interface Window {
		Game: any
		CCL: any
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
		new Injection("customInfoMenu", []),
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
	]
	injections.forEach(inject => {
		dummy[inject.value] = inject.defValue
		if (inject.func) inject.func()
	})
	return dummy
}
export function a() {}
