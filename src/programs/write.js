function Write(t) {
    const write = this;

    // resources
    const tiles = {
        caret: [
            0b1110,
            0b1110,
            0b1110,
            0b1110
        ]
    };

    var palleteInd = 0;
    const palletes = [
        ['ffe4c2', '422936'],
        ['f7bef7', '2c2c96'],
        ['e2f3e4', '332c50'],
        ['FFF1C9', 'A3427B'],
        ['FFFFFF', '603651'],
        ['8be5ff', '622e4c'],
        ['dec69c', '003973'],
        ['21382A', '75BC64']
    ];

    function switchPallete(s) {
        palleteInd += s;
        palleteInd &= 7;

        t.setColor(0, palletes[palleteInd][1]);
        t.setColor(1, palletes[palleteInd][0]);

        t.clearBuffer();
        renderText();
    }

    // caret animation
    var caretTick = 0;
    var drawnCaret = false;
    const caretInterval = 4;

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

    // typing
    var input = '';

    // typing methods
    function typeChar(char) {
        if (!t.validChar(char))
            return;

        // add to input
        input += char;
        renderText();
    }

    function lineBreak() {
        input += '\n ';
        renderText();
    }

    function eraseChar(char) {
        if (!input)
            return;

        // clearing the buffer correctly
        t.clearTile(t.txt_x, t.txt_y); // clear caret
        t.txt_x -= t.tile_size + 1;

        // actually erase input
        var arr = input.split('');
        arr.pop();

        input = arr.join('');
        renderText();
    }

    function renderText() {
        t.clearTile(t.txt_x, t.txt_y); // clear caret

        t.txt_x = 0;
        t.txt_y = 0;

        t.txt_drawString(input);
    }

    // INIT //
    this.init = function() {
        input = 'hello there !\n try writing o_o';
        switchPallete(0);
    };

    // LOOP //
    this.loop = function () {
        updateCaretAnim();
    };

    // KEY EVENTS //
    this.keydown = function (key) {
        switch (key) {
            // special cases
            case 'enter': {
                lineBreak();
                break;
            }
            case 'backspace': {
                eraseChar();
                break;
            }
            case 'arrowleft': {
                switchPallete(-1);
                break;
            }
            case 'arrowright': {
                switchPallete(1);
                break;
            }

            // normal case
            default: {
                typeChar(key);
            }
        }

        caretTick = 0;
        t.drawTile(t.txt_x, t.txt_y, tiles.caret);
    };

    this.keyup = function (key) {

    };
}

export default Write;