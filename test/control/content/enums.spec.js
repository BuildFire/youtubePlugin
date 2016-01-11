describe('Unit : youtubePlugin content Enums', function () {
  var TAG_NAMES, STATUS_CODE, CONTENT_TYPE, LAYOUTS, YOUTUBE_KEYS, STATUS_MESSAGES;
  beforeEach(module('youtubePluginContent'));

  beforeEach(inject(function (_TAG_NAMES_, _STATUS_CODE_, _CONTENT_TYPE_, _LAYOUTS_, _YOUTUBE_KEYS_, _STATUS_MESSAGES_) {
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    CONTENT_TYPE = _CONTENT_TYPE_;
    LAYOUTS = _LAYOUTS_;
    YOUTUBE_KEYS = _YOUTUBE_KEYS_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
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

  describe('Unit : Enum YOUTUBE_KEYS', function () {
    it('YOUTUBE_KEYS should exist and be an object', function () {
      expect(typeof YOUTUBE_KEYS).toEqual('object');
    });
    it('YOUTUBE_KEYS.ACCESS_TOKEN should exist and equals to "AIzaSyC5d5acYzAtC9fiDcCOvvpA-xX9dKwkmAA"', function () {
      expect(YOUTUBE_KEYS.API_KEY).toEqual('AIzaSyC5d5acYzAtC9fiDcCOvvpA-xX9dKwkmAA');
    });
  });


  describe('Unit : Enum LAYOUTS', function () {
    it('LAYOUTS should exist and be an object', function () {
      expect(typeof LAYOUTS).toEqual('object');
    });
    it('LAYOUTS.listLayouts should be an array', function () {
      expect(Array.isArray(LAYOUTS.listLayouts)).toEqual(true);
    });
    it('LAYOUTS.listLayouts[0].name should exist and equals to "List_Layout_1"', function () {
      expect(LAYOUTS.listLayouts[0].name).toEqual('List_Layout_1');
    });
    it('LAYOUTS.listLayouts[1].name should exist and equals to "List_Layout_2"', function () {
      expect(LAYOUTS.listLayouts[1].name).toEqual('List_Layout_2');
    });
    it('LAYOUTS.listLayouts[2].name should exist and equals to "List_Layout_3"', function () {
      expect(LAYOUTS.listLayouts[2].name).toEqual('List_Layout_3');
    });
    it('LAYOUTS.listLayouts[3].name should exist and equals to "List_Layout_4"', function () {
      expect(LAYOUTS.listLayouts[3].name).toEqual('List_Layout_4');
    });
  });

  describe('Unit : Enum STATUS_MESSAGES', function () {
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
  });
});
