#!/usr/bin/env node

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { z } from 'zod';

test('email validation', () => {
  const email = z.string().email();
  assert.ok(email.parse('john@doe.com'));
  assert.throws(() => email.parse('john@doe'));
});

test('url validation', () => {
  const url = z.string().url();
  assert.ok(url.parse('https://example.com'));
  assert.throws(() => url.parse('example.com'));
});

test('form validation', () => {
  // Imagine a form with:
  //   name  (minumum 1 char, max 100)
  //   email (must be an email)
  //   age   (must be a number between 18 and 99)
  const form = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    age: z.number().min(18).max(99)
  });

  assert.ok(form.parse({
    name: 'John Doe',
    email: 'john@doe.com',
    age: 25
  }));

  assert.throws(() => form.parse({
    name: 'John Doe',
    email: 'john@doe.com',
    age: 17
  }));
});
