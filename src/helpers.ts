export type CommonString = string | Function
export function escapeRegExp(str: string): string {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
}
export function getValue(value: CommonString): string {
	if (value instanceof Function) return value()
	return value
}
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
	let sliceMode = source !== undefined
	if (sliceMode) source = escapeRegExp(getValue(source))
	target = getValue(target)

	switch (where) {
		case "before":
			if (sliceMode) newFuncStr = `${target}${newFuncStr}`
			else
				newFuncStr = newFuncStr.replace(
					new RegExp(source, "g"),
					`${target}${source}`
				)
			break
		case "replace":
			if (sliceMode) newFuncStr = `${target}`
			else newFuncStr = newFuncStr.replace(new RegExp(source, "g"), `${target}`)
			break
		case "after":
			if (sliceMode) newFuncStr = `${newFuncStr}${target}`
			else
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
