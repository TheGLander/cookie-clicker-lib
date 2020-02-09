export type CommonString = string | Function
export function escapeRegExp(str: string): string {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
}
export function getValue(value: CommonString): string {
	if (value instanceof Function) return value()
	return value
}
/**
 * This function replaces code in some funcion
 * @param parameters
 */
export function injectCode({
	func,
	source,
	target,
	where,
}: {
	func: Function
	source?: string
	target: string
	where: "before" | "replace" | "after"
}) {
	let newFuncStr = func.toString()
	let sliceMode = source === undefined
	let regex: RegExp
	if (!sliceMode) {
		source = getValue(source)
		regex = new RegExp(escapeRegExp(source), "g")
	}
	target = getValue(target)
	let findStart = /\)\s+{/
	if (!sliceMode && !regex.test(newFuncStr)) console.warn("Nothing to inject.")
	switch (where) {
		case "before":
			if (sliceMode) newFuncStr = newFuncStr.replace(findStart, `) {${target}`)
			else newFuncStr = newFuncStr.replace(regex, `${target}${source}`)
			break
		case "replace":
			if (sliceMode) newFuncStr = `${target}`
			else newFuncStr = newFuncStr.replace(regex, `${target}`)
			break
		case "after":
			if (sliceMode) throw new Error("Yikes, can't add to end!")
			else newFuncStr = newFuncStr.replace(regex, `${source}${target}`)
			break
		default:
			throw new Error('where Parameter must be "before", "replace" or "after"')
	}
	let newFunc = new Function(`return (${newFuncStr})`)()
	newFunc.prototype = func.prototype
	return newFunc
}
