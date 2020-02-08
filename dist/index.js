(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.CCL = {}));
}(this, (function (exports) { 'use strict';

	function escapeRegExp(str) {
	    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	function getValue(value) {
	    if (value instanceof Function)
	        return value();
	    return value;
	}
	function injectCode(_a) {
	    var func = _a.func, source = _a.source, target = _a.target, where = _a.where;
	    var newFuncStr = func.toString();
	    var sliceMode = source !== undefined;
	    if (sliceMode)
	        source = escapeRegExp(getValue(source));
	    target = getValue(target);
	    switch (where) {
	        case "before":
	            if (sliceMode)
	                newFuncStr = "" + target + newFuncStr;
	            else
	                newFuncStr = newFuncStr.replace(new RegExp(source, "g"), "" + target + source);
	            break;
	        case "replace":
	            if (sliceMode)
	                newFuncStr = "" + target;
	            else
	                newFuncStr = newFuncStr.replace(new RegExp(source, "g"), "" + target);
	            break;
	        case "after":
	            if (sliceMode)
	                newFuncStr = "" + newFuncStr + target;
	            else
	                newFuncStr = newFuncStr.replace(new RegExp(source, "g"), "" + source + target);
	            break;
	        default:
	            throw new Error('where Parameter must be "before", "replace" or "after"');
	    }
	    var newFunc = new Function("return (" + newFuncStr + ")")();
	    newFunc.prototype = func.prototype;
	    return newFunc;
	}

	var lol = 6;

	exports.injectCode = injectCode;
	exports.lol = lol;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
