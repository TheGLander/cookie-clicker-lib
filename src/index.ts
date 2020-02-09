import { injectCode } from "./helpers"
import { main } from "./injects"
declare global {
	interface Window {
		Game: any
		CCL: any
		CCLInit: boolean
	}
}
let lol = 6
let custom = {}
if (!window.CCLInit) {
	window.CCLInit = true
	custom = main()
}
let master = {
	...custom,
	lol,
	injectCode,
}
export default master
