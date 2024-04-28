# `node-emailer`

A sample project to review some concepts for backend Node.js development:

- [ ] Asynchronous programming (promises, `async`/`await`)
- [ ] Data structures (arrays, objects, sets, maps)
- [ ] HTTP requests (`fetch`)
- [ ] Templating (template literals)
- [ ] Command-line arguments (`yargs`)
- [ ] Email-sending (`nodemailer`)
- [ ] Task scheduling (`node-cron`)
- [ ] Testing (<https://nodejs.org/docs/latest-v20.x/api/test.html>)

## Usage

This is a command-line application.

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm start -- --help` to see the available commands.

```shell
# Generates random data for testing and prints the result to the console.
npm start -- \
  --output console \
  --input random

# Sends an email with random data.
SMTP=stmp://user:password@host:port \
    npm start -- \
      --output email \
      --input random
```
