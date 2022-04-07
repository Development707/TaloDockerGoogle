class NotFoundError extends Error {
    constructor(message) {
        super();
        this.status = 404;
        this.message = 'Không tìm thấy ' + message;
    }
}

module.exports = NotFoundError;
