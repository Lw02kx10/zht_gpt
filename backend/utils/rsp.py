from typing import Dict
from easydict import EasyDict as edict


def generate_success_rsp(d: Dict) -> Dict:
    return edict({
        "code": 200,
        "msg": "ok",
        "data": d
    })


def generate_bad_request_rsp() -> Dict:
    return edict({
        "code": 400,
        "msg": "Bad request!",
    })
