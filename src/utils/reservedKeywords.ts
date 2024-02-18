/**
 * @description This file contains all the constants used in the application
 * 
 * freeze and const are used to make the object immutable
 * but there is difference between them
 * The const just limits to change address of the variable.
 * The freeze makes the object or variable immutable.
 * 
 * like...
 * 
 * const obj = { a: 1 }
 * obj.a = 2 // valid
 * 
 * let obj = Object.freeze({ a: 1 })
 * obj.a = 2 // invalid
 */
const reservedKeywords = Object.freeze({
    userStatusEnum: ['inactive', 'active', 'deleted'],
});

// ES6 modeule export
export default reservedKeywords;