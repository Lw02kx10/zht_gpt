import json

from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
from waitress import serve
from typing import *
from utils.rsp import generate_bad_request_rsp
from rag import RAGRobot

app = Flask(__name__)
CORS(app, origins="http://172.25.80.1:3000/*")


@app.route('/query', methods=["GET"])
def handle_query() -> Any:
    query_text = request.args.get("text", None)
    if query_text is None:
        return generate_bad_request_rsp()
    res_gen: Generator[str, None, None] = rag.query(query_text)

    def event_stream():
        for text in res_gen:
            json_data = json.dumps({'ans': text})
            yield f"data:{json_data}\n\n"

    response = Response(stream_with_context(event_stream()), mimetype="text/event-stream")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response


if __name__ == "__main__":
    rag = RAGRobot()
    rag.run()
    serve(app, host='0.0.0.0', port=5601)
    # app.run(host='0.0.0.0', port=5601)

