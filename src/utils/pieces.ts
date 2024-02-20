/**
 * @file The bag of pieces of functions for simple functions.
 * @description This file contains many simple functions which are used in the application.
 */

/**
 * Generates a random string of a given length.
 * The generated string consists of uppercase and lowercase letters, and digits.
 * 
 * @param length    The length of the string to be generated.
 * @returns         A random string of the specified length.
 * 
 * @example genRandomString(10) => 'aBcDeFgHiJ'
 */
export const genRandomString = (length: number): string => {
    let sResult = '';
    const sPossibles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        sResult += sPossibles.charAt(Math.floor(Math.random() * sPossibles.length));
    }
    return sResult;
};

/**
 * Generates a random number-string of a given length.
 * The generated string consists of uppercase and lowercase letters, and digits.
 * 
 * @param length    The length of the number-string to be generated.
 * @returns         A random number-string of the specified length.
 * 
 * @example genRandomStringOfNumber(10) => 'aBcDeFgHiJ'
 */
export const genRandomStringOfNumber = (length: number): string => {
    let sResult = '';
    const sPossibles = '0123456789';

    for (let i = 0; i < length; i++) {
        sResult += sPossibles.charAt(Math.floor(Math.random() * sPossibles.length));
    }
    return sResult;
};

/**
 * Parse a stringified JSON in safely.
 * 
 * @param json  Stringified JSON
 * @returns     Parsed JSON or the original string if parsing fails
 * 
 * @example safelyParseJSON('{"a": 1}') => { a: 1 }
 */
export const safelyParseJSON = function (json: string) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        parsed = null;
    } finally {
        if (parsed === null || typeof parsed === 'undefined') {
            parsed = json;
        }
    }
    return parsed;
};

/**
 * Validate an email address.
 * 
 * @param email email address to validate
 * @returns     true if the email is valid, false otherwise
 * 
 * @example isValidEmail('@example1.com') => false
 * @example isValidEmail('test@example1.com') => true
 */
export const isValidEmail = function (email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}