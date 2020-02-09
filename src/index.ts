import { injectCode } from "./helpers"
import { main } from "./injects"
let lol = 6
let custom = {}
if (window.CCL?.custom === undefined) custom = main()
let master = {
	...custom,
	lol,
	injectCode,
}
export default master
