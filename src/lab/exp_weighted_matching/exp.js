window.otherSetters = {
    "graph": "4",
    "Nnodes": 4,
    "nodeloc": "[1 5; 3 8; 5 1; 8 3]",
    "initflag": 0,
    "annealflag": 0,
};

function jsinit() {
    document.myform.initflag.value = 1;
}

function jsanneal() {
    console.log("setting value");
    document.myform.annealflag.value = 1;
    // document.myform.output.style.visibility = "visible";
}

function jsreset() {
    document.myform.initflag.value = 0;
    document.myform.annealflag.value = 0;

    $("#result").html("");
}

function jschangegraph() {
    const N = document.myform.graph.value;
    let i = 0;
    let rnum;

    let nloc = "[";
    for (i = 0; i < N; i = i + 1) {
        rnum = Math.round(Math.random() * 100);
        nloc = nloc + rnum + " ";
        rnum = Math.round(Math.random() * 100);
        nloc = nloc + rnum + "; ";
    }
    nloc = nloc + "]";

    if (document.myform.graph.value === "new") {
        document.myform.Nnodes.removeAttribute("readonly");
        document.myform.nodeloc.removeAttribute("readonly");
        document.myform.Nnodes.value = "";
        document.myform.nodeloc.value = "";
    } else {
        document.myform.Nnodes.setAttribute("readonly", "readonly");
        document.myform.nodeloc.setAttribute("readonly", "readonly");
        document.myform.Nnodes.value = document.myform.graph.value;
        document.myform.nodeloc.value = nloc;
    }
}
