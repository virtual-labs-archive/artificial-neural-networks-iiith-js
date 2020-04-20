window.EXP_NAME = "optimization-wm";

const Nnodes = 4;
const nodeloc = '[1 1;3 3;0 4;2 6]';
const graph = 'g4';

function jsinit() {
    document.myform.initflag.value = 1;
    document.myform.annealflag.value = 0;
}

function jsanneal() {
    document.myform.annealflag.value = 1;
    document.myform.initflag.value = 0;
}

function jsreset() {
    document.myform.initflag.value = 0;
    document.myform.annealflag.value = 0;
}

function jschangegraph() {

    var N = document.myform.graph.value;
    var i = 0;
    var rnum;
    var nloc = '[';
    for (i = 0; i < N; i = i + 1) {
        rnum = Math.round(Math.random() * 10);
        nloc = nloc + rnum + ' ';
        rnum = Math.round(Math.random() * 10);
        nloc = nloc + rnum + '; ';
    }
    nloc = nloc + ']';

    switch (document.myform.graph.value) {
        case "new":
            document.myform.Nnodes.removeAttribute('readonly');
            document.myform.nodeloc.removeAttribute('readonly');
            document.myform.Nnodes.value = '';
            document.myform.nodeloc.value = '';
            break;
        default:
            document.myform.Nnodes.setAttribute('readonly', 'readonly');
            document.myform.nodeloc.setAttribute('readonly', 'readonly');
            document.myform.Nnodes.value = document.myform.graph.value;
            document.myform.nodeloc.value = nloc;
            break;
    }
    alert(document.myform.graph.value + nloc);

}

window.otherSetters = {Nnodes, nodeloc};
