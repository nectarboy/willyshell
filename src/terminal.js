// constants
const canv_width = 128;
const canv_height = 112;
const tile_size = 4;
const color_amt = 2;

// configuration
const pallete = {
    0: {r:0,g:0,b:0}, // background
    1: {r:0,g:0,b:0}, // foreground

    set_color(i, col) {
        this[i].r = (col & 0xff0000) >> 16;
        this[i].g = (col & 0x00ff00) >> 8;
        this[i].b = (col & 0x0000ff) >> 0;
    }
};
pallete.set_color(0, 0x000000);
pallete.set_color(1, 0x00ff00);

// basic elements
const canv = document.getElementById('wt_canv');
    canv.width = canv_width;
    canv.height = canv_height;
    document.body.appendChild(canv);
const ctx = canv.getContext('2d');

const buffer = ctx.createImageData(canv_width, canv_height);
function plotBuffer(x,y,color) {
    var ind = 4 * (y * canv_width + x);

    buffer.data [ind ++] = pallete [color].r;
    buffer.data [ind ++] = pallete [color].g;
    buffer.data [ind ++] = pallete [color].b;
    buffer.data [ind]    = 0xff;
}

function renderBuffer() {
    console.log ('draw')
    ctx.putImageData(buffer,0,0);
}

// system pixel methods
function clearBuffer() {
    for (var x = 0; x < canv_width; x++)
        for (var y = 0; y < canv_height; y++)
            plotBuffer(x,y,0);
}

function drawTile(x,y,arr,settings) {
    for (var ty = 0; ty < tile_size; ty++) {
        var py = y + ty;
        var nibble = arr [ty];

        for (var tx = 0; tx < tile_size; tx++) {
            var px = x + tx;
            if (px >= canv_width)
                break;

            var bit = (nibble >> (~tx & 3)) & 1;
            if (settings.transparent && bit === 0)
                continue;

            plotBuffer (px,py,bit);
        }
    }

    if (!settings.dontRender)
        renderBuffer();
}

// terminal methods
function terminal_init() {
    ram.fill(0);

    clearBuffer();
    renderBuffer();
}

function newLine() {
    ram[0] = 0;
    ram[1] += tile_size + 1;
}

function drawChar(char, settings) {
    char = char.toLowerCase();

    if (char === '\n')
        return newLine();

    drawTile(ram[0], ram[1], font [char], settings);
    ram[0] += tile_size + 1;

    if (ram[0] > canv_width - tile_size) {
        drawTile(ram[0], ram[1], font ['-'], settings);
        newLine();
    }
}

function drawString(str) {
    for (var i = 0; i < str.length; i++)
        drawChar (str[i], {dontRender: true});

    renderBuffer();
}

// program routines
var curr_program = null;
function load_program(program) {
    terminal_init();
    curr_program = new program(window);
}

var curr_timeout = null;
var app_interval = 1000 / 20;
function app_loop() {
    curr_program.loop();
    curr_timeout = setTimeout(app_loop, app_interval);
}

function stop_app () {
    clearTimeout(curr_timeout);
    curr_timeout = null;
}

// data
const ram = new Uint8Array (512);

