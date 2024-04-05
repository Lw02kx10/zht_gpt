import json

from flask import Flask, request
from flask_cors import CORS
from typing import *
from utils.rsp import generate_success_rsp, generate_bad_request_rsp
from rag import RAGRobot

app = Flask(__name__)
CORS(app, origins="http://172.23.148.156:3000/*")

@app.route('/query', methods=["GET"])
def handle_query() -> Dict:
    query_text = request.args.get("text", None)
    if query_text is None:
        return generate_bad_request_rsp()
    response_text = rag.query(query_text)

    res_dic = generate_success_rsp({
        "ans": str(response_text)
    })

    res = json.dumps(res_dic)
    return res


if __name__ == "__main__":
    rag = RAGRobot()
    rag.run()
    app.run(host="0.0.0.0", port=5601)

