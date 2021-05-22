"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var districtNames_1 = __importDefault(require("./districtNames"));
var stateCodes_1 = __importDefault(require("./stateCodes"));
var utils_1 = require("./utils");
var parseDistrictData = function (masterData) {
    return utils_1.groupBy(function (elem) { return elem.Date + "_" + elem.State + "_" + elem.District; }, masterData);
};
var processDistrictData = function () {
    var masterData = JSON.parse(fs_1.default.readFileSync("districts.json", "utf8")).districts;
    var parsedMasterData = parseDistrictData(masterData);
    var districtContentByState = [];
    var CODES = utils_1.getStateCodes();
    CODES.map(function (stateCode) {
        // Loop through each district and write master state file for all districts together
        if (Array.isArray(districtNames_1.default[stateCodes_1.default[stateCode]])) {
            districtNames_1.default[stateCodes_1.default[stateCode]].forEach(function (district, index) {
                districtContentByState.push(retrieveDistrictsDataByState(parsedMasterData, stateCode, district, index));
            });
        }
    });
    fs_1.default.writeFileSync("data/districts/districts.json", JSON.stringify(districtContentByState));
};
var retrieveDistrictsDataByState = function (masterData, stateCode, district, index) {
    var data = [];
    utils_1.getPastDates().forEach(utils_1.dateReducer(data, masterData, [stateCodes_1.default[stateCode], district]), {});
    return {
        data: data,
        name: stateCode,
        district: index,
    };
};
exports.default = processDistrictData;
//# sourceMappingURL=districts-handler.js.map