
class Validation {
    static validateMethod(req: any, allowedMethods: any) {
        const { method } = req;
        if (!allowedMethods.includes(method)) {
            throw new Error('Method not allowed');
        }
    }

    static validateQueryParameters(req: any, parameterRules: any) {
        const { query } = req;

        for (const parameter in parameterRules) {
            const rule = parameterRules[parameter];
            const value = query[parameter];

            if (rule.required && !value) {
                throw new Error(`${parameter} is required`);
            }

            if (rule.validate && !rule.validate.test(value)) {
                throw new Error(`Invalid value for ${parameter}`);
            }
        }
    }

    static validateHeaders(req: any, headerRules: any) {
        const { headers } = req;

        for (const header in headerRules) {
            const rule = headerRules[header];
            const value = headers[header];

            if (rule.required && !value) {
                throw new Error(`${header} header is required`);
            }

            if (rule.validate && !rule.validate.test(value)) {
                throw new Error(`Invalid value for ${header} header`);
            }
        }
    }

    static validateBody(req: any, bodyRules: any) {
        const { body } = req;

        for (const field in bodyRules) {
            const rule = bodyRules[field];
            const value = body[field];

            if (rule.required && !value) {
                throw new Error(`${field} is required in the request body`);
            }

            if (rule.validate && !rule.validate.test(value)) {
                throw new Error(`Invalid value for ${field} in the request body`);
            }
        }
    }
}

export default Validation;
