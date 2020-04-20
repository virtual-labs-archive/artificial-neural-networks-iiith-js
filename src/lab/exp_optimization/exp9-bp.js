window.EXP_NAME = "optimization-bpp";
const Nnodes = 4;
const Nedges = 4;
const edgestring = '[1 2; 1 3; 2 3; 3 4;]';
const alpha = 0.4;
const deltaT = 0.1;
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
    switch (document.myform.graph.value) {
        case "new":
            document.myform.Nnodes.removeAttribute('readonly');
            document.myform.Nedges.removeAttribute('readonly');
            document.myform.edgestring.removeAttribute('readonly');
            document.myform.Nnodes.value = '';
            document.myform.Nedges.value = '';
            document.myform.edgestring.value = '';
            break;
        case "g4":
            document.myform.Nnodes.setAttribute('readonly', 'readonly');
            document.myform.Nedges.setAttribute('readonly', 'readonly');
            document.myform.edgestring.setAttribute('readonly', 'readonly');
            document.myform.Nnodes.value = 4;
            document.myform.Nedges.value = 4;
            document.myform.edgestring.value = '[1 2; 1 3; 2 3; 3 4;]';
            break;
        case "g6":
            document.myform.Nnodes.setAttribute('readonly', 'readonly');
            document.myform.Nedges.setAttribute('readonly', 'readonly');
            document.myform.edgestring.setAttribute('readonly', 'readonly');
            document.myform.Nnodes.value = 6;
            document.myform.Nedges.value = 9;
            document.myform.edgestring.value = '[1 2; 1 3; 2 3; 2 5; 3 4; 3 5; 3 6; 4 5; 5 6;]';
            break;
        case "g12":
            document.myform.Nnodes.setAttribute('readonly', 'readonly');
            document.myform.Nedges.setAttribute('readonly', 'readonly');
            document.myform.edgestring.setAttribute('readonly', 'readonly');
            document.myform.Nnodes.value = 12;
            document.myform.Nedges.value = 18;
            document.myform.edgestring.value = '[1 2;1 3;2 3;3 4;4 5;3 6;5 6;2 7;6 7;2 8;7 8;2 9;8 10;9 10;8 11;10 11;7 12;11 12;]';
            break;
        case "g14":
            document.myform.Nnodes.setAttribute('readonly', 'readonly');
            document.myform.Nedges.setAttribute('readonly', 'readonly');
            document.myform.edgestring.setAttribute('readonly', 'readonly');
            document.myform.Nnodes.value = 14;
            document.myform.Nedges.value = 22;
            document.myform.edgestring.value = '[1 2;2 3;2 4;3 4;1 5;4 5;1 6;5 7;6 7;4 8;7 8;3 9;8 9;3 10;9 10;3 11;10 12;11 12;10 13;12 13;9 14;13 14;]';
            break;
        case "g16":
            document.myform.Nnodes.setAttribute('readonly', 'readonly');
            document.myform.Nedges.setAttribute('readonly', 'readonly');
            document.myform.edgestring.setAttribute('readonly', 'readonly');
            document.myform.Nnodes.value = 16;
            document.myform.Nedges.value = 27;
            document.myform.edgestring.value = '[1 2;2 3;2 4;3 4;1 5;4 5;1 6;5 7;6 7;4 8;7 8;3 9;8 9;3 10;9 10;3 11;10 12;11 12;10 13;12 13;9 14;13 14;7 15;8 15;14 15;7 16;15 16;]';
            break;
    }
}

window.otherSetters = {Nnodes, Nedges, edgestring, alpha, deltaT};
