function Terminal(t) {
    const shell = this;

    const openingTitle = 'willyconsole! 0.1\n';
    const copyright = 'nectarboy - 2021\n';

    const helpMsg = '\nenter \'help\' for help\nhit esc to reset\n';

    // tiles
    const tiles = {
        caret: [
            0b1110,
            0b1110,
            0b1110,
            0b1110
        ]
    };

    // line initiating
    function initLine() {
        t.txt_drawString('\n');
        checkScroll();

        t.txt_drawString(' >');
    }

    function checkScroll() {
        if (t.txt_y > t.canv_height - t.tile_size*2) {
            t.clearTile(t.txt_x, t.txt_y); // make sure to clear caret

            var amt = t.tile_size + 1;
            t.txt_y -= amt;
            t.scrollBufferBy(0, -amt);

            return true;
        }

        return false;
    }

    // input
    var input = '';
    function submitInput() {
        t.clearTile(t.txt_x, t.txt_y); // clear caret

        // decode input ...
        switch (input.split(' ')[0]) {
            // commands
            case '': {
                // ...
                break;
            }
            case 'color': {
                var arr = input.split(' ');
                arr.shift();

                t.setColor(1, arr[0]); // color time

                t.txt_drawString('\nthis good?');
                checkScroll();
                break;
            }
            case 'red': {
                t.setColor('1', 'ff0000'); // red time

                t.txt_drawString('\nred time woo :)');
                checkScroll();
                break;
            }
            case 'echo': {
                var arr = input.split(' ');
                arr.shift();

                t.txt_drawString('\n' + arr.join(' '));
                checkScroll();
                break;
            }
            case 'cake': {
                t.txt_drawString('\ncool');
                checkScroll();
                break;
            }

            // normal case .. might be tryna launch a program ?
            default: {
                // program check here

                t.txt_drawString('\n??? huh');
                checkScroll();
            }
        }

        initLine();
        input = '';
    }

    function backspaceInput() {
        if (!input)
            return;
        input = input.slice(0, input.length - 1); // pop last char

        t.clearTile(t.txt_x, t.txt_y); // make sure to clear caret

        t.txt_x -= t.tile_size + 1;
        // fix text position
        if (t.txt_x < t.tile_size) {
            t.clearTile(t.txt_x, t.txt_y); // clear excess text

            t.txt_x = t.canv_width - t.tile_size + 1;
            t.txt_y -= t.tile_size + 1;
        }

        t.clearTile(t.txt_x, t.txt_y); // clear text behind ... dayum
    }

    // caret animation
    var caretTick = 0;
    var drawnCaret = false;
    const caretInterval = 15;

    function updateCaretAnim() {
        if (caretTick++ === caretInterval) {
            if (drawnCaret)
                t.clearTile(t.txt_x, t.txt_y);
            else
                t.drawTile(t.txt_x, t.txt_y, tiles.caret);

            caretTick = 0;
            drawnCaret = !drawnCaret;
        }
    }

    // INIT //
    this.init = function() {
        t.txt_drawString(openingTitle+copyright+helpMsg);
        initLine();
    };

    // LOOP //
    this.loop = function() {
        updateCaretAnim();
    };

    // KEY EVENTS //
    this.keydown = function(key) {
        switch (key) {
            // special cases
            case 'enter': {
                submitInput();
                break;
            }
            case 'backspace': {
                backspaceInput();
                break;
            }

            // normal case
            default: {
                if (t.txt_drawChar(key))
                    checkScroll();

                if (t.validChar(key))
                    input += key;
            }
        }

        caretTick = 0;
    };

    this.keyup = function(key) {

    };
};

export default Terminal;
