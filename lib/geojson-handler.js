"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var stateCodes_1 = __importDefault(require("./stateCodes"));
var districtNames_1 = __importDefault(require("./districtNames"));
var utils_1 = require("./utils");
var processGeojsons = function () {
    var filenames = fs_1.default.readdirSync("maps");
    filenames.forEach(function (filename) {
        if (filename.indexOf("json") !== -1) {
            var geojson = JSON.parse(fs_1.default.readFileSync("maps/" + filename, "utf8"));
            if (filename === "tt.json") {
                var states = JSON.parse(fs_1.default.readFileSync("data/states/states.json", "utf8"));
                var latestStateData = states.reduce(function (acc, stateEntry) {
                    var _a;
                    return (__assign(__assign({}, acc), (_a = {}, _a[stateEntry.id] = stateEntry.data.pop(), _a)));
                }, {});
                var modifiedgeojson = processTTGeojsonData(geojson, latestStateData);
                fs_1.default.writeFileSync("geojson/tt.json", JSON.stringify(modifiedgeojson));
            }
            else if (filename === "dl.json") {
                var states = JSON.parse(fs_1.default.readFileSync("data/states/states.json", "utf8"));
                var data_1 = states.filter(function (stateEntry) { return stateEntry.id === "DL"; })[0].data;
                var modifiedgeojson = geojson;
                modifiedgeojson.features = modifiedgeojson.features.map(function (feature, index) {
                    return __assign(__assign({}, feature), { id: index + 1, properties: __assign(__assign({}, data_1.pop()), { id: "DL" }) });
                });
                fs_1.default.writeFileSync("geojson/dl.json", JSON.stringify(modifiedgeojson));
            }
            else {
                var districts = JSON.parse(fs_1.default.readFileSync("data/districts/districts.json", "utf8"));
                var latestDistrictData = districts.reduce(function (acc, _a) {
                    var _b;
                    var name = _a.name, district = _a.district, data = _a.data;
                    return (__assign(__assign({}, acc), (_b = {}, _b[name + "_" + district] = data.pop(), _b)));
                }, {});
                var modifiedgeojson = processStateGeojsonData(geojson, latestDistrictData);
                fs_1.default.writeFileSync("geojson/" + filename, JSON.stringify(modifiedgeojson));
            }
        }
    });
};
var processTTGeojsonData = function (geojson, reducedStates) {
    var modifiedFile = geojson;
    var stateReverseMappings = utils_1.getReverseStateMappings();
    modifiedFile.features = modifiedFile.features.map(function (feature, index) {
        var stateCode = stateReverseMappings[feature.properties["st_nm"]];
        return __assign(__assign({}, feature), { id: index + 1, properties: __assign(__assign({}, reducedStates[stateCode]), { id: stateCode }) });
    });
    return modifiedFile;
};
var processStateGeojsonData = function (geojson, reducedDistricts) {
    var modifiedFile = geojson;
    var stateReverseMappings = utils_1.getReverseStateMappings();
    modifiedFile.features = modifiedFile.features.map(function (feature, index) {
        var stateCode = stateReverseMappings[feature.properties["st_nm"]];
        var districtKey = districtNames_1.default[stateCodes_1.default[stateCode]].indexOf(feature.properties["district"]);
        var idKey = stateCode + "_" + districtKey;
        return __assign(__assign({}, feature), { id: index + 1, properties: __assign(__assign({}, reducedDistricts[idKey]), { id: idKey }) });
    });
    return modifiedFile;
};
exports.default = processGeojsons;
//# sourceMappingURL=geojson-handler.js.map