describe('Unit : youtubePlugin content Enums', function () {
    var TAG_NAMES, STATUS_CODE, CONTENT_TYPE;
    beforeEach(module('youtubePluginContent'));

    beforeEach(inject(function (_TAG_NAMES_, _STATUS_CODE_, _CONTENT_TYPE_) {
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        CONTENT_TYPE = _CONTENT_TYPE_;
    }));

    describe('Enum : TAG_NAMES', function () {
        it('TAG_NAMES should exist and be an object', function () {
            expect(typeof TAG_NAMES).toEqual('object');
        });
        it('TAG_NAMES.YOUTUBE_INFO should exist and equals to "GetInfo"', function () {
            expect(TAG_NAMES.YOUTUBE_INFO).toEqual('YouTubeInfo');
        });
    });

    describe('Enum : STATUS_CODE', function () {
        it('STATUS_CODE should exist and be an object', function () {
            expect(typeof STATUS_CODE).toEqual('object');
        });
        it('STATUS_CODE.INSERTED should exist and equals to "inserted"', function () {
            expect(STATUS_CODE.INSERTED).toEqual('inserted');
        });
        it('STATUS_CODE.UPDATED should exist and equals to "updated"', function () {
            expect(STATUS_CODE.UPDATED).toEqual('updated');
        });
        it('STATUS_CODE.NOT_FOUND should exist and equals to "NOTFOUND"', function () {
            expect(STATUS_CODE.NOT_FOUND).toEqual('NOTFOUND');
        });
    });

    describe('Enum : CONTENT_TYPE', function () {
        it('CONTENT_TYPE should exist and be an object', function () {
            expect(typeof CONTENT_TYPE).toEqual('object');
        });
        it('CONTENT_TYPE.CHANNEL_FEED should exist and equals to "Channel Feed"', function () {
            expect(CONTENT_TYPE.CHANNEL_FEED).toEqual('Channel Feed');
        });
        it('CONTENT_TYPE.SINGLE_VIDEO should exist and equals to "Single Video"', function () {
            expect(CONTENT_TYPE.SINGLE_VIDEO).toEqual('Single Video');
        });
    });
});
