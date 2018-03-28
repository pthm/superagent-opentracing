# superagent-opentracing
Opentracing instrumentation for superagent requests

## Installation

```bash
npm install -g superagent-opentracing
```

## Usage

```typescript
const tracing = require('superagent-opentracing');
const request = require('superagent');

request.get('http://google.com')
    .use(tracing);

```