"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var stateCodes_1 = __importDefault(require("./stateCodes"));
var utils_1 = require("./utils");
var parseStateData = function (masterData) {
    return utils_1.groupBy(function (elem) { return elem.Date + "_" + elem.State; }, masterData);
};
var processStateData = function () {
    var masterData = JSON.parse(fs_1.default.readFileSync("states.json", "utf8")).states;
    var stateData = parseStateData(masterData);
    var CODES = utils_1.getStateCodes();
    var masterStatesArray = [];
    CODES.forEach(function (stateCode) {
        masterStatesArray.push(getStateData(stateData, stateCode));
    });
    fs_1.default.writeFileSync("data/states/states.json", JSON.stringify(masterStatesArray));
};
var getStateData = function (masterData, stateCode) {
    var data = [];
    utils_1.getPastDates().forEach(utils_1.dateReducer(data, masterData, [stateCodes_1.default[stateCode]]), {});
    return {
        data: data,
        id: stateCode,
    };
};
exports.default = processStateData;
//# sourceMappingURL=state-handler.js.map