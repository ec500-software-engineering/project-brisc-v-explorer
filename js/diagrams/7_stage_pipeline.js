blockDiagramUtils = require('../block_diagram.js');

var graphObjs = [];

function init7StageBypassedPiplineDiagram(canvas) {
    graphObjs = [];
    var fetchBlock = new joint.shapes.standard.Rectangle();
    fetchBlock.position(16, 130);
    fetchBlock.resize(80, 100);
    fetchBlock.attr({
        body: {
            rx: 6,
            ry: 6,
            fill: '#71b3aa'
        },
        label: {
            fill: 'white',
            text: 'Fetch\nUnit'
        }
    });
    graphObjs.push(fetchBlock);
    console.log(fetchBlock.attributes.size.width);
    fetchBlock.on('change:position', function() {
        console.log('FetchBlock position: ' + fetchBlock.position());
    });
    // fetch block Regfile
    var fetchRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        fetchBlock.position().x + (fetchBlock.attributes.size.width - 20), 
        fetchBlock.position().y, 25, fetchBlock.attributes.size.height);
    fetchRegFileBlockTemplate.regfile.attr('label/text', '');
    graphObjs.push(fetchRegFileBlockTemplate.regfile);
    graphObjs.push(fetchRegFileBlockTemplate.clockSymbol);
    // decode block
    var decodeBlock = fetchBlock.clone();
    decodeBlock.resize(80, 100);
    decodeBlock.translate(fetchBlock.attributes.size.width + 28, 0);
    decodeBlock.attr('label/text', 'Decode\nUnit');
    decodeBlock.attr('body/fill', '#77b1bd');
    graphObjs.push(decodeBlock);
    decodeBlock.on('change:position', function() {
        console.log('DecodeBlock position: ' + decodeBlock.position());
    });
    // decode regfile
    var decodeRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        decodeBlock.position().x + (decodeBlock.attributes.size.width - 14), 
        decodeBlock.position().y, 35, fetchBlock.attributes.size.height);
    decodeRegFileBlockTemplate.regfile.attr('label/text', 'Reg\nFile');
    graphObjs.push(decodeRegFileBlockTemplate.regfile);
    graphObjs.push(decodeRegFileBlockTemplate.clockSymbol);
    
    // execute block
    var executeBlock = decodeRegFileBlockTemplate.regfile.clone();
    executeBlock.resize(decodeBlock.attributes.size.width, decodeBlock.attributes.size.height);
    executeBlock.translate(decodeRegFileBlockTemplate.regfile.attributes.size.width + 20, 0);
    executeBlock.attr('label/text', 'Execute\nUnit');
    executeBlock.attr('label/fill', 'white');
    executeBlock.attr('body/fill', '#597cab');
    graphObjs.push(executeBlock);
    executeBlock.on('change:position', function() {
        console.log('ExectuteBlock position: ' + executeBlock.position());
    });
    // execute block Regfile
    var executeRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        executeBlock.position().x + (executeBlock.attributes.size.width - 14), 
        executeBlock.position().y, 25, fetchBlock.attributes.size.height);
    executeRegFileBlockTemplate.regfile.attr('label/text', '');
    graphObjs.push(executeRegFileBlockTemplate.regfile);
    graphObjs.push(executeRegFileBlockTemplate.clockSymbol);
    // memory unit
    var memoryUnitBlock = executeBlock.clone();
    memoryUnitBlock.translate(executeBlock.attributes.size.width + 55, 0);
    memoryUnitBlock.attr('label/text', 'Memory\nUnit');
    memoryUnitBlock.attr('body/fill', '#5762ab');
    graphObjs.push(memoryUnitBlock);
    memoryUnitBlock.on('change:position', function() {
        console.log('MemoryUnitBlock position: ' + memoryUnitBlock.position());
    });
    // memory unit block Regfile
    var memoryRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        memoryUnitBlock.position().x + (memoryUnitBlock.attributes.size.width - 13), 
        memoryUnitBlock.position().y, 25, fetchBlock.attributes.size.height);
    memoryRegFileBlockTemplate.regfile.attr('label/text', '');
    graphObjs.push(memoryRegFileBlockTemplate.regfile);
    graphObjs.push(memoryRegFileBlockTemplate.clockSymbol);
    // write back
    var writeBackBlock = memoryUnitBlock.clone();
    writeBackBlock.resize(80, 100);
    writeBackBlock.translate(memoryUnitBlock.attributes.size.width + 35, 0);
    writeBackBlock.attr('label/text', 'Writeback\nUnit');
    writeBackBlock.attr('body/fill', '#4f4d85');
    graphObjs.push(writeBackBlock);
    writeBackBlock.on('change:position', function() {
        console.log('WriteBackBlock position: ' + writeBackBlock.position());
    });
    // write back unit block Regfile
    var writeBackRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        writeBackBlock.position().x + (writeBackBlock.attributes.size.width - 8), 
        writeBackBlock.position().y, 25, fetchBlock.attributes.size.height);
    writeBackRegFileBlockTemplate.regfile.attr('label/text', '');
    graphObjs.push(writeBackRegFileBlockTemplate.regfile);
    graphObjs.push(writeBackRegFileBlockTemplate.clockSymbol);
    // control unit
    var controlUnitBlock = new joint.shapes.standard.Circle();
    controlUnitBlock.resize(70, 70);
    controlUnitBlock.position(decodeBlock.position().x + 2, 
                              decodeBlock.position().y - decodeBlock.attributes.size.height - 20);
    controlUnitBlock.attr('label/text', 'Control\nUnit');
    controlUnitBlock.attr('body/fill', '#77b1bd');
    controlUnitBlock.attr('label/fill', 'white');
    graphObjs.push(controlUnitBlock);
    controlUnitBlock.on('change:position', function() {
        console.log('ControlUnitBlock position: ' + controlUnitBlock.position());
    });
     // control unit Regfile
    var controlRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        decodeRegFileBlockTemplate.regfile.position().x + 20, 
        controlUnitBlock.position().y + 23, 25, 35);
    controlRegFileBlockTemplate.regfile.attr('label/text', '');
    graphObjs.push(controlRegFileBlockTemplate.regfile);
    graphObjs.push(controlRegFileBlockTemplate.clockSymbol);
    // Linking
    var fetchToDecodeLink = new joint.shapes.standard.Link();
    fetchToDecodeLink.source(fetchRegFileBlockTemplate.regfile);
    fetchToDecodeLink.target(decodeBlock);
    fetchToDecodeLink.attr({
        line: {
            strokeWidth: 3,
            stroke: fetchBlock.attr('body/fill'),
            targetMarker: {
                type: 'path',
                fill: fetchBlock.attr('body/fill')
            }
        }
    });
    graphObjs.push(fetchToDecodeLink);
    
    //exec to memory
    var execToMemRegFileBlockTemplate = blockDiagramUtils.getRegfileTemplate(
        executeRegFileBlockTemplate.regfile.position().x, 
        controlUnitBlock.position().y + 23, 25, 
        controlRegFileBlockTemplate.regfile.attributes.size.height);
    execToMemRegFileBlockTemplate.regfile.attr('label/text', '');
    graphObjs.push(execToMemRegFileBlockTemplate.regfile);
    graphObjs.push(execToMemRegFileBlockTemplate.clockSymbol);
    // memory to exec register
    var memStage2ndPipelineRegfileTemplate = blockDiagramUtils.getRegfileTemplate(
        memoryRegFileBlockTemplate.regfile.position().x, 
        controlUnitBlock.position().y + 23, 25, 
        controlRegFileBlockTemplate.regfile.attributes.size.height);
    memStage2ndPipelineRegfileTemplate.regfile.attr('label/text', '');
    graphObjs.push(memStage2ndPipelineRegfileTemplate.regfile);
    graphObjs.push(memStage2ndPipelineRegfileTemplate.clockSymbol);
    
    var memStage1stPipelineRegfileTemplate = blockDiagramUtils.getRegfileTemplate(
        memoryRegFileBlockTemplate.regfile.position().x - 60, 
        controlUnitBlock.position().y + 23, 25, 
        controlRegFileBlockTemplate.regfile.attributes.size.height);
    memStage1stPipelineRegfileTemplate.regfile.attr('label/text', '');
    graphObjs.push(memStage1stPipelineRegfileTemplate.regfile);
    graphObjs.push(memStage1stPipelineRegfileTemplate.clockSymbol);
    
    var regfileToExecuteLink = fetchToDecodeLink.clone();
    regfileToExecuteLink.source(decodeRegFileBlockTemplate.regfile);
    regfileToExecuteLink.target(executeBlock);
    regfileToExecuteLink.attr('line/stroke', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.attr('line/targetMarker/fill', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.toBack();
    graphObjs.push(regfileToExecuteLink);
    
    var executeToMemoryLink = regfileToExecuteLink.clone();
    executeToMemoryLink.source(executeRegFileBlockTemplate.regfile);
    executeToMemoryLink.target(memoryUnitBlock);
    executeToMemoryLink.attr('line/stroke', executeBlock.attr('body/fill'));
    executeToMemoryLink.attr('line/targetMarker/fill', executeBlock.attr('body/fill'));
    graphObjs.push(executeToMemoryLink);
    
    var memoryToWriteBackLink = executeToMemoryLink.clone();
    memoryToWriteBackLink.source(memoryRegFileBlockTemplate.regfile);
    memoryToWriteBackLink.target(writeBackBlock);
    memoryToWriteBackLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    graphObjs.push(memoryToWriteBackLink);
    
    var writeBackToDecodeLink = memoryToWriteBackLink.clone();
    writeBackToDecodeLink.source(writeBackRegFileBlockTemplate.regfile);
    writeBackToDecodeLink.target(decodeBlock);
    writeBackToDecodeLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['bottom'],
        padding: {
            vertical: 15,
            horizontal: 20
        }
    });
    writeBackToDecodeLink.connector('rounded', {
        radius: 5
    });
    writeBackToDecodeLink.attr('line/stroke', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.attr('line/targetMarker/fill', writeBackBlock.attr('body/fill'));
    graphObjs.push(writeBackToDecodeLink);
    
    var controlToDecodeLink = fetchToDecodeLink.clone();
    controlToDecodeLink.source(controlUnitBlock);
    controlToDecodeLink.target(decodeBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -2
            }
        }
    });
    controlToDecodeLink.attr({
        line: {
            strokeWidth: 3,
            stroke: controlUnitBlock.attr('body/fill'),
            sourceMarker: {
                type: 'path',
                fill: controlUnitBlock.attr('body/fill'),
                d: controlToDecodeLink.attr('line/targetMarker/d')
            }
        }
    });
    console.log(controlToDecodeLink);
    graphObjs.push(controlToDecodeLink);
    
    var controlToUpperDecodePipelineRegLink = fetchToDecodeLink.clone();
    controlToUpperDecodePipelineRegLink.source(controlUnitBlock);
    controlToUpperDecodePipelineRegLink.target(controlRegFileBlockTemplate.regfile);
    graphObjs.push(controlToUpperDecodePipelineRegLink);
    
    var controlToExectuteLink = fetchToDecodeLink.clone();
    controlToExectuteLink.source(controlRegFileBlockTemplate.regfile);
    controlToExectuteLink.target(executeBlock);
    controlToExectuteLink.router('manhattan', {
        startDirections: ['right']
    });
    controlToExectuteLink.connector('rounded', {
        radius: 5
    });
    graphObjs.push(controlToExectuteLink);
    
    var controlToExecPipelineRegLink = controlToExectuteLink.clone();
    controlToExecPipelineRegLink.target(execToMemRegFileBlockTemplate.regfile);
    graphObjs.push(controlToExecPipelineRegLink);
    
    var executeToFetchBypassLink = executeToMemoryLink.clone();
    executeToFetchBypassLink.source(executeRegFileBlockTemplate.regfile);
    executeToFetchBypassLink.target(fetchBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: 10
            }
        }
    });
    executeToFetchBypassLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['bottom'],
        padding: {
            vertical: 25,
            left: 12
        }
    });
    executeToFetchBypassLink.connector('rounded', {
        radius: 5
    });
    graphObjs.push(executeToFetchBypassLink);
    
    var execPipelineToMemLink = controlToExectuteLink.clone();
    execPipelineToMemLink.source(execToMemRegFileBlockTemplate.regfile);
    execPipelineToMemLink.target(memoryUnitBlock);
    execPipelineToMemLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    execPipelineToMemLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    execPipelineToMemLink.router('manhattan', {
        startDirections: ['right'],
        endDirections: ['top'] 
    });
    graphObjs.push(execPipelineToMemLink);
    
    var execPipelineToFetchLink = execPipelineToMemLink.clone();
    execPipelineToFetchLink.target(fetchBlock);
    execPipelineToFetchLink.router('manhattan', {
        startDirections: ['right'],
        padding: 12
    });
    graphObjs.push(execPipelineToFetchLink);
    
    var execPipelineTo1stMemPipelineLink = execPipelineToFetchLink.clone();
    execPipelineTo1stMemPipelineLink.source(execToMemRegFileBlockTemplate.regfile);
    execPipelineTo1stMemPipelineLink.target(memStage1stPipelineRegfileTemplate.regfile);
    graphObjs.push(execPipelineTo1stMemPipelineLink);
    
    var memPipeline1stRegToMemPipeline2ndRegLink = execPipelineToFetchLink.clone();
    memPipeline1stRegToMemPipeline2ndRegLink.source(memStage1stPipelineRegfileTemplate.regfile);
    memPipeline1stRegToMemPipeline2ndRegLink.target(memStage2ndPipelineRegfileTemplate.regfile);
    graphObjs.push(memPipeline1stRegToMemPipeline2ndRegLink);
    
    var memPipeline2ndRegToWriteBackLink = execPipelineTo1stMemPipelineLink.clone();
    memPipeline2ndRegToWriteBackLink.source(memStage2ndPipelineRegfileTemplate.regfile);
    memPipeline2ndRegToWriteBackLink.target(writeBackBlock);
    memPipeline2ndRegToWriteBackLink.router('manhattan', {
        startDirections: ['right']
    });
    memPipeline2ndRegToWriteBackLink.attr('line/stroke', writeBackBlock.attr('body/fill'));
    memPipeline2ndRegToWriteBackLink.attr('line/targetMarker/fill', writeBackBlock.attr('body/fill'));
    graphObjs.push(memPipeline2ndRegToWriteBackLink);
    
    // left justifying text for blocks
    //fetchBlock.attr('text/ref-x', -48);
    //memoryUnitBlock.attr('text/ref-x', -46);
    
    // memory subsystem link
    var memorySubsystemInterfaceBlock = fetchBlock.clone();
    memorySubsystemInterfaceBlock.translate(0, fetchBlock.attributes.size.height + 80);
    memorySubsystemInterfaceBlock.attr('label/text', 'Memory Subsystem');
    var memIfWidth = writeBackBlock.position().x + 
        (writeBackBlock.attributes.size.width) - fetchBlock.position().x;
    memorySubsystemInterfaceBlock.resize(memIfWidth, 60);
    memorySubsystemInterfaceBlock.attr('body/fill', '#006666');
    graphObjs.push(memorySubsystemInterfaceBlock);
    memorySubsystemInterfaceBlock.on('change:position', function() {
        console.log('InsMemoryBlock position: ' + memorySubsystemInterfaceBlock.position());
    });
    
    var fetchToMemSubsystemLink = controlToDecodeLink.clone();
    fetchToMemSubsystemLink.source(fetchBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -20
            }
        }
    });
    fetchToMemSubsystemLink.target(memorySubsystemInterfaceBlock, {
        anchor: {
            name: 'center',
            args: {
                dx: -20
            }
        }
    });
    fetchToMemSubsystemLink.attr('line/stroke', fetchBlock.attr('body/fill'));
    fetchToMemSubsystemLink.attr('line/targetMarker/fill',fetchBlock.attr('body/fill'));
    fetchToMemSubsystemLink.attr('line/sourceMarker/fill', fetchBlock.attr('body/fill'));
    fetchToMemSubsystemLink.connector('rounded', {
        radius: 5
    });
    fetchToMemSubsystemLink.router('manhattan', {
        startDirections: ['bottom'],
        endDirections: ['top']
    });
    graphObjs.push(fetchToMemSubsystemLink);
    
    
    var memUnitToMemSubsystemLink = fetchToMemSubsystemLink.clone();
    memUnitToMemSubsystemLink.source(memoryUnitBlock);
    memUnitToMemSubsystemLink.target(memorySubsystemInterfaceBlock);
    memUnitToMemSubsystemLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.attr('line/sourceMarker/fill', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.connector('rounded', {
        radius: 5
    });
    graphObjs.push(memUnitToMemSubsystemLink);
    
}


function show7StageDiagram(canvas) {
    canvas.graph.clear();
    canvas.graphScale.x = 1.1;
    canvas.graphScale.y = 1.1;
    canvas.paper.scale(canvas.graphScale.x, canvas.graphScale.y);
    for (var i = 0; i < graphObjs.length; i++) {
        graphObjs[i].addTo(canvas.graph);
    }
}

exports.show = show7StageDiagram;
exports.init = init7StageBypassedPiplineDiagram;