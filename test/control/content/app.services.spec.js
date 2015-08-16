describe('Unit : youtubePlugin content services', function () {
    var Buildfire;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_Buildfire_) {
        Buildfire = _Buildfire_;
    }));

    describe('Provider : Buildfire', function () {
        it('Buildfire should exist and be an object', function () {
            expect(typeof Buildfire).toEqual('object');
        });
    });
});
