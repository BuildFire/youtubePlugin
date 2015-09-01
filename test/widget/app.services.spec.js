describe('Unit : youtubePlugin widget services', function () {
    describe('Unit : Buildfire Provider', function () {
        var Buildfire;
        beforeEach(module('youtubePluginWidget'));

        beforeEach(inject(function (_Buildfire_) {
            Buildfire = _Buildfire_;
        }));

        it('Buildfire should exist and be an object', function () {
            expect(typeof Buildfire).toEqual('object');
        });
    });
    describe('Unit : DataStore Factory', function () {
        var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
        beforeEach(module('youtubePluginWidget'));
        beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
            DataStore = _DataStore_;
            STATUS_CODE = _STATUS_CODE_;
            STATUS_MESSAGES = _STATUS_MESSAGES_;
            Buildfire = {
                datastore: {}
            };
            Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get','insert', 'update', 'save', 'delete']);
        }));

        it('DataStore should exist and be an object', function () {
            expect(typeof DataStore).toEqual('object');
        });
        it('DataStore.get should exist and be a function', function () {
            expect(typeof DataStore.get).toEqual('function');
        });
        it('DataStore.getById should exist and be a function', function () {
            expect(typeof DataStore.getById).toEqual('function');
        });
        it('DataStore.insert should exist and be a function', function () {
            expect(typeof DataStore.insert).toEqual('function');
        });
        it('DataStore.update should exist and be a function', function () {
            expect(typeof DataStore.update).toEqual('function');
        });
        it('DataStore.save should exist and be a function', function () {
            expect(typeof DataStore.save).toEqual('function');
        });
        it('DataStore.onUpdate should exist and be a function', function () {
            expect(typeof DataStore.onUpdate).toEqual('function');
        });
    });
    describe('Unit : YoutubeApi Factory', function () {
        var YoutubeApi;
        beforeEach(module('youtubePluginWidget'));

        beforeEach(inject(function (_YoutubeApi_) {
            YoutubeApi = _YoutubeApi_;
        }));
        describe('Units should be defined', function () {
            it('YoutubeApi should exist and be an object', function () {
                expect(typeof YoutubeApi).toEqual('object');
            });
            it('YoutubeApi.getSingleVideoDetails should exist and be a function', function () {
                expect(typeof YoutubeApi.getSingleVideoDetails).toEqual('function');
            });
            it('YoutubeApi.getFeedVideos should exist and be a function', function () {
              expect(typeof YoutubeApi.getFeedVideos).toEqual('function');
            });
        });
    });
});
