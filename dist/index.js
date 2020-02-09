(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.CCL = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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
        var sliceMode = source === undefined;
        var regex;
        if (!sliceMode) {
            source = getValue(source);
            regex = new RegExp(escapeRegExp(source), "g");
        }
        target = getValue(target);
        var findStart = /\)\s+{/;
        switch (where) {
            case "before":
                if (sliceMode)
                    newFuncStr = newFuncStr.replace(findStart, ") {" + target);
                else
                    newFuncStr = newFuncStr.replace(regex, "" + target + source);
                break;
            case "replace":
                if (sliceMode)
                    newFuncStr = "" + target;
                else
                    newFuncStr = newFuncStr.replace(regex, "" + target);
                break;
            case "after":
                if (sliceMode)
                    throw new Error("Yikes, can't add to end!");
                else
                    newFuncStr = newFuncStr.replace(regex, "" + source + target);
                break;
            default:
                throw new Error('where Parameter must be "before", "replace" or "after"');
        }
        var newFunc = new Function("return (" + newFuncStr + ")")();
        newFunc.prototype = func.prototype;
        return newFunc;
    }

    function main() {
        var Injection = /** @class */ (function () {
            function Injection(value, defValue, func) {
                this.value = value;
                this.defValue = defValue;
                this.func = func;
            }
            return Injection;
        }());
        var dummy = {};
        var injections = [
            new Injection("customMenu", [], function () {
                window.Game.UpdateMenu = injectCode({
                    func: window.Game.UpdateMenu,
                    where: "before",
                    target: "\n\t\t\t\t\t// CCLib\n\t\t\tswitch (Game.onMenu) {\n\t\t\t\tcase \"prefs\":\n\t\t\t\t\tfor(const i in CCL.customOptionsMenu) CCL.customOptionsMenu[i]();\n\t\t\t\t\tbreak;\n\t\t\t\tcase \"stats\":\n\t\t\t\t\tfor(const i in CCL.customStatsMenu) CCL.customStatsMenu[i]();\n\t\t\t\t\tbreak;\n\t\t\t\tcase \"log\":\n\t\t\t\t\tfor(const i in CCL.customInfoMenu) CCL.customInfoMenu[i]();\n\t\t\t\t\tbreak;\n\t\t\t\tdefault:\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t\tfor(const i in CCL.customMenu) CCL.customMenu[i]();",
                });
            }),
            new Injection("customOptionsMenu", []),
            new Injection("customStatsMenu", []),
            new Injection("customInfoMenu", []),
            new Injection("customInfoMenu", []),
            new Injection("customLoad", [], function () {
                window.Game.LoadSave = injectCode({
                    func: window.Game.LoadSave,
                    source: "if (Game.prefs.showBackupWarning==1)",
                    where: "before",
                    target: "\n\t\t\t// CCLib\n\t\t\tfor(const i in CLL.customLoad) CLL.customLoad[i](); ",
                });
            }),
        ];
        injections.forEach(function (inject) {
            dummy[inject.value] = inject.defValue;
            if (inject.func)
                inject.func();
        });
        return dummy;
    }

    var lol = 6;
    var custom = {};
    if (!window.CCLInit) {
        window.CCLInit = true;
        custom = main();
    }
    var master = __assign(__assign({}, custom), { lol: lol,
        injectCode: injectCode });

    return master;

})));
//# sourceMappingURL=index.js.map
