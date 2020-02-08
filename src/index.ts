let injectCode = function({
	func,
	source,
	target,
	where,
}: {
	func: Function
	source: string
	target: string
	where: "before" | "replace" | "after"
}) {
	let newFuncStr = func.toString()
	source = source
		.split("")
		.map(val => `\\${val}`)
		.join("")
	switch (where) {
		case "before":
			newFuncStr = newFuncStr.replace(
				new RegExp(source, "g"),
				`${target}${source}`
			)
			break
		case "replace":
			newFuncStr = newFuncStr.replace(new RegExp(source, "g"), `${target}`)
			break
		case "after":
			newFuncStr = newFuncStr.replace(
				new RegExp(source, "g"),
				`${source}${target}`
			)
			break
		default:
			throw new Error('where Parameter must be "before", "replace" or "after"')
	}
	let newFunc = new Function(`return (${newFuncStr})`)()
	newFunc.prototype = func.prototype
	return newFunc
}

let lol = 6
export { lol, injectCode }
