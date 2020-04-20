import uuid

from flask import Flask, request, abort
from flask_cors import CORS

import exp_optimization
import exp_weighted_matching
from utils import *

app = Flask(__name__)
CORS(app)


def get_args(exp_name, arg_dict):
    order = []

    if exp_name == "perceptron":
        order = [
            "Nsamples",
            "Niterns",
            "sample",
            "itern",
            "Nsamplestep",
            "NIstep",
            "probtype",
        ]
    elif exp_name == "mlfnn":
        order = [
            "isTrain",
            "numberOfBits",
            "numberOfhiddenNodes",
        ]
    elif exp_name == "clnn":
        order = [
            "type",
            "inputDim",
            "numDataPoints",
            "region",
            "numIterations",
            "NIstep",
        ]
    elif exp_name == "tsp":
        order = [
            "Ncities",
            "Nnodes",
            "Niterns",
            "city",
            "itern",
            "NCstep",
            "NIstep",
        ]

    arg_list = []

    for arg in order:
        arg_list.append(arg_dict[arg])

    return ", ".join(arg_list)


@app.route("/get_token", methods=["GET"])
def token():
    """
    Returns a token which will be used for all transactions with this server
    """
    uid = str(uuid.uuid4())
    return uid


@app.route("/exp-<num>", methods=["POST"])
def exp(num):
    known_exps = ["perceptron", "mlfnn", "clnn", "tsp"]

    if num not in known_exps:
        abort(404)

    uid = request.headers.get("token")

    if uid is None:
        # https://stackoverflow.com/a/4301901
        return "Token missing", 403

    data = request.get_json()
    try:
        args = get_args(num, data)
    except Exception as e:
        print(e)
        return "Invalid data for given experiment", 400

    clear_png(num, uid)
    res = run_octave(num=num, arg=args, token=uid)

    if res:
        return res

    images = read_all_pngs(num, uid)

    result = ""
    if num == 4 and data["isTrain"] == "0" and int(data["numberOfBits"]) > -1:
        result = read_result(num, uid)

    return jsonify(images=images, result=result)


@app.route("/exp-<num>-<part>", methods=["POST"])
def exp_part(num, part):
    uid = request.headers.get("token")

    if uid is None:
        # https://stackoverflow.com/a/4301901
        return "Token missing", 403

    data = request.get_json()

    runner = None
    if num == "optimization":
        if part not in exp_optimization.num_map:
            abort(404)

        runner = exp_optimization

    if num == "weighted_matching":
        if part not in exp_weighted_matching.num_map:
            abort(404)

        runner = exp_weighted_matching

    if not runner:
        abort(404)

    try:
        data["token"] = uid
        res = runner.runexp(data, part)
        return res
    except Exception:
        return "Invalid data for given experiment", 400



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4647, debug=True)
