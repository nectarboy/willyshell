// imports
import Terminal from './terminal.js'; // The default program ... firmware ?
import fontdata from './font.js'; // The font data uwu

function Shell(canv) {
    const shell = this;

    // constants
    this.canv_width = 128;
    this.canv_height = 112;
    this.tile_size = 4;

    // configuration
    const pallete = {
        0: {r:0,g:0,b:0,hex:''}, // background
        1: {r:0,g:0,b:0,hex:''}, // foreground
    };
    this.setColor = function(i, col) {
        pallete[i].hex = '#' + col;
        col = parseInt(col, 16);

        pallete[i].r = (col & 0xff0000) >> 16;
        pallete[i].g = (col & 0x00ff00) >> 8;
        pallete[i].b = (col & 0x0000ff) >> 0;
    };

    this.setColor(0, '000000');
    this.setColor(1, '00ff00');

    // basic elements
    canv.width = this.canv_width;
    canv.height = this.canv_height;
    const ctx = canv.getContext('2d');
    const buffer = ctx.createImageData(this.canv_width, this.canv_height);

    // shell basic methods
    this.plotBuffer = function(x,y,color) {
        var ind = 4 * (y * this.canv_width + x);

        buffer.data [ind ++] = pallete [color].r;
        buffer.data [ind ++] = pallete [color].g;
        buffer.data [ind ++] = pallete [color].b;
        buffer.data [ind]    = 0xff;
    };

    this.renderBuffer = function() {
        //console.log('draw');
        ctx.putImageData(buffer,0,0);
    };

    // very very slow buffer scrolling method
    this.scrollBufferBy = function(x,y) {
        var tmpCanv = document.createElement('canvas');
        var tmpCtx = tmpCanv.getContext('2d');

        tmpCanv.fillStyle = pallete[0].hex;

        tmpCtx.fillRect(0,0,this.canv_width,this.canv_height);
        tmpCtx.putImageData(buffer,x,y);

        var newBuff = tmpCtx.getImageData(0,0,this.canv_width,this.canv_height);
        for (var i = 0; i < buffer.data.length; i++)
            buffer.data[i] = newBuff.data[i];
    };

    this.clearBuffer = function() {
        for (var x = 0; x < this.canv_width; x++)
            for (var y = 0; y < this.canv_height; y++)
                this.plotBuffer(x,y,0);
    };

    this.drawTile = function(x,y,arr,settings = {}) {
        for (var ty = 0; ty < this.tile_size; ty++) {
            var py = y + ty;
            var nibble = arr [ty];

            for (var tx = 0; tx < this.tile_size; tx++) {
                var px = x + tx;
                if (px >= this.canv_width)
                    break;

                var bit = (nibble >> (~tx & 3)) & 1;
                if (settings.transparent && bit === 0)
                    continue;

                this.plotBuffer(px,py,bit);
            }
        }

        if (!settings.dontRender)
            this.renderBuffer();
    };

    this.clearTile = function(x,y,settings = {}) {
        for (var ty = 0; ty < this.tile_size; ty++) {
            var py = y + ty;
            for (var tx = 0; tx < this.tile_size; tx++)
                this.plotBuffer(x + tx,py,0);
        }

        if (!settings.dontRender)
            this.renderBuffer();
    };

    var program_class = null;
    var curr_program = null;
    this.load_program = function(program) {
        program_class = program;
        this.init();
    }

    this.init = function() {
        this.txt_x = 0;
        this.txt_y = 0;

        this.setColor(0, '000000');
        this.setColor(1, '00ff00');

        this.clearBuffer();
        curr_program = new program_class(this);
        curr_program.init();

        this.renderBuffer();
    };

    // shell text methods
    this.txt_x = 0;
    this.txt_y = 0;

    this.txt_newLine = function() {
        this.txt_x = 0;
        this.txt_y += this.tile_size + 1;
    };

    this.txt_drawChar = function(char, settings) {
        char = char.toLowerCase();
        if (char === '\n') {
            this.txt_newLine();
            return true;
        }

        if (!this.validChar(char)) {
            //console.log (`warning! invalid char '${char}'`);
            return false;
        }

        var ret = false;

        if (this.txt_x > this.canv_width - this.tile_size) {
            this.drawTile(this.txt_x, this.txt_y, font ['-'], settings);
            this.txt_newLine();

            ret = true;
        }

        this.drawTile(this.txt_x, this.txt_y, font [char], settings);
        this.txt_x += this.tile_size + 1;

        return ret;
    };

    this.txt_drawString = function(str) {
        for (var i = 0; i < str.length; i++)
            this.txt_drawChar (str[i], {dontRender: true});

        this.renderBuffer();
    };

    // data
    const font = fontdata;
    this.validChar = function(char) {
        return font[char] !== undefined;
    }

    // keyboard
    function start_keyboard() {
        document.onkeydown = keydown;
        document.onkeyup = keyup;
    }

    function stop_keyboard() {
        document.onkeydown = null;
        document.onkeyup = null;
    }

    function keydown(e) {
        curr_program.keydown(e.key.toLowerCase());
    }

    function keyup(e) {
        var key = e.key.toLowerCase();
        // restart terminal
        if (key === 'escape') {
            shell.load_program(Terminal);
            shell.init();
        }

        curr_program.keyup(key);
    }

    // app program loop
    var paused = true;

    var curr_timeout = null;
    var app_interval = 1000 / 40;
    function app_loop() {
        curr_program.loop();
        curr_timeout = setTimeout(app_loop, app_interval);
    };

    this.start_app = function () {
        if (!paused)
            return;
        paused = false;

        app_loop();
        start_keyboard();
    };

    this.stop_app = function() {
        clearTimeout(curr_timeout);
        stop_keyboard();

        paused = true;
        curr_timeout = null;
    };

    // initialization - load the firmware
    this.load_program(Terminal);

}

export default Shell;