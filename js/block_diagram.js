diagram7Stage = require('./diagrams/7_stage_pipeline.js');
diagram5Stage = require('./diagrams/5_stage_pipeline.js');
diagramSingleCycle = require('./diagrams/single_cycle.js');
diagramMemorySubsystem = require('./diagrams/memory_subsystem.js');

var paper = undefined;
var graph = undefined;
var graphScale = {
    x: 1,
    y: 1
};

var canvas = {
    paper: undefined,
    graph: undefined
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;

const BlockDiagramEnum = {
    SINGLE_CYCLE: 0,
    FIVE_STAGE_PIPELINE_STALL: 1,
    FIVE_STAGE_PIPELINE_BYPASS: 2,
    SEVEN_STAGE_PIPELINE_BYPASS: 3
};

function init(clickCallback) {
    graph = new joint.dia.Graph;
    
    paper = new joint.dia.Paper({
        el: document.getElementById('diagram_div'),
        model: graph,
        width: $('#diagram_div').parent().width(),
        height: $('#diagram_div').parent().height(),
        gridSize: 1,
        interactive: false
    });
    
    paper.on('blank:pointerdown', function(evt, x, y) {
        console.log(`Mouse click on blank area (${x}, ${y})"`);
    });
    paper.on('cell:pointerdown', function(cellView, evt, x, y) {
        console.log(`Mouse click on (${x}, ${y}): detected element \"${getBlockName(cellView)}\"`);
        clickCallback(getBlockName(cellView));
    });
    /*paper.on('cell:pointerdblclick', function(cellView, evt, x, y) {
        console.log(`Double click on (${x}, ${y}): detected element \"${getBlockName(cellView)}\"`);
    });
    
    $('#diagram-div')
    .attr('tabindex', 0)
    .on('mouseover', function() {
        this.focus();
    })
    .on('keydown', function(e) {
        console.log(`Keypress ${e.which} detected on canvas`);
        if (e.which === 189 && graphScale.x > MIN_SCALE) {
            graphScale.x -= 0.1;
            graphScale.y -= 0.1;
            paper.scale(graphScale.x, graphScale.y);
        } else if (e.which === 187 && graphScale.x < MAX_SCALE) {
            graphScale.x += 0.1;
            graphScale.y += 0.1;
            paper.scale(graphScale.x, graphScale.y);
        }
    });*/
    
    canvas.paper = paper;
    canvas.graph = graph;
    canvas.graphScale = graphScale;
    
    // set up pan and zoom
    var svgElement = $('#diagram_div').find('svg')[0];
    var svgPanAndZoom = svgPanZoom(svgElement, {
        panEnabled: true,
        controlIconsEnabled: false,
        zoomEnabled: true,
        dblClickZoomEnabled: true,
        mouseWheelZoomEnabled: true,
        preventMouseEventsDefault: true,
        zoomScaleSensitivity: 0.2,
        minZoom: 0.5,
        maxZoom: 10,
        fit: false,
        contain: false,
        center: false,
        refreshRate: 'auto',
        beforeZoom: function () {},
        onZoom: function () {},
        beforePan: function () {},
        onPan: function () {},
        onUpdatedCTM: function () {},
        eventsListenerElement: null
    });
    diagramSingleCycle.init(canvas);
    diagram5Stage.init(canvas);
    diagram7Stage.init(canvas);
    diagramMemorySubsystem.init(canvas);
}

function updateDiagramDimensions(newWidth, newHeight) {
    canvas.paper.setDimensions($('#diagram_div').parent().width(), 
                               $('#diagram_div').parent().height());
}

function saveBlockDiagramAsPng() {
    var xmlData = new XMLSerializer().serializeToString($('#diagram_div').find('svg')[0]);
    var domURL = window.URL || window.webkitURL || window;
    
    var canvas = $('#image_canvas')[0];
    // set canvas dimensions
    canvas.width = $('#diagram_div').width();
    canvas.height = $('#diagram_div').height();
    // set background color
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var img = new Image();
    var svg = new Blob([xmlData], {
        type: 'image/svg+xml'
    });
    console.log(`${canvas.width} ${canvas.height}`);
    var url = domURL.createObjectURL(svg);
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        domURL.revokeObjectURL(url);
        var ppngImage = canvas.toDataURL("image/png");
        canvas.toBlob(function(blob) {
            saveAs(blob, 'block_diagram.png');
        }, 'image/png');
    };
    img.src = url;
}

