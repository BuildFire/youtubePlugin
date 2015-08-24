describe('Unit : youtubePlugin content.home.controller.js', function () {
  var ContentHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, CONTENT_TYPE, q;
  beforeEach(module('youtubePluginContent'));

  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _Buildfire_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _CONTENT_TYPE_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    Buildfire = _Buildfire_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    CONTENT_TYPE = _CONTENT_TYPE_;
    ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
  }));

  beforeEach(function () {
    ContentHome = $controller('ContentHomeCtrl', {
      $scope: scope,
      $q: q,
      Buildfire: Buildfire,
      TAG_NAMES: TAG_NAMES,
      ActionItems: ActionItems,
      STATUS_CODE: STATUS_CODE,
      CONTENT_TYPE: CONTENT_TYPE
    });
  });

  describe('Units: units should be Defined', function () {
    it('it should pass if ContentHome is defined', function () {
      expect(ContentHome).not.toBeUndefined();
    });
    it('it should pass if Buildfire is defined', function () {
      expect(Buildfire).not.toBeUndefined();
    });
    it('it should pass if TAG_NAMES is defined', function () {
      expect(TAG_NAMES).not.toBeUndefined();
    });
    it('it should pass if STATUS_CODE is defined', function () {
      expect(STATUS_CODE).not.toBeUndefined();
    });
    it('it should pass if CONTENT_TYPE is defined', function () {
      expect(CONTENT_TYPE).not.toBeUndefined();
    });
    it('it should pass if validateRssLink function is defined', function () {
      expect(ContentHome.validateRssLink).not.toBeUndefined();
    });
  });

  describe('ContentHome.masterData', function () {
    it('it should pass if ContentHome.masterData match the result', function () {
      expect(ContentHome.masterData).toEqual({
        "content": {
          "carouselImages": [],
          "description": "<p>&nbsp;<br></p>",
          "rssUrl": "",
          "type": ""
        },
        "design": {
          "itemListLayout": "",
          "itemListBgImage": "",
          "itemDetailsBgImage": ""
        }
      });
    });
  });

  describe('ContentHome.CONTENT_TYPE', function () {
    it('it should pass if ContentHome.CONTENT_TYPE is defined', function () {
      expect(ContentHome.CONTENT_TYPE).toBeDefined();
    });
  });

  describe('ContentHome.data', function () {
    it('it should pass if ContentHome.data is match the result', function () {
      expect(ContentHome.data).toEqual({
        "content": {
          "carouselImages": [],
          "description": "<p>&nbsp;<br></p>",
          "rssUrl": "",
          "type": ""
        },
        "design": {
          "itemListLayout": "",
          "itemListBgImage": "",
          "itemDetailsBgImage": ""
        }
      });
    });
  });
});
