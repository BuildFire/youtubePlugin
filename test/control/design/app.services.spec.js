describe('Unit : youtubePlugin content services', function () {
    var Buildfire, DataStore, ImageLibrary, imageLib;
    beforeEach(module('youtubePluginDesign'));

    beforeEach(inject(function (_Buildfire_, _DataStore_, _ImageLibrary_) {
        Buildfire = _Buildfire_;
        DataStore = _DataStore_;
        ImageLibrary = _ImageLibrary_;
    }));

    describe('Provider : Buildfire', function () {
        it('Buildfire should exist and be an object', function () {
            expect(typeof Buildfire).toEqual('object');
        });
    });
    describe('Factory : DataStore', function () {
        it('DataStore should exist and be an object', function () {
            expect(typeof DataStore).toEqual('object');
        });
        it('DataStore.get should exist and be an function', function () {
            expect(typeof DataStore.get).toEqual('function');
        });
        it('DataStore.getById should exist and be an function', function () {
            expect(typeof DataStore.getById).toEqual('function');
        });
        it('DataStore.insert should exist and be an function', function () {
            expect(typeof DataStore.insert).toEqual('function');
        });
        it('DataStore.search should exist and be an function', function () {
            expect(typeof DataStore.search).toEqual('function');
        });
        it('DataStore.update should exist and be an function', function () {
            expect(typeof DataStore.update).toEqual('function');
        });
        it('DataStore.save should exist and be an function', function () {
            expect(typeof DataStore.save).toEqual('function');
        });
        it('DataStore.deleteById should exist and be an function', function () {
            expect(typeof DataStore.deleteById).toEqual('function');
        });

    });
    describe('Factory : ImageLibrary', function () {
        it('ImageLibrary should exist and be an object', function () {
            expect(typeof ImageLibrary).toEqual('object');
        });
        it('ImageLibrary.showDialog should exist and be an function', function () {
            expect(typeof ImageLibrary.showDialog).toEqual('function');
        });
    });
});
