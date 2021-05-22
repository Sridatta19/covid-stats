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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateReducer = exports.getReverseStateMappings = exports.getStateCodes = exports.createDefaultEntry = exports.createEntry = exports.groupByMulti = exports.groupBy = exports.isNotNearDate = exports.formatDate = exports.getPastDates = exports.safeGet = void 0;
var stateCodes_1 = __importDefault(require("./stateCodes"));
var safeGet = function (propertyArray, object) {
    return propertyArray.reduce(function (accumulator, currentValue) {
        return accumulator && accumulator[currentValue]
            ? accumulator[currentValue]
            : null;
    }, object);
};
exports.safeGet = safeGet;
var getPastDates = function (count) {
    if (count === void 0) { count = 100; }
    var generatedDate;
    var dates = [];
    while (dates.length !== count + 1) {
        var subtractedDate = new Date().setDate(new Date().getDate() - dates.length + 1);
        var date = new Date(subtractedDate);
        generatedDate = exports.formatDate(date);
        dates.push(generatedDate);
    }
    dates.reverse();
    return dates;
};
exports.getPastDates = getPastDates;
var formatDate = function (date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
};
exports.formatDate = formatDate;
// Hack to allow vercel to add future dates data
var isNotNearDate = function (date) {
    var today = new Date();
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    var tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    return !(date === exports.formatDate(today) ||
        date === exports.formatDate(yesterday) ||
        date === exports.formatDate(tomorrow));
};
exports.isNotNearDate = isNotNearDate;
var groupBy = function (grouper, list) {
    return list.reduce(function (acc, elem) {
        var key = grouper(elem);
        if (acc[key] !== undefined) {
            acc[key] = [elem].concat(acc[key]);
        }
        else {
            acc[key] = [elem];
        }
        return acc;
    }, {});
};
exports.groupBy = groupBy;
var groupByMulti = function (groupers, list) {
    if (groupers.length === 0) {
        throw Error;
    }
    else if (groupers.length == 1) {
        return exports.groupBy(groupers[0], list);
    }
    else {
        var groupedList_1 = exports.groupBy(groupers.pop(), list);
        var keys = Object.keys(groupedList_1);
        return keys.reduce(function (acc, key) {
            var _a;
            return __assign(__assign({}, acc), (_a = {}, _a[key] = exports.groupByMulti(groupers, groupedList_1[key]), _a));
        }, {});
    }
};
exports.groupByMulti = groupByMulti;
var createEntry = function (date, delta, previousData) {
    return {
        date: date,
        dc: delta.Confirmed && previousData.Confirmed
            ? Math.abs(Number(delta.Confirmed) - Number(previousData.Confirmed))
            : 0,
        dd: delta.Deceased && previousData.Deceased
            ? Math.abs(Number(delta.Deceased) - Number(previousData.Deceased))
            : 0,
        dr: delta.Recovered && previousData.Recovered
            ? Math.abs(Number(delta.Recovered) - Number(previousData.Recovered))
            : 0,
        tc: delta.Confirmed ? Number(delta.Confirmed) : 0,
        td: delta.Deceased ? Number(delta.Deceased) : 0,
        tr: delta.Recovered ? Number(delta.Recovered) : 0,
    };
};
exports.createEntry = createEntry;
var createDefaultEntry = function (date) {
    return {
        date: date,
        dc: 0,
        dd: 0,
        dr: 0,
        tc: 0,
        td: 0,
        tr: 0,
    };
};
exports.createDefaultEntry = createDefaultEntry;
var getStateCodes = function () {
    var CODES = [];
    for (var value in stateCodes_1.default) {
        CODES.push(value);
    }
    // Hack to convert string keys to State Code Keys
    // Need to figure out if I can add type safety here
    return CODES;
};
exports.getStateCodes = getStateCodes;
function isValidKey(value) {
    return value in stateCodes_1.default;
}
var getReverseStateMappings = function () {
    var mappings = {};
    for (var value in stateCodes_1.default) {
        if (isValidKey(value)) {
            mappings[stateCodes_1.default[value]] = value;
        }
    }
    // Hack to convert string keys to State Code Keys
    // Need to figure out if I can add type safety here
    return mappings;
};
exports.getReverseStateMappings = getReverseStateMappings;
var dateReducer = function (data, masterData, propertyArray) {
    return function (date, index, dates) {
        // Ignore first Entry
        if (index === 0) {
            return;
        }
        // Check if State data exists for each date
        var stateData = exports.safeGet([__spreadArray([date], propertyArray).join("_"), "0"], masterData);
        var previousData = exports.safeGet([__spreadArray([dates[index - 1]], propertyArray).join("_"), "0"], masterData);
        if (stateData && previousData) {
            var Confirmed = stateData.Confirmed;
            if (exports.isNotNearDate(date) ||
                (Confirmed &&
                    Math.abs(Number(Confirmed) - Number(previousData.Confirmed)) !== 0)) {
                data.push(exports.createEntry(date, stateData, previousData));
            }
        }
        else if (exports.isNotNearDate(date)) {
            data.push(exports.createDefaultEntry(date));
        }
    };
};
exports.dateReducer = dateReducer;
//# sourceMappingURL=utils.js.map