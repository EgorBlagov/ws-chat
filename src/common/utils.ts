export function safeGet<T, K>(target: T, get: (target: T) => K, defaultResult?: K): K | undefined {
    try {
        return get(target);
    } catch {
        return defaultResult;
    }
}

export function isOk(object: any): boolean {
    return object !== undefined && object !== null && object !== "null";
}
