function Terminal(t) {
    var shell = this;

    // INIT //
    this.init = function() {
        t.txt_drawString('hello! welcome to\nwilly shell.\n');
        t.set_color(1, 0x00ffff);
    };

    // LOOP //
    this.loop = function () {
        const tiles = '/\\';
        var num = Math.round(Math.random());

        t.txt_drawChar(tiles[num]);
    };
};

export default Terminal;
