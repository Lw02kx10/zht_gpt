from flask import Flask, request
from typing import *
from utils.rsp import generate_success_rsp, generate_bad_request_rsp

app = Flask(__name__)


@app.route('/query', methods=["GET"])
def handle_query() -> Dict:
    query_text = request.args.get("text", None)
    if query_text is None:
        return generate_bad_request_rsp()
    return generate_success_rsp({
        "ans": query_text
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5601)
