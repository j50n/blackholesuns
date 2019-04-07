interface ITripStatus {
    cancelled: boolean;
    tries: number;
}

class CancelledError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export { CancelledError, ITripStatus };
