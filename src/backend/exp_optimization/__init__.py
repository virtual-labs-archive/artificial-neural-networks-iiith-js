from utils import *

EXP_NAME = "optimization"


def init_graph(method, arg, token):
    clear_files(EXP_NAME, token)

    res = run_octave(EXP_NAME, method, arg, token)
    if res:
        return res

    images = read_all_pngs(EXP_NAME, token, 1)

    return jsonify(images=images)


def start_annealing(method, arg, token):
    res = run_octave(EXP_NAME, method, arg, token)
    if res:
        return res

    images = read_all_pngs(EXP_NAME, token)
    result = read_result(EXP_NAME, token)

    return jsonify(images=images, result=result)


def bipartitionproblem(data):
    nnodes = data["Nnodes"]
    edgestring = data["edgestring"]
    arg = f"{nnodes}, {edgestring}"

    if data.get("initflag") == "1":
        return init_graph("initgraph", arg, data.get("token"))

    if data.get("annealflag") == "1":
        alpha = data["alpha"]
        beta = data["deltaT"]
        arg = f"{arg}, {alpha}, {beta}"
        return start_annealing("startannealing", arg, data.get("token"))

    return jsonify(success=True)


def weighted_matching(data):
    arg = data.get("nodeloc")

    if data.get("annealflag") == "1":
        return start_annealing("anneal_wmp_mean", arg, data.get("token"))

    if data.get("initflag") == "1":
        return init_graph("init_wmp", arg, data.get("token"))

    return jsonify(success=True)


num_map = {
    "bpp": bipartitionproblem,
    "wm": weighted_matching,
}


def runexp(data, part):
    return num_map[part](data)