const font = {
    0: [
        0b1111,
        0b1011,
        0b1101,
        0b1111
    ],
    1: [
        0b0110,
        0b1110,
        0b0110,
        0b1111
    ],
    2: [
        0b1110,
        0b0011,
        0b1100,
        0b1111
    ],
    3: [
        0b1111,
        0b0111,
        0b0011,
        0b1111
    ],
    4: [
        0b1101,
        0b1111,
        0b0011,
        0b0011
    ],
    5: [
        0b1111,
        0b1110,
        0b0011,
        0b1110
    ],
    6: [
        0b1111,
        0b1100,
        0b1111,
        0b1111
    ],
    7: [
        0b1111,
        0b0011,
        0b0110,
        0b0110
    ],
    8: [
        0b1110,
        0b1010,
        0b0101,
        0b0111
    ],
    9: [
        0b1111,
        0b1111,
        0b0011,
        0b1111
    ],
    a: [
        0b1111,
        0b1011,
        0b1111,
        0b1011
    ],
    b: [
        0b1100,
        0b1111,
        0b1011,
        0b1111
    ],
    c: [
        0b1111,
        0b1100,
        0b1111,
        0b1111
    ],
    d: [
        0b0011,
        0b1111,
        0b1011,
        0b1111
    ],
    e: [
        0b1111,
        0b1111,
        0b1100,
        0b1111
    ],
    f: [
        0b1111,
        0b1100,
        0b1111,
        0b1100
    ],
    g: [
        0b1111,
        0b1111,
        0b0011,
        0b1111
    ],
    h: [
        0b1101,
        0b1111,
        0b1101,
        0b1101
    ],
    i: [
        0b1111,
        0b0110,
        0b1111,
        0b1111
    ],
    j: [
        0b1111,
        0b0011,
        0b1011,
        0b1111,
    ],
    k: [
        0b1101,
        0b1110,
        0b1101,
        0b1101
    ],
    l: [
        0b1100,
        0b1100,
        0b1100,
        0b1111
    ],
    m: [
        0b1101,
        0b1111,
        0b1111,
        0b1001
    ],
    n: [
        0b1111,
        0b1101,
        0b1101,
        0b1101
    ],
    o: [
        0b1111,
        0b1011,
        0b1111,
        0b1111
    ],
    p: [
        0b1111,
        0b1011,
        0b1111,
        0b1100
    ],
    q: [
        0b1111,
        0b1011,
        0b1111,
        0b0011
    ],
    r: [
        0b1111,
        0b1011,
        0b1110,
        0b1101
    ],
    s: [
        0b1111,
        0b1100,
        0b0011,
        0b1111
    ],
    t: [
        0b1111,
        0b0110,
        0b0110,
        0b0110
    ],
    u: [
        0b1101,
        0b1101,
        0b1111,
        0b1111
    ],
    v: [
        0b1101,
        0b1101,
        0b1111,
        0b0110
    ],
    w: [
        0b1001,
        0b1111,
        0b1111,
        0b1101
    ],
    x: [
        0b1101,
        0b0110,
        0b1101,
        0b1101
    ],
    y: [
        0b1101,
        0b0110,
        0b0110,
        0b0110
    ],
    z: [
        0b1111,
        0b0011,
        0b1100,
        0b1111,
    ],
    ' ': [
        0b0000,
        0b0000,
        0b0000,
        0b0000
    ],
    '.': [
        0b0000,
        0b0000,
        0b1100,
        0b1100
    ],
    ',': [
        0b0000,
        0b0000,
        0b0110,
        0b1100
    ],
    '+': [
        0b0100,
        0b1110,
        0b0100,
        0b0000
    ],
    '-': [
        0b0000,
        0b1110,
        0b0000,
        0b0000
    ],
    '*': [
        0b1001,
        0b0110,
        0b1001,
        0b0000
    ],
    '/': [
        0b0001,
        0b0010,
        0b0100,
        0b1000
    ],
    '=': [
        0b1111,
        0b0000,
        0b1111,
        0b0000
    ],
    '\\': [
        0b1000,
        0b0100,
        0b0010,
        0b0001
    ],
    '|': [
        0b0100,
        0b0100,
        0b0100,
        0b0100
    ],
    '_': [
        0b0000,
        0b0000,
        0b0000,
        0b1111
    ],
    '"': [
        0b0101,
        0b1010,
        0b0000,
        0b0000
    ],
    '!': [
        0b0110,
        0b0110,
        0b0000,
        0b0110
    ],
    '?': [
        0b1111,
        0b0011,
        0b0000,
        0b0011
    ]
};

// initialization - load the shell
terminal_init();
drawString('hey bruh ... welcome\nto willy shell !\n\npenis poop math class\n\n1+1 = 2\n2*2 = 4\n4/1 = 4')
