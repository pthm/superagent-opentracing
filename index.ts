import * as opentracing from 'opentracing'

function injectTrace(parent?: opentracing.Span | opentracing.SpanContext) {
    let span;
    let name = 'superagent.request';
    if(span) {
        span = opentracing.globalTracer().startSpan(name, { childOf: parent });
    } else {
        span = opentracing.globalTracer().startSpan(name);
    }
    const tracer = opentracing.globalTracer();
    return function (request) {
        const headers = {};
        tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);
        request.set(headers);
        request.end((error) => {
            if(error){
                span.setTag(opentracing.Tags.ERROR, true);
                span.log({'event': 'error', 'error.object': error, 'message': error.message, 'stack': error.stack});
            }
            span.finish();
        });
    };
}

export default injectTrace;