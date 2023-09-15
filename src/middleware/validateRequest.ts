const validationMiddleware = (req: any, res: any, next: any) => {
    // Validation checks here
    const { method, query, body, headers } = req;

    // Validate HTTP method
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
        return res.status(405).json({ error: 'Method not allowed' });
    }


    // Validate request headers if necessary
    // For example, check for authentication tokens

    // Validate request body if necessary
    // For example, ensure certain fields are present and have valid data

    // If all validation passes, proceed to the next middleware or route handler
    next();
};

export default validationMiddleware;