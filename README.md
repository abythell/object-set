# ObjectSet - Like Set, but for Objects

A Node.js module for working with sets of Objects.  

ObjetSet has all the same methods and properties as
[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).
It has a few handy bonus methods too:  intersection(), difference(), and union().
If you want to read full documentation, run `npm run doc`.

## Examples

```
const ObjectSet = require('ab-object-set')

const obj1 = {a: 1, b: 1}
const obj2 = {a: 2, b: 2}
const obj3 = {a: 3: b: 3}

// create a new set and add objects one by one
const set = new ObjectSet()
set.add(obj1)
set.add(obj2)

// .. or all all one time
set = new ObjectSet([obj1, obj2, obj3])

// objects don't get added if they have the same hash as existing objects
set.has(obj1) // => true
set.size // => 3
set.add(obj1) // does nothing, obj1 is already part of the set
set.delete(obj1) // => true
set.size // => 2
set.add(obj1) // adds it back again
set.size // => 3

// ObjectSet is an Iterator, which is also returned by keys() and values(), just
// like Set
Array(...set) // => [obj1, obj2, obj3]
Array(...set.values()) // => [obj1, obj2, obj3]
Array(...set.keys()) // => [obj1, obj2, obj3]

// Bonus methods
const set1 = new ObjectSet([obj1, obj2])
const set2 = new ObjectSet([obj2, obj1])

Array(...set1.union(set2)) // => [obj1, obj2, obj3]
Array(...set1.intersection(set2)) // => [obj2]
Array(...set1.difference(set2)) // => [obj1]
Array(...set2.difference(set1)) // => [obj3]

```

## ObjectSet vs Set
Unlike Set, ObjectSet uses object hashes to handle value equality.  

```
const obj1 = { a: 1, b: 2 }
const obj2 = { a: 1, b: 2 }

// With Set, obj1 !== obj2, so both get added to the set.
obj1 === obj2 // => false
const set = new Set([obj1, obj2]) // set.size = 2

// With ObjectSet, obj1 and obj2 are considered to be the same
hash(obj1) === hash(obj2) // => true
const objSet = new ObjectSet([obj1, obj2]) // set.size = 1

```
