blockDiagramUtils = require('../block_diagram.js');

function initSingleCycleDiagram(canvas) {
    canvas.graph.clear();
    canvas.graphScale.x = 1;
    canvas.graphScale.y = 1;
    canvas.paper.scale(canvas.graphScale.x, canvas.graphScale.y);
    var fetchBlock = new joint.shapes.standard.Rectangle();
    fetchBlock.position(20, 106);
    fetchBlock.resize(70, 80);
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
    fetchBlock.addTo(canvas.graph);
    console.log(fetchBlock);
    console.log(fetchBlock.attributes.size.width);
    fetchBlock.on('change:position', function() {
        console.log('FetchBlock position: ' + fetchBlock.position());
    });

    // decode block
    var decodeBlock = fetchBlock.clone();
    decodeBlock.translate(fetchBlock.attributes.size.width + 20, 0);
    decodeBlock.attr('label/text', 'Decode\nUnit');
    decodeBlock.attr('body/fill', '#77b1bd');
    decodeBlock.addTo(canvas.graph);
    decodeBlock.on('change:position', function() {
        console.log('DecodeBlock position: ' + decodeBlock.position());
    });
    // regfile
    //regfileBlock.translate(decodeBlock.attributes.size.width - 10, 0);
    var regTemplate = blockDiagramUtils.getRegfileTemplate(
        decodeBlock.position().x + (decodeBlock.attributes.size.width - 10), 
        decodeBlock.position().y, 35, 80);
    regTemplate.regfile.attr('label/text', 'Reg\nFile');
    regTemplate.regfile.addTo(canvas.graph);
    regTemplate.clockSymbol.addTo(canvas.graph);
    
    // execute block
    var executeBlock = regTemplate.regfile.clone();
    executeBlock.resize(fetchBlock.attributes.size.width, fetchBlock.attributes.size.height);
    executeBlock.translate(regTemplate.regfile.attributes.size.width + 20, 0);
    executeBlock.attr('label/text', 'Execute\nUnit');
    executeBlock.attr('label/fill', 'white');
    executeBlock.attr('body/fill', '#597cab');
    executeBlock.addTo(canvas.graph);
    executeBlock.on('change:position', function() {
        console.log('ExectuteBlock position: ' + executeBlock.position());
    });
    // memory unit
    var memoryUnitBlock = executeBlock.clone();
    memoryUnitBlock.translate(executeBlock.attributes.size.width + 20, 0);
    memoryUnitBlock.attr('label/text', 'Memory\nUnit');
    memoryUnitBlock.attr('body/fill', '#5762ab');
    memoryUnitBlock.addTo(canvas.graph);
    memoryUnitBlock.on('change:position', function() {
        console.log('MemoryUnitBlock position: ' + memoryUnitBlock.position());
    });
    // write back
    var writeBackBlock = memoryUnitBlock.clone();
    writeBackBlock.translate(memoryUnitBlock.attributes.size.width + 20, 0);
    writeBackBlock.attr('label/text', 'Writeback\nUnit');
    writeBackBlock.attr('body/fill', '#4f4d85');
    writeBackBlock.addTo(canvas.graph);
    writeBackBlock.on('change:position', function() {
        console.log('WriteBackBlock position: ' + writeBackBlock.position());
    });
    // control unit
    var controlUnitBlock = new joint.shapes.standard.Circle();
    controlUnitBlock.resize(70, 70);
    controlUnitBlock.position(decodeBlock.position().x + 1, 
                               decodeBlock.position().y - decodeBlock.attributes.size.height - 20);
    controlUnitBlock.attr('label/text', 'Control\nUnit');
    controlUnitBlock.attr('body/fill', '#77b1bd');
    controlUnitBlock.attr('label/fill', 'white');
    controlUnitBlock.addTo(canvas.graph);
    controlUnitBlock.on('change:position', function() {
        console.log('ControlUnitBlock position: ' + controlUnitBlock.position());
    });
    
    // Linking
    var fetchToDecodeLink = new joint.shapes.standard.Link();
    fetchToDecodeLink.source(fetchBlock);
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
    fetchToDecodeLink.addTo(canvas.graph);
    
    var regfileToExecuteLink = fetchToDecodeLink.clone();
    regfileToExecuteLink.source(regTemplate.regfile);
    regfileToExecuteLink.target(executeBlock);
    regfileToExecuteLink.attr('line/stroke', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.attr('line/targetMarker/fill', decodeBlock.attr('body/fill'));
    regfileToExecuteLink.toBack();
    regfileToExecuteLink.addTo(canvas.graph);
    
    var executeToMemoryLink = regfileToExecuteLink.clone();
    executeToMemoryLink.source(executeBlock);
    executeToMemoryLink.target(memoryUnitBlock);
    executeToMemoryLink.attr('line/stroke', executeBlock.attr('body/fill'));
    executeToMemoryLink.attr('line/targetMarker/fill', executeBlock.attr('body/fill'));
    executeToMemoryLink.addTo(canvas.graph);
    
    var memoryToWriteBackLink = executeToMemoryLink.clone();
    memoryToWriteBackLink.source(memoryUnitBlock);
    memoryToWriteBackLink.target(writeBackBlock);
    memoryToWriteBackLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memoryToWriteBackLink.addTo(canvas.graph);
    
    var writeBackToDecodeLink = memoryToWriteBackLink.clone();
    writeBackToDecodeLink.source(writeBackBlock);
    writeBackToDecodeLink.target(decodeBlock);
    writeBackToDecodeLink.router('manhattan');
    writeBackToDecodeLink.connector('rounded', {
        radius: 5
    });
    writeBackToDecodeLink.attr('line/stroke', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.attr('line/targetMarker/fill', writeBackBlock.attr('body/fill'));
    writeBackToDecodeLink.addTo(canvas.graph);
    
    // control unit links
    var controlToFetchLink = fetchToDecodeLink.clone();
    controlToFetchLink.source(controlUnitBlock);
    controlToFetchLink.target(fetchBlock);
    controlToFetchLink.router('manhattan');
    controlToFetchLink.connector('rounded', {
        radius: 5
    });
    controlToFetchLink.addTo(canvas.graph);
    var controlToDecodeLink = fetchToDecodeLink.clone();
    controlToDecodeLink.source(controlUnitBlock);
    controlToDecodeLink.target(decodeBlock);
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
    controlToDecodeLink.addTo(canvas.graph);
    var controlToExectuteLink = controlToFetchLink.clone();
    controlToExectuteLink.target(executeBlock);
    controlToExectuteLink.addTo(canvas.graph);
    var controlToMemoryLink = controlToExectuteLink.clone();
    controlToMemoryLink.target(memoryUnitBlock);
    controlToMemoryLink.addTo(canvas.graph);
    var controlToWriteBack = controlToMemoryLink.clone();
    controlToWriteBack.target(writeBackBlock);
    controlToWriteBack.addTo(canvas.graph);
    
    // memory subsystem interface
    var memorySubsystemInterfaceBlock = fetchBlock.clone();
    memorySubsystemInterfaceBlock.translate(0, fetchBlock.attributes.size.height + 80);
    memorySubsystemInterfaceBlock.attr('label/text', 'Memory Subsystem');
    var memIfWidth = writeBackBlock.position().x + 
        (writeBackBlock.attributes.size.width) - fetchBlock.position().x;
    memorySubsystemInterfaceBlock.resize(memIfWidth, 60);
    memorySubsystemInterfaceBlock.attr('body/fill', '#006666');
    memorySubsystemInterfaceBlock.addTo(canvas.graph);
    memorySubsystemInterfaceBlock.on('change:position', function() {
        console.log('InsMemoryBlock position: ' + memorySubsystemInterfaceBlock.position());
    });
    
    var fetchToMemSubsystemLink = controlToDecodeLink.clone();
    fetchToMemSubsystemLink.source(fetchBlock);
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
    fetchToMemSubsystemLink.addTo(canvas.graph);
    
    
    var memUnitToMemSubsystemLink = fetchToMemSubsystemLink.clone();
    memUnitToMemSubsystemLink.source(memoryUnitBlock);
    memUnitToMemSubsystemLink.target(memorySubsystemInterfaceBlock);
    memUnitToMemSubsystemLink.attr('line/stroke', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.attr('line/targetMarker/fill', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.attr('line/sourceMarker/fill', memoryUnitBlock.attr('body/fill'));
    memUnitToMemSubsystemLink.connector('rounded', {
        radius: 5
    });
    memUnitToMemSubsystemLink.addTo(canvas.graph);
}

exports.show = initSingleCycleDiagram;
