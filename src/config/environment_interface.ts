/**
 * Setting service with environment variables
 */
export default interface Environment {
    mongodb: {
        host: string,
        db_name: string,
        user: string,
        pass: string
    }
}