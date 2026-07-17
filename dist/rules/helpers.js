"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRange = void 0;
function checkRange(value, range, messages, lowStatus = "warning") {
    if (value > range.max)
        return { status: "warning", message: messages.tooHigh };
    if (value < range.min)
        return { status: lowStatus, message: messages.tooLow };
    return { status: "good", message: messages.inRange };
}
exports.checkRange = checkRange;
//# sourceMappingURL=helpers.js.map