#!/usr/bin/env node

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Command, Option } from 'commander';

test('no arguments', () => {
  const program = new Command();
  program.parse([]);
  assert.equal(program.args.length, 0);
});

test('one required positional argument', () => {
  const program = new Command();
  program.argument('<name>')
  program.exitOverride();

  // Throws if the argument is missing
  assert.throws(() => {
    program.parse([], { from: 'user' });
  });

  program.parse(['John'], { from: 'user' });
  const [name] = program.args;
  assert.equal(name, 'John');
});

test('one optional positional argument', () => {
  const program = new Command();
  program.argument('[name]')
  program.exitOverride();

  program.parse([], { from: 'user' });
  const [name] = program.args;
  assert.equal(name, undefined);
});

test('required named argument', () => {
  const program = new Command();
  program.requiredOption('--name <name>');
  program.exitOverride();

  // Throws if the argument is missing
  assert.throws(() => {
    program.parse([], { from: 'user' });
  });

  program.parse(['--name', 'John'], { from: 'user' });
  assert.equal(program.opts().name, 'John');
});

test('optional named argument', () => {
  const program = new Command();
  program.option('--name [name]');
  program.exitOverride();

  program.parse([], { from: 'user' });
  assert.equal(program.opts().name, undefined);
});

test('flag which defaults to false', () => {
  const program = new Command();
  program.option('--force', '', false);
  program.exitOverride();

  program.parse([], { from: 'user' });
  assert.equal(program.opts().force, false);
});

test('flag which defaults to false but is set to true', () => {
  const program = new Command();
  program.option('--force', '', false);
  program.exitOverride();

  program.parse(['--force'], { from: 'user' });
  assert.equal(program.opts().force, true);
});

test('flag which defaults to true', () => {
  const program = new Command();
  program.option('--force', '', true);
  program.exitOverride();

  program.parse([], { from: 'user' });
  assert.equal(program.opts().force, true);
});

test('flag which defaults to true but is set to false', () => {
  const program = new Command();
  program.option('--force', '', true);
  program.option('--no-force');
  program.exitOverride();

  program.parse(['--no-force'], { from: 'user' });
  assert.equal(program.opts().force, false);
});

test('option with an enum (red/blue/green)', () => {
  const program = new Command();
  program.addOption(new Option('--color <color>')
    .choices(['red', 'blue', 'green'])
    .default('red'));
  program.exitOverride();

  program.parse([], { from: 'user' });
  assert.equal(program.opts().color, 'red');

  program.parse(['--color', 'blue'], { from: 'user' });
  assert.equal(program.opts().color, 'blue');
});
