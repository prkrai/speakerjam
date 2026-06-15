"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieOptions = getCookieOptions;
function getCookieOptions() {
    return {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    };
}
