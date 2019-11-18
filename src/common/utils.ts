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

export function toMsg(err: any): string {
    try {
        if (err.message !== undefined) {
            return err.message;
        }

        if (err.error !== undefined) {
            return err.error;
        }

        if (typeof err === "string") {
            return err;
        }
    } catch {}
    return "Unknown error";
}
