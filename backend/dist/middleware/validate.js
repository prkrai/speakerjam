"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
function validateBody(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const error = new Error('Validation failed');
            error.statusCode = 400;
            error.details = result.error.flatten();
            return next(error);
        }
        req.body = result.data;
        next();
    };
}
