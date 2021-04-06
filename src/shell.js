// imports
import Terminal from './terminal.js'; // The default program ... firmware ?

function Shell(canv) {
    var shell = this;

    // constants
    const canv_width = 128;
    const canv_height = 112;
    const tile_size = 4;
    const color_amt = 2;

    // configuration
    const pallete = {
        0: {r:0,g:0,b:0}, // background
        1: {r:0,g:0,b:0}, // foreground
    };
    this.set_color = function(i, col) {
        pallete[i].r = (col & 0xff0000) >> 16;
        pallete[i].g = (col & 0x00ff00) >> 8;
        pallete[i].b = (col & 0x0000ff) >> 0;
    }

    this.set_color(0, 0x000000);
    this.set_color(1, 0x00ff00);

    // basic elements
    canv.width = canv_width;
    canv.height = canv_height;
    document.body.appendChild(canv);
    const ctx = canv.getContext('2d');
    const buffer = ctx.createImageData(canv_width, canv_height);

    // shell basic methods
    this.plotBuffer = function(x,y,color) {
        var ind = 4 * (y * canv_width + x);

        buffer.data [ind ++] = pallete [color].r;
        buffer.data [ind ++] = pallete [color].g;
        buffer.data [ind ++] = pallete [color].b;
        buffer.data [ind]    = 0xff;
    };

    this.renderBuffer = function() {
        console.log('draw');
        ctx.putImageData(buffer,0,0);
    };

    this.clearBuffer = function() {
        for (var x = 0; x < canv_width; x++)
            for (var y = 0; y < canv_height; y++)
                this.plotBuffer(x,y,0);
    };

    this.drawTile = function(x,y,arr,settings = {}) {
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

                this.plotBuffer(px,py,bit);
            }
        }

        if (!settings.dontRender)
            this.renderBuffer();
    }

    this.init = function() {
        this.clearBuffer();
        curr_program.init();

        this.renderBuffer();
    };

    // shell text methods
    this.txt_x = 0;
    this.txt_y = 0;

    this.txt_newLine = function() {
        this.txt_x = 0;
        this.txt_y += tile_size + 1;
    };

    this.txt_drawChar = function(char, settings) {
        char = char.toLowerCase();

        if (char === '\n') {
            this.txt_newLine();
            return true;
        }

        this.drawTile(this.txt_x, this.txt_y, font [char], settings);
        this.txt_x += tile_size + 1;

        if (this.txt_x > canv_width - tile_size) {
            this.drawTile(this.txt_x, this.txt_y, font ['-'], settings);
            this.txt_newLine();

            return true;
        }
        return false;
    };

    this.txt_drawString = function(str) {
        for (var i = 0; i < str.length; i++)
            this.txt_drawChar (str[i], {dontRender: true});

        this.renderBuffer();
    };

    // data
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

    // app program loop
    var curr_program = null;
    this.load_program = function(program) {
        curr_program = new program(this);
        this.init();
    }

    var paused = false;

    var curr_timeout = null;
    var app_interval = 1000 / 40;
    this.app_loop = function() {
        curr_program.loop();

        paused = false;
        curr_timeout = setTimeout(() => {shell.app_loop();}, app_interval);
    };

    this.stop_app = function() {
        clearTimeout(curr_timeout);

        paused = true;
        curr_timeout = null;
    };

    // initialization - load the firmware
    this.load_program(Terminal);

};

export default Shell;