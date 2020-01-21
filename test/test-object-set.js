/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const ObjectSet = require('../object-set.js')

describe('ObjectSet', () => {
  let set, obj1, obj2
  beforeEach(() => {
    set = new ObjectSet()
    obj1 = { a: 1, b: 2 }
    obj2 = { c: 3, d: 4 }
    set.add(obj1)
    set.add(obj2)
  })
  describe('ObjectSet#constructor', () => {
    it('creates a new empty set', () => {
      const set = new ObjectSet()
      expect(set).to.be.instanceof(ObjectSet)
    })
    it('creates an empty set when initial iterable is null', () => {
      const set = new ObjectSet()
      expect(set.set.size).to.equal(0)
      expect(set.size).to.equal(0)
    })
    it('creates a set from an array', () => {
      const arr = [obj1, obj2]
      const set = new ObjectSet(arr)
      expect(set.size).to.equal(2)
      expect(Array(...set)).to.eql([obj1, obj2])
    })
  })
  describe('ObjectSet#add', () => {
    it('adds a new object to the set', () => {
      const obj3 = { x: 10, y: 20 }
      expect(set.size).to.equal(2)
      set.add(obj3)
      expect(set.size).to.equal(3)
      expect(set.has(obj3)).to.equal(true)
    })
  })
  describe('ObjectSet#clear', () => {
    it('removes all objects from the set', () => {
      expect(set.size).to.equal(2)
      set.clear()
      expect(set.size).to.equal(0)
    })
    it('removes all objects even if set is empty', () => {
      const set = new Set()
      set.clear()
      expect(set.size).to.equal(0)
    })
  })
  describe('ObjectSet#delete', () => {
    it('removes an object from a set', () => {
      expect(set.delete(obj1)).to.equal(true)
      expect(set.has(obj1)).to.equal(false)
      expect(set.size).to.equal(1)
    })
    it('does nothing if object does not exist in set', () => {
      const obj3 = { x: 10, y: 20 }
      expect(set.delete(obj3)).to.equal(false)
      expect(set.size).to.equal(2)
    })
    it('returns the value ObjectSet.has would have previously returned', () => {
      const obj3 = { x: 10, y: 20 }
      expect(set.delete(obj1)).to.equal(true)
      expect(set.delete(obj1)).to.equal(false)
      expect(set.delete(obj3)).to.equal(false)
    })
  })
  describe('ObjectSet#entries', () => {
    it('returns an Iterator', () => {
      const entries = set.entries()
      expect(typeof entries[Symbol.iterator]).to.equal('function')
      expect(entries[Symbol.iterator]()).to.have.property('next')
    })
    it('contains an array of [value, value] for each element', () => {
      const entries = Array(...set.entries())
      expect(entries).to.have.property('length', 2)
      expect(entries[0][0]).to.eql(entries[0][1])
      expect(entries[1][0]).to.eql(entries[1][1])
    })
  })
  describe('ObjetSet#keys', () => {
    it('returns an Iterator', () => {
      const result = set.keys()
      expect(typeof result[Symbol.iterator]).to.equal('function')
      expect(result[Symbol.iterator]()).to.have.property('next')
    })
    it('iterates keys for each element', () => {
      const keys = Array(...set.keys())
      expect(keys).to.have.property('length', 2)
      expect(keys[0]).to.equal(obj1)
      expect(keys[1]).to.equal(obj2)
    })
  })
  describe('ObjetSet#values', () => {
    it('returns an Iterator', () => {
      const result = set.values()
      expect(typeof result[Symbol.iterator]).to.equal('function')
      expect(result[Symbol.iterator]()).to.have.property('next')
    })
    it('iterates keys for each element', () => {
      const values = Array(...set.values())
      expect(values).to.have.property('length', 2)
      expect(values[0]).to.equal(obj1)
      expect(values[1]).to.equal(obj2)
    })
  })
  describe('ObjectSet#forEach', () => {
    it('calls callbackFn once for each value in the set', () => {
      const callbackFn = sinon.stub().returns()
      set.forEach(callbackFn)
      sinon.assert.callCount(callbackFn, 2)
      sinon.assert.calledWith(callbackFn.firstCall, obj1)
      sinon.assert.calledWith(callbackFn.secondCall, obj2)
    })
  })
  describe('ObjectSet#has', () => {
    it('returns true if object exists in set', () => {
      const obj = { a: 1, b: 2 }
      expect(set.has(obj)).to.equal(true)
    })
    it('returns false if object does not exist in set', () => {
      const obj = { a: 7, b: 8 }
      expect(set.has(obj)).to.equal(false)
    })
  })
  describe('ObjetSet#Iterator', () => {
    it('returns an Iterator', () => {
      expect(typeof set[Symbol.iterator]).to.equal('function')
      expect(set[Symbol.iterator]()).to.have.property('next')
    })
    it('iterates keys for each element', () => {
      const values = Array(...set)
      expect(values).to.have.property('length', 2)
      expect(values[0]).to.equal(obj1)
      expect(values[1]).to.equal(obj2)
    })
  })
  describe('ObjectSet#union', () => {
    let union, obj3, obj4
    beforeEach(() => {
      obj3 = { x: 10, y: 20 }
      obj4 = { u: 100, v: 200 }
      const secondSet = new Set([obj2, obj3, obj4])
      union = set.union(secondSet)
    })
    it('creates a set with the union of two other sets', () => {
      expect(union.has(obj1)).to.equal(true)
      expect(union.has(obj2)).to.equal(true)
      expect(union.has(obj3)).to.equal(true)
      expect(union.has(obj4)).to.equal(true)
    })
    it('does not contain duplicates', () => {
      expect(union.size).to.equal(4)
    })
  })
  describe('ObjectSet#Intersection', () => {
    it('creates a set that is the intersection of two other sets', () => {
      const obj3 = { x: 10, y: 20 }
      const secondSet = new Set([obj2, obj3])
      const intersection = set.intersection(secondSet)
      expect(intersection.size).to.equal(1)
      expect(intersection.has(obj1)).to.equal(false)
      expect(intersection.has(obj2)).to.equal(true)
      expect(intersection.has(obj3)).to.equal(false)
    })
    it('returns empty set if no intersection occurs', () => {
      const obj3 = { x: 10, y: 20 }
      const secondSet = new Set([obj3])
      const intersection = set.intersection(secondSet)
      expect(intersection.size).to.equal(0)
    })
  })
  describe('ObjectSet#difference', () => {
    it('creates a set that is the difference with another other set', () => {
      const obj3 = { x: 10, y: 20 }
      const secondSet = new Set([obj2, obj3])
      const difference = set.difference(secondSet)
      expect(difference.size).to.equal(1)
      expect(difference.has(obj1)).to.equal(true)
      expect(difference.has(obj2)).to.equal(false)
      expect(difference.has(obj3)).to.equal(false)
    })
    it('returns empty set if no difference occurs', () => {
      const difference = set.difference(set)
      expect(difference.size).to.equal(0)
    })
  })
})