function getBlockDiagramPngBlob(callback) {
    var xmlData = new XMLSerializer().serializeToString($('#diagram_div').find('svg')[0]);
    var domURL = window.URL || window.webkitURL || window;
    
    var canvas = $('#image_canvas')[0];
    // set canvas dimensions
    canvas.width = $('#diagram_div').width();
    canvas.height = $('#diagram_div').height();
    // set background color
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var img = new Image();
    var svg = new Blob([xmlData], {
        type: 'image/svg+xml'
    });
    console.log(`${canvas.width} ${canvas.height}`);
    var url = domURL.createObjectURL(svg);
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        domURL.revokeObjectURL(url);
        var ppngImage = canvas.toDataURL("image/png");
        canvas.toBlob(function(blob) {
            callback(blob);
        }, 'image/png');
    };
    img.src = url;
}

function getBlockName(cellView) {
    if (cellView !==  undefined) {
         return cellView.model.prop('attrs/label/text').replace(/\n/g, ' ');
    } 
}

function getRegfileTemplate(x, y, width, height) {
    var regfileBlock = new joint.shapes.standard.Rectangle();
    regfileBlock.attr({
         body: {
            rx: 6,
            ry: 6,
            fill: '#bababa'
        },
        label: {
            fill: 'black'
        }
    });
    regfileBlock.position(x, y);
    regfileBlock.resize(width, height);
    regfileBlock.attr('body/fill', '#bababa');
    regfileBlock.attr('label/fill', 'black');
    var clockPathSymbol = new joint.shapes.standard.Path();
    clockPathSymbol.attr({
        body: {
            refD: 'M8 48 L56 48 L32 12 Z',
            fill: '#bababa'
        }
    });
    clockPathSymbol.resize(12, 8);
    var regfileHalfX = regfileBlock.position().x + (regfileBlock.attributes.size.width / 2) - (clockPathSymbol.attributes.size.width / 2);
    var regfileBottomY = regfileBlock.position().y + regfileBlock.attributes.size.height - clockPathSymbol.attributes.size.height;
    clockPathSymbol.position(regfileHalfX, regfileBottomY);
    return {
        regfile: regfileBlock,
        clockSymbol: clockPathSymbol
    };
}

function show5StagePipelineDiagram() {
    diagram5Stage.show(canvas);
}

function show7StagePipelineDiagram() {
    diagram7Stage.show(canvas);
}

function showSingleCycleDiagram() {
    diagramSingleCycle.show(canvas);
}

function showMemorySubsystemDiagram(cacheLevels) {
    diagramMemorySubsystem.show(canvas, cacheLevels);
}

function updateMemoryCapacityInDiagram(cacheLevels, memId, newSizeStr) {
    diagramMemorySubsystem.updateMemTitle(cacheLevels, memId, newSizeStr);
}


exports.init = init;
exports.getRegfileTemplate = getRegfileTemplate;
exports.saveBlockDiagramAsPng = saveBlockDiagramAsPng;
exports.getBlockDiagramPngBlob = getBlockDiagramPngBlob;
exports.showSingleCycleDiagram = showSingleCycleDiagram;
exports.show5StagePipelineDiagram = show5StagePipelineDiagram;
exports.show7StagePipelineDiagram = show7StagePipelineDiagram;
exports.showMemorySubsystemDiagram = showMemorySubsystemDiagram;
exports.updateDiagramDimensions = updateDiagramDimensions;
exports.BlockDiagramEnum = BlockDiagramEnum;
exports.updateMemTitle = updateMemoryCapacityInDiagram;