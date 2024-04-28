#!/usr/bin/env node

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  jsonTransport: true
});

test('send email', async () => {
  let info = await transporter.sendMail({
    from: 'sender@email.com',
    to: 'receiver@email.com',
    subject: 'Hello',
    text: 'Hello, World!'
  });

  assert.ok(info.messageId);
});

test('send email with HTML', async () => {
  let info = await transporter.sendMail({
    from: 'sender@email.com',
    to: 'receiver@email.com',
    subject: 'Hello',
    html: '<strong>Hello, World!</strong>'
  });

  assert.ok(info.messageId);
  assert.ok(info.message.toString().includes('<strong>Hello, World!</strong>'));
});
