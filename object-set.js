const hash = require('object-hash')

/**
 * A class similar to Set(), but one that works on
 * Objects.  "Value Equality" is accomplished by comparing
 * hashed versions of the Objects.
 * @author Andrew Bythell <abythel@ieee.org>
 * @class
 */
class ObjectSet {
  /**
   * @constructor
   * @param {iterable[]} [iterable] - If an iterable object is passed, all of
   * its elements will be added to the new ObjectSet.  If you don't specifiy
   * this parameter, or its value is null, the new ObjectSet is empty.
   * @returns {ObjetSet} A new ObjectSet object.
   */
  constructor (iterable) {
    this.set = new Set() // Set will store hashes and maintain insertion order
    this.data = {} // Named array to store objects.  Key is object hash.
    if (iterable) {
      Array(...iterable).forEach(item => this.add(item))
    }
  }

  /**
   * Create a hash from an object
   * @private
   * @param {Object} obj
   * @returns {string}
   */
  hash (obj) {
    // const hash = crypto.createHash('sha1')
    // return hash.update(JSON.stringify(obj)).digest('hex')
    return hash(obj)
  }

  /**
   * Returns the number of values in the ObjectSet.
   * @member {number}
   */
  get size () {
    return this.set.size
  }

  /**
   * Append a new element with the given value to the
   * ObjectSet.
   * @param {Object} obj
   * @returns {ObjectSet}
   */
  add (obj) {
    const key = this.hash(obj)
    this.data[key] = obj
    this.set.add(key)
    return this
  }

  /**
   * Removes all elements from the ObjectSet
   */
  clear () {
    this.data = {}
    this.set.clear()
  }

  /**
   * Removes the element associated to the value and returns the value that
   * ObjectSet.has(value) would have previously returned.  ObjectSet.has(value)
   * will return false afterwards
   * @param {Object} obj
   * @returns {boolean}
   */
  delete (obj) {
    const key = this.hash(obj)
    delete this.data[key]
    return this.set.delete(key)
  }

  /**
   * This is similar to Map so that each entry's key is the same as its value.
   * @returns {Iterator} that contains an array of [obj, obj] for each element
   * in the ObjectSet, in insertion order.
   */
  entries () {
    return {
      [Symbol.iterator]: () => {
        const setIterator = this.set[Symbol.iterator]()
        return {
          next: () => {
            const { value, done } = setIterator.next()
            const obj = this.data[value]
            return {
              value: [obj, obj],
              done: done
            }
          }
        }
      }
    }
  }

  /**
   * Calls callbackFn once for each object present in the ObjectSet, in insertion
   * order.  If a thisArg paramater is provided to forEach, it will be used as the
   * this value for each callback.
   * @param {function} callbackFn
   * @param {Object} [thisArg]
   */
  forEach (callbackFn, thisArg) {
    const values = Array(...this.values())
    values.forEach((value) => {
      callbackFn(value, thisArg)
    })
  }

  /**
   * @param {Object} obj
   * @returns {boolean} Asserts whether an object is present in the ObjectSet
   * or not.
   */
  has (obj) {
    return this.set.has(this.hash(obj))
  }

  /**
   * Is the same function as the values() function.
   * @returns {Iterator} that contains the objects in the ObjectSet, in
   * insertion order
   */
  keys () {
    return this
  }

  /**
   * @returns {Iterator} that contains the objects in the ObjectSet, in
   * insertion order
   */
  values () {
    return this
  }

  /**
   * @returns {Iterator} that contains the objects in the ObjetSet, in
   * insertion order
   */
  [Symbol.iterator] () {
    const setIterator = this.set[Symbol.iterator]()
    return {
      next: () => {
        const { value, done } = setIterator.next()
        return {
          value: this.data[value],
          done: done
        }
      }
    }
  }

  /**
   * Create an ObjectSet the contains the elements of both.
   * @param {ObjectSet} objectSet
   * @returns {ObjectSet}
   */
  union (that) {
    return new ObjectSet([...this, ...that])
  }

  /**
   * Create an ObjectSet that contains objects of this set that are also
   * in that set.
   * @param {ObjectSet} objectSet
   * @returns {ObjectSet}
   */
  intersection (thatSet) {
    const thisArray = Array(...this.values())
    const intersectionArray = thisArray.filter(obj => thatSet.has(obj))
    return new ObjectSet(intersectionArray)
  }

  /**
   * Create a set that contains objects in this set that are not in
   * that set.
   * @param {ObjectSet} objectSet
   * @returns {ObjectSet}
   */
  difference (thatSet) {
    const thisArray = Array(...this.values())
    const diffArray = thisArray.filter(obj => !thatSet.has(obj))
    return new ObjectSet(diffArray)
  }
} // class

module.exports = ObjectSet
