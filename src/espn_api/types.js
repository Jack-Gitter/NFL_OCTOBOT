"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCORER_TYPE = exports.POINT_AFTER_ATTEMPT = exports.SCORING_TYPE = void 0;
var SCORING_TYPE;
(function (SCORING_TYPE) {
    SCORING_TYPE["TOUCHDOWN"] = "touchdown";
})(SCORING_TYPE || (exports.SCORING_TYPE = SCORING_TYPE = {}));
var POINT_AFTER_ATTEMPT;
(function (POINT_AFTER_ATTEMPT) {
    POINT_AFTER_ATTEMPT[POINT_AFTER_ATTEMPT["TWO_POINT_PASS"] = 15] = "TWO_POINT_PASS";
    POINT_AFTER_ATTEMPT[POINT_AFTER_ATTEMPT["TWO_POINT_RUSH"] = 16] = "TWO_POINT_RUSH";
})(POINT_AFTER_ATTEMPT || (exports.POINT_AFTER_ATTEMPT = POINT_AFTER_ATTEMPT = {}));
var SCORER_TYPE;
(function (SCORER_TYPE) {
    SCORER_TYPE["PAT_SCORER"] = "patScorer";
    SCORER_TYPE["TD_SCORER"] = "scorer";
})(SCORER_TYPE || (exports.SCORER_TYPE = SCORER_TYPE = {}));
//# sourceMappingURL=types.js.map