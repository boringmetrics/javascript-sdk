# Boring Metrics JavaScript SDK

This is a JavaScript SDK for the Boring Metrics API. It provides a simple and efficient way to interact with the API from your JavaScript applications.

## Supported Platforms

The SDK is available for the following platforms:

- [`@boringmetrics/browser`](https://github.com/boringmetrics/javascript-sdk/tree/main/packages/browser): SDK for Browsers
- [`@boringmetrics/node`](https://github.com/boringmetrics/javascript-sdk/tree/main/packages/node): SDK for Node
- [`@boringmetrics/react`](https://github.com/boringmetrics/javascript-sdk/tree/main/packages/react): SDK for React applications

## Installation

```bash
# For browser usage
npm install @boringmetrics/browser
# or...
yarn add @boringmetrics/browser

# For Node usage
npm install @boringmetrics/node
# or...
yarn add @boringmetrics/node

# For React usage
npm install @boringmetrics/react
# or...
yarn add @boringmetrics/react
```

## Usage

### Browser

```javascript
// Initialize the SDK
BoringMetrics.init('YOUR_API_TOKEN');

// Send a log
BoringMetrics.logs.send({
  type: 'log',
  level: 'info',
  message: 'User signed in',
  data: { userId: '123' },
});

// Send multiple logs
BoringMetrics.logs.sendBatch([
  { type: 'log', level: 'warn', message: 'Something looks weird' },
  {
    type: 'log',
    level: 'error',
    message: 'Something broke!',
    data: { error: 'Connection timeout' },
  },
]);

// Set a live metric value
BoringMetrics.lives.update({
  liveId: 'metric-123',
  value: 42,
  operation: 'set',
});

// Increment a live metric value
BoringMetrics.lives.update({
  liveId: 'metric-123',
  value: 5,
  operation: 'increment',
});
```

### Node

```javascript
// Initialize the SDK
BoringMetrics.init('YOUR_API_TOKEN');

// Send a log
BoringMetrics.logs.send({
  type: 'log',
  level: 'info',
  message: 'User signed in',
  data: { userId: '123' },
});

// Send multiple logs
BoringMetrics.logs.sendBatch([
  { type: 'log', level: 'warn', message: 'Something looks weird' },
  {
    type: 'log',
    level: 'error',
    message: 'Something broke!',
    data: { error: 'Connection timeout' },
  },
]);

// Set a live metric value
BoringMetrics.lives.update({
  liveId: 'metric-123',
  value: 42,
  operation: 'set',
});

// Increment a live metric value
BoringMetrics.lives.update({
  liveId: 'metric-123',
  value: 5,
  operation: 'increment',
});
```

### React

Not yet implemented.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/boringmetrics/javascript-sdk.

## Contributors

Thanks to everyone who contributed to the Boring Metrics JavaScript SDK!

<a href="https://github.com/boringmetrics/javascript-sdk/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=boringmetrics/javascript-sdk" />
</a>

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
