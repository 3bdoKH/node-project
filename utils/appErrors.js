class AppError extends Error {
    constructor() {
        super()
    }
    create(message, code, text) {
        this.message = message
        this.code = code
        this.text = text
        return this
    }
}
module.exports = new AppError()