"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameYear = exports.isSameMonth = exports.isSameDay = void 0;
// Check if two dates are the same day
const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
};
exports.isSameDay = isSameDay;
// Check if two dates are the same month
const isSameMonth = (date1, date2) => {
    return (date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear());
};
exports.isSameMonth = isSameMonth;
// Check if two dates are the same year
const isSameYear = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear();
};
exports.isSameYear = isSameYear;
