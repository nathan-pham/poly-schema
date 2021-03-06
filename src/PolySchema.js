import PolyTypes from "./PolyTypes.js";

/** @file src/PolySchema.js */

/**
 * PolySchema class for defining & validating information
 * @class
 * @example
 * const schema = new PolySchema({
 *     _id: PolyTypes.string
 * })
 */
class PolySchema {
    /**
     * create a new PolySchema
     * @param {object} schema - json of keys to PolyTypes
     */
    constructor(schema = {}) {
        this.schema = schema;
    }

    /**
     * determine if a object is valid according to the schema
     * @param {object} T - object to validate
     * @param {boolean} strict - if props should be required
     * @returns {boolean}
     * @example
     * schema.validate({
     *     _id: "Hello World"
     * }) // => true
     */
    validate(T, strict = false) {
        /**
         * determine if anything is an object
         * @param {any} T - literally anything
         * @returns {boolean}
         */
        const isObject = (T) => typeof T === "object" && T !== null && !PolyTypes.array(T);

        /**
         * determine if subset of this.schema is valid
         * @param {object} schema - subset of this.schema
         * @param {any} T - literally anything
         * @returns {boolean}
         */
        const core = (schema, T) => {
            // check if exactly equal
            if (schema === T) {
                return true;
            }

            // loop through T
            if (strict) {
                for (const [key, condition] of Object.entries(T)) {
                    if (!(T.hasOwnProperty(key) && schema.hasOwnProperty(key))) {
                        return false;
                    }
                }
            }

            // loop through schema
            for (const [key, condition] of Object.entries(schema)) {
                if (T.hasOwnProperty(key)) {
                    if (isObject(condition)) {
                        return core(schema[key], T[key]);
                    } else if (!condition(T[key])) {
                        return false;
                    }
                } else if (strict) {
                    return false;
                }
            }

            return true;
        };

        return isObject(T) ? core(this.schema, T) : false;
    }
}

export default PolySchema;
