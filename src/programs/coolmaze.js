function Coolmaze(t) {
    const maze = this;

    // properties
    this.name = 'coolmaze';
    this.blurb = 'a cool maze';
    this.author = 'nectarboy';

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

    // KEY EVENTS //
    this.keydown = this.keyup = function () {};
}

export default Coolmaze;
