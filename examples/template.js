#!/usr/bin/env node

import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('a simple template literal', () => {
  const name = 'World';
  assert.equal(`Hello, ${name}!`, 'Hello, World!');
});

test('a simple tagged template literal', () => {
  const tag = (strings, ...values) => {
    return strings[0] + values[0] + strings[1];
  }

  const name = 'World';
  assert.equal(tag`Hello, ${name}!`, 'Hello, World!');
});

test('a tagged template literal that generates an HTML email', () => {
  const html = (strings, ...values) => {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
      result += values[i] + strings[i + 1];
    }
    return result;
  };

  const email = (options) => {
    const { user, tickets, event, date } = options;
    if ([user, tickets, event, date].some((value) => !value)) {
      throw new Error('Missing required option');
    }
    return html`
      <html>
        <body>
          <h1>Welcome to BuzzTix ${user}</h1>

          <p>
            You have ${tickets} tickets to see ${event} on ${date}.
          </p>
        </body>
      </html>
    `;
  };

  const example = email({
    user: 'John Doe',
    tickets: 2,
    date: '2024-12-25',
    event: 'The Nutcracker'
  });

  assert.ok(example.includes('John Doe'));
  assert.ok(example.includes('2 tickets'));
  assert.ok(example.includes('The Nutcracker'));
  assert.ok(example.includes('2024-12-25'));
});
