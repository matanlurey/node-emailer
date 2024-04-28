#!/usr/bin/env node

import { test, suite } from 'node:test';
import { strict as assert } from 'node:assert';

test('basic class', () => {
  class Animal {
    constructor(name) {
      this.name = name;
    }

    speak() {
      return `I am ${this.name}`;
    }
  }

  const dog = new Animal('Dog');
  assert.equal(dog.speak(), 'I am Dog');
});

test('class with static method', () => {
  class Animal {
    static forTesting() {
      return new Animal('Test');
    }

    constructor(name) {
      this.name = name;
    }

    speak() {
      return `I am ${this.name}`;
    }
  }

  const test = Animal.forTesting();
  assert.equal(test.speak(), 'I am Test');
});

test('class with getters', () => {
  class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    get area() {
      return this.width * this.height;
    }
  }

  const square = new Rectangle(10, 10);
  assert.equal(square.area, 100);
});

test('class with setters and private variables', () => {
  class Order {
    #items = [];

    get items() {
      return this.#items.values();
    }

    set items(value) {
      this.#items = value;
    }
  }

  const order = new Order();
  order.items = ['apple', 'banana'];
  assert.deepEqual([...order.items], ['apple', 'banana']);

  // Show that we can't mutate the returned items.
  const items = order.items;
  assert.throws(() => items.push('cherry'), TypeError);
  assert.deepEqual([...items], ['apple', 'banana']);
  assert.deepEqual([...order.items], ['apple', 'banana']);
});

test('class with inheritance', () => {
  class Animal {
    constructor(name) {
      this.name = name;
    }

    speak() {
      return `I am ${this.name}`;
    }
  }

  class Dog extends Animal {
    constructor() {
      super('Dog');
    }

    speak() {
      return `${super.speak()} and I bark`;
    }
  }

  const dog = new Dog();
  assert.equal(dog.speak(), 'I am Dog and I bark');
});
