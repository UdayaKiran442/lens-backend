export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
}

export const MODEL_PROVIDERS = {
    OPENAI: 'openai',
    SARVAMAI: 'sarvamai',
}

export const PAYMENT_PLANS = {
    BASIC: {
        plan_name: "basic",
        price: 0,
        currency: "INR",
        description: "For side projects and prototypes",
        days: Infinity,
        log_retention_days: 7,
        logs: 10000
    },
    GROWTH: {
        plan_name: "growth",
        price: 699,
        currency: "INR",
        description: "For teams shipping AI features in production",
        days: 30,
        log_retention_days: 90,
        logs: Infinity
    }
}