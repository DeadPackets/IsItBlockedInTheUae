# IsItBlockedInTheUae
![GitHub](https://img.shields.io/github/license/DeadPackets/IsItBlockedInTheUae)
![GitHub package.json version](https://img.shields.io/github/package-json/v/DeadPackets/IsItBlockedInTheUAE)
![Project status](https://img.shields.io/badge/status-complete-success)

A NodeJS project that allows you to programmatically detect domains that are blocked in the UAE (currently only configured for Etisalat users).

# NOTICE!
1. This program will only work on connections originating from inside the UAE (run the software from a device inside the UAE's network).
2. Mass querying for blocked domains will likely get you flagged by analytic systems inside of the UAE, so use at your own discretion.

## The web app
Inside of `index.js` is an express web app that takes a port to listen on as an argument.

Run it like this:
```bash
node index.js 8080 # Where 8080 is the port to listen on`
```

## The cli app
Inside of `cli.js` is a command line version of the project that takes a file containing domains (each domain being on a new line) as argument. The program will save the blocked domains in a file in the same directory called `results.txt`.

Run it like this:
```bash
node cli.js ./path_to_domain
```
