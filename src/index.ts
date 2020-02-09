import { injectCode } from "./helpers"
import { main } from "./injects"
import Game from "./gameType"
declare global {
	interface Window {
		Game: Game
		CCL: any
		CCLInit: boolean
	}
}
if (window.CCLInit) throw new Error("Duplicate CCL import")

let lol = 6
let custom = {}
window.CCLInit = true
custom = main()
let master = {
	...custom,
	lol,
	injectCode,
}
export default master
