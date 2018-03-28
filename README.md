# superagent-opentracing
Opentracing instrumentation for superagent requests

## Installation

```bash
npm install -g superagent-opentracing
```

## Usage
By default the `globalTracer` is used for all requests, headers are injected into all requests for extraction by other services. This library does not handle extraction.

### Standalone tracing
```typescript
const tracing = require('superagent-opentracing');
const request = require('superagent');

request.get('http://google.com')
    .use(tracing())
    .end((response) => {
        console.log('Response', response);
    });
```

### Trace as child
```typescript
const tracing = require('superagent-opentracing');
const request = require('superagent');
const opentracing = require('opentracing');

const tracer = opentracing.globalTracer();
const span = tracer.startSpan('some.request');
request.get('http://google.com')
    .use(tracing(span))
    .end((err, response) => {
        console.log('Response', response);
        if(err){
            span.setTag(opentracing.Tags.ERROR, true);
            span.log({'event': 'error', 'error.object': err, 'message': err.message, 'stack': err.stack});
        }
        span.finish();
    })
```
