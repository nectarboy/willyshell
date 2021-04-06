function Coolmaze(t) {
    var shell = this;

    // INIT //
    this.init = function() {
        t.txt_drawString(' cool maze :)\n' + '~'.repeat(25) + '\n');
        t.setColor(1, '00ffff');
    };

    // LOOP //
    this.loop = function () {
        const tiles = '/\\';
        var num = Math.round(Math.random());

        t.txt_drawChar(tiles[num]);
    };
};

export default Coolmaze;
