% arg is either nbits (testxorcore) or numberofhiddennodes (trainxorcore)
function runexp(type, nbits, nhiddennodes, filepath)
    global filename;
    filename = filepath;

    if type == 1
        trainXORcore(nbits, nhiddennodes);
    else
        testXORcore(nbits);
    end

    return;
