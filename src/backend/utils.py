import subprocess
import base64
import glob

from flask import jsonify

def get_exp_base(num):
    return f"exp_{num}"

def get_basepath(num, token):
    return f"{get_exp_base(num)}/{token}"


def clear_files(num, token, clear_res=True):
    base = get_exp_base(num)
    files = glob.glob(f"{base}/{token}*.png")
    if clear_res:
        files.append(f"{base}/{token}-result.txt")

    if len(files) > 0:
        subprocess.run(["rm", *files])


def run_octave(num, method="runexp", arg="", token=""):
    runstr = f"{method}({arg}, '{token}')"
    print(runstr)

    base = get_exp_base(num)
    arg = f"cd {base}; pkg load nnet; {runstr}"
    proc = subprocess.run(
        ["octave", "--eval", arg], stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )

    if proc.returncode != 0:
        print(proc.stderr.decode("utf-8"))
        return (
            jsonify(message="Octave didn't work", error=proc.stderr.decode("utf-8")),
            500,
        )

    return None


def clear_png(num, token):
    clear_files(num, token, clear_res=False)


def get_png(path):
    try:
        with open(f"{path}.png", "rb") as img:
            img_b64 = base64.b64encode(img.read()).decode("utf-8")
            return img_b64
    except FileNotFoundError:
        print(f"File {path}.png not found")

    return None


def read_all_pngs(num, token, cnt=2):
    basepath = get_basepath(num, token)
    images = []

    fil = get_png(basepath)
    if fil:
        images.append(fil)

    for i in range(1, cnt + 1):
        fil = get_png(f"{basepath}-{i}")
        if fil:
            images.append(fil)

    return images


def read_result(num, token):
    basepath = get_basepath(num, token)
    try:
        with open(f"{basepath}-result.txt", "r") as res:
            result = res.read()
    except FileNotFoundError:
        result = ""
        print("Result not ready")
    result = result.replace("\n", "<br>")

    return result
