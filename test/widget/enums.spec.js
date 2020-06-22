describe('Unit : youtubePlugin widget Enums', function () {
    var TAG_NAMES, STATUS_CODE, CONTENT_TYPE, STATUS_MESSAGES, YOUTUBE_KEYS,VIDEO_COUNT;
    beforeEach(module('youtubePluginWidget'));

    beforeEach(inject(function (_TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _CONTENT_TYPE_, _YOUTUBE_KEYS_, _VIDEO_COUNT_) {
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        CONTENT_TYPE = _CONTENT_TYPE_;
        YOUTUBE_KEYS = _YOUTUBE_KEYS_;
        VIDEO_COUNT = _VIDEO_COUNT_;
    }));

    describe('Enum : TAG_NAMES', function () {
        it('TAG_NAMES should exist and be an object', function () {
            expect(typeof TAG_NAMES).toEqual('object');
        });
        it('TAG_NAMES.YOUTUBE_INFO should exist and equals to "YouTubeInfo"', function () {
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
        it('STATUS_CODE.UNDEFINED_DATA should exist and equals to "UNDEFINED_DATA"', function () {
            expect(STATUS_CODE.UNDEFINED_DATA).toEqual('UNDEFINED_DATA');
        });
        it('STATUS_CODE.UNDEFINED_OPTIONS should exist and equals to "UNDEFINED_OPTIONS"', function () {
            expect(STATUS_CODE.UNDEFINED_OPTIONS).toEqual('UNDEFINED_OPTIONS');
        });
        it('STATUS_CODE.UNDEFINED_ID should exist and equals to "UNDEFINED_ID"', function () {
            expect(STATUS_CODE.UNDEFINED_ID).toEqual('UNDEFINED_ID');
        });
        it('STATUS_CODE.ITEM_ARRAY_FOUND should exist and equals to "ITEM_ARRAY_FOUND"', function () {
            expect(STATUS_CODE.ITEM_ARRAY_FOUND).toEqual('ITEM_ARRAY_FOUND');
        });
        it('STATUS_CODE.NOT_ITEM_ARRAY should exist and equals to "NOT_ITEM_ARRAY"', function () {
            expect(STATUS_CODE.NOT_ITEM_ARRAY).toEqual('NOT_ITEM_ARRAY');
        });
        it('STATUS_CODE.UNDEFINED_EVENT should exist and equals to "UNDEFINED_EVENT"', function () {
            expect(STATUS_CODE.UNDEFINED_EVENT).toEqual('UNDEFINED_EVENT');
        });
    });

    describe('Enum : STATUS_MESSAGES', function () {
        it('STATUS_MESSAGES should exist and be an object', function () {
            expect(typeof STATUS_MESSAGES).toEqual('object');
        });
        it('STATUS_MESSAGES.UNDEFINED_DATA should exist and equals to "Undefined data provided"', function () {
            expect(STATUS_MESSAGES.UNDEFINED_DATA).toEqual('Undefined data provided');
        });
        it('STATUS_MESSAGES.UNDEFINED_OPTIONS should exist and equals to "Undefined options provided"', function () {
            expect(STATUS_MESSAGES.UNDEFINED_OPTIONS).toEqual('Undefined options provided');
        });
        it('STATUS_MESSAGES.UNDEFINED_ID should exist and equals to "Undefined id provided"', function () {
            expect(STATUS_MESSAGES.UNDEFINED_ID).toEqual('Undefined id provided');
        });
        it('STATUS_MESSAGES.NOT_ITEM_ARRAY should exist and equals to "Array of Items not provided"', function () {
            expect(STATUS_MESSAGES.NOT_ITEM_ARRAY).toEqual('Array of Items not provided');
        });
        it('STATUS_MESSAGES.ITEM_ARRAY_FOUND should exist and equals to "Array of Items provided"', function () {
            expect(STATUS_MESSAGES.ITEM_ARRAY_FOUND).toEqual('Array of Items provided');
        });
        it('STATUS_MESSAGES.UNDEFINED_EVENT should exist and equals to "Undefined event received"', function () {
            expect(STATUS_MESSAGES.UNDEFINED_EVENT).toEqual("Undefined event received");
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
    describe('Enum : YOUTUBE_KEYS', function () {
        it('YOUTUBE_KEYS should exist and be an object', function () {
            expect(typeof YOUTUBE_KEYS).toEqual('object');
        });
        it('YOUTUBE_KEYS.API_KEY should exist and equals to "AIzaSyC0on4E2RBCavK4U2sbaYN37_wFCpLTLpo"', function () {
            expect(YOUTUBE_KEYS.API_KEY).toEqual('AIzaSyC0on4E2RBCavK4U2sbaYN37_wFCpLTLpo');
        });
    });
    describe('Enum : VIDEO_COUNT', function () {
      it('VIDEO_COUNT should exist and be an object', function () {
        expect(typeof VIDEO_COUNT).toEqual('object');
      });
      it('VIDEO_COUNT.LIMIT should exist and equals to 8', function () {
        expect(VIDEO_COUNT.LIMIT).toEqual(8);
      });
  });
});
