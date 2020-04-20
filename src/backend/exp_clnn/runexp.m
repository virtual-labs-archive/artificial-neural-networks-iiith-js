% arg is either nbits (testxorcore) or numberofhiddennodes (trainxorcore)
function runexp(type, inputDim, numDataPoints, regionType, numIterations, NIstep, filepath)
    global filename;
    filename = filepath;
    if type == 1
        generateData(inputDim, numDataPoints, regionType, numIterations);
    else
        clnnMappingCore(NIstep);
    end

    return;
