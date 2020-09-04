from utils import *

EXP_NAME = "weighted_matching"


def init_graph(nodeloc, token):
    clear_files(10, token)

    res = run_octave(EXP_NAME, "init_wmp", nodeloc, token)

    if res:
        return res

    images = read_all_pngs(EXP_NAME, token, 1)

    return jsonify(images=images, result="")


def start_annealing(method, nodeloc, token):
    res = run_octave(EXP_NAME, f"anneal_wmp_{method}", nodeloc, token)

    if res:
        return res

    images = read_all_pngs(EXP_NAME, token)
    result = read_result(EXP_NAME, token)

    return jsonify(images=images, result=result)


num_map = {
    "det": "det",
    "mean": "mean",
    "sto": "sto",
}


def runexp(data, part_num):
    nodeloc = data.get("nodeloc")
    token = data.get("token")

    if data.get("annealflag") == "1":
        return start_annealing(num_map[part_num], nodeloc, token)

    if data.get("initflag") == "1":
        return init_graph(nodeloc, token)

    return jsonify(success=True)
