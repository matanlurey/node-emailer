#!/usr/bin/env node

import { test, suite } from 'node:test';
import { strict as assert } from 'node:assert';

suite('arrays', () => {
  test('create an empty array', () => {
    assert.deepEqual([], new Array());
  });

  test('creates an array from an array-like object', () => {
    assert.deepEqual([1, 2, 3], Array.from({ length: 3 }, (_v, i) => i + 1));
  });

  test('creates an array from an iterable object', () => {
    assert.deepEqual([1, 2, 3], Array.from('123', ((v, _k) => parseInt(v))));
  });

  test('creates an array from a variable number of arguments', () => {
    assert.deepEqual([1, 2, 3], Array.of(1, 2, 3));
  });

  test('checks if something is an Array', () => {
    assert.ok(Array.isArray([]));
    assert.ok(!Array.isArray({}));
    assert.ok(!Array.isArray(new Int16Array()));
  });

  test('`at` handles rotation', () => {
    const array = [1, 2, 3, 4, 5];
    assert.equal(array.at(-1), 5);
  });

  test('find a specific element', () => {
    const array = [1, 2, 3, 4, 5];

    assert.ok(array.includes(3));
    assert.equal(array.find((v) => v % 2 === 0), 2);
    assert.equal(array.findIndex((v) => v % 2 === 0), 1);
    assert.equal(array.findLast((v) => v % 2 === 0), 4);
    assert.equal(array.findLastIndex((v) => v % 2 === 0), 3);
  });

  test('flatten an array', () => {
    assert.deepEqual([1, 2, 3, 4, 5], [1, [2, 3], [4, [5]]].flat(Infinity));
  });

  test('apply a function and flatten the result', () => {
    assert.deepEqual([2, 4, 6], [[1], [2], [3]].flatMap((v) => v.map((v) => v * 2)));
  });

  test('add to the beginning', () => {
    const array = [1, 2, 3];
    array.unshift(0);
    assert.deepEqual([0, 1, 2, 3], array);
  });

  test('add to the end', () => {
    const array = [1, 2, 3];
    array.push(4);
    assert.deepEqual([1, 2, 3, 4], array);
  });

  test('remove from the beginning', () => {
    const array = [1, 2, 3];
    array.shift();
    assert.deepEqual([2, 3], array);
  });

  test('remove from the end', () => {
    const array = [1, 2, 3];
    array.pop();
    assert.deepEqual([1, 2], array);
  });

  test('reduce an array', () => {
    const array = [1, 2, 3];
    assert.equal(6, array.reduce((acc, v) => acc + v, 0));
  });

  test('reduce an array right-to-left', () => {
    const array = [1, 2, 3];
    assert.equal('321', array.reduceRight((acc, v) => acc + v, ''));
  });

  test('slice an array', () => {
    const array = [1, 2, 3, 4, 5];
    assert.deepEqual([2, 3], array.slice(1, 3));
  });
});

suite('objects', () => {
  test('create an empty object', () => {
    assert.deepEqual({}, new Object());
  });

  test('copies properties from one object to another', () => {
    const source = { a: 1, b: 2 };
    const target = { c: 3 };

    assert.deepEqual({ a: 1, b: 2, c: 3 }, Object.assign(target, source));
  });

  test('creates a new object from an existing object', () => {
    const person = {
      isHungry: true,
      eat() {
        this.isHungry = false;
      },
    };

    const newPerson = Object.create(person);
    assert.ok(newPerson.isHungry);

    newPerson.eat();
    assert.ok(!newPerson.isHungry);
  });

  test('freezes an object', () => {
    const object = Object.freeze({ a: 1, b: 2 });

    assert.throws(() => {
      object.a = 3;
    }, TypeError);
  });

  test('prevents extensions to an object', () => {
    const object = Object.preventExtensions({ a: 1, b: 2 });

    assert.throws(() => {
      object.c = 3;
    }, TypeError);
  });

  test('gets the keys of an object', () => {
    assert.deepEqual(['a', 'b'], Object.keys({ a: 1, b: 2 }));
  });
});

suite('sets', () => {
  test('create an empty set', () => {
    assert.deepEqual(new Set(), new Set([]));
  });

  test('diffs two sets', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);

    assert.deepEqual(new Set([1]), a.difference(b));
  });

  test('intersects two sets', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);

    assert.deepEqual(new Set([2, 3]), a.intersection(b));
  });

  test('disjoints two sets', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([4, 5, 6]);

    assert.ok(a.isDisjointFrom(b));
  });

  test('is a subset of another set', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([1, 2, 3, 4]);

    assert.ok(a.isSubsetOf(b));
  });

  test('is a superset of another set', () => {
    const a = new Set([1, 2, 3, 4]);
    const b = new Set([1, 2, 3]);

    assert.ok(a.isSupersetOf(b));
  });

  test('symmetric difference of two sets', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);

    assert.deepEqual(new Set([1, 4]), a.symmetricDifference(b));
  });

  test('unions two sets', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);

    assert.deepEqual(new Set([1, 2, 3, 4]), a.union(b));
  });
});

suite('maps', () => {
  // Are so basic it's not worth documenting here.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
});

