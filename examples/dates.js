#!/usr/bin/env node

import { test, suite } from 'node:test';
import { strict as assert } from 'node:assert';
import { Temporal } from 'temporal-polyfill';
import 'temporal-polyfill/global';

suite('Date', () => {
  test('create a date', () => {
    // tl;dr: Dates in JS suck.
    const date = new Date(2021, 0, 1);
    date.setUTCHours(0, 0, 0, 0);
    assert.deepEqual(new Date('2021-01-01:00:00.000Z'), date);
  });

  test('get the current date', () => {
    const now = Date.now();
    assert.ok(now > 0);
  });
});

suite('temporal (polyfill)', () => {
  test('get the current date and time', () => {
    // Legacy JS
    const date = new Date();
    assert.match(date.toISOString(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);

    // Temporal
    const now = Temporal.Now.plainDateISO();
    assert.match(now.toString(), /^\d{4}-\d{2}-\d{2}$/);

    // Just the time.
    const nowWithTime = Temporal.Now.plainTimeISO();
    assert.match(nowWithTime.toString(), /^\d{2}:\d{2}:\d{2}.\d{3}$/);
  });

  test('get a unix timestamp', () => {
    // Legacy JS
    const timestamp = Date.now().valueOf();
    assert.ok(timestamp > 0);

    // Temporal
    const now = Temporal.Now.instant();
    assert.ok(now.epochMilliseconds > 0);
  });

  test('convert from Date to Temporal.Instant', () => {
    const date = new Date();
    const instant = date.toTemporalInstant();
    assert.ok(instant.epochMilliseconds > 0);
  });

  test('extract the year/month/date but be timezone aware', () => {
    // Common bug: Dec 31 in SF but Jan 1 in Tokyo.
    const date = new Date(2000, 0, 1);
    const temporal = date.toTemporalInstant().toZonedDateTimeISO('UTC').toPlainDate();
    assert.equal(temporal.year, 2000)
  });

  test('get a person\'s birthday in 2023', () => {
    const date = Temporal.PlainDate.from('2000-01-01');
    const birthday = date.with({ year: 2023 });
    assert.equal(birthday.toString(), '2023-01-01');
  });

  test('serialization', () => {
    // Serialize an exact time.
    const time = Temporal.Now.instant();
    assert.deepEqual(time, Temporal.Instant.from(time.toString()));
  });

  test('sorting', () => {
    const dates = [
      Temporal.PlainDate.from('2000-01-01'),
      Temporal.PlainDate.from('2001-01-01'),
      Temporal.PlainDate.from('2000-01-02'),
    ];

    dates.sort(Temporal.PlainDate.compare);
    assert.deepEqual(dates.map((d) => d.toString()), ['2000-01-01', '2000-01-02', '2001-01-01']);
  });

  test('rounding', () => {
    // Round down to the previously occuring whole hour.
    const time = Temporal.Now.instant();
    const rounded = time.round({ smallestUnit: 'hour', roundingMode: 'floor' });
    assert.ok(rounded.epochMilliseconds < time.epochMilliseconds);
  });

  test('how many days until a future date', () => {
    // Start with January 1st 2024.
    const date = Temporal.PlainDate.from('2024-01-01');

    // Calculate the number of days until December 25th.
    const future = Temporal.PlainDate.from('2024-12-25');
    const days = date.until(future).total({ unit: 'days' });
    assert.equal(days, 359);
  });

  test('something "2 days ago"', () => {
    const date = new Temporal.PlainDate(2023, 8, 4);
    const twoDaysAgo = date.subtract({ days: 2 });
    const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const timeAgo = relativeTimeFormatter.format(date.until(twoDaysAgo).total({ unit: 'day' }), 'day');

    assert.equal(timeAgo, '2 days ago');
  });
});
