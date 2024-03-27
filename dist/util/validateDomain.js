"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDomain = void 0;
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const validateDomain = (domain) => {
    if (!domain)
        return false;
    const [name, tld] = domain.split(`.`);
    const onlyTLD = new RegExp(/^(thbar|hbar|cream|boo)$/gmu);
    if (!onlyTLD.test(tld) || !tld) {
        return false;
    }
    const isEmojiValid = (0, emoji_regex_1.default)();
    const isTextValid = new RegExp(/^[a-z0-9-]*$/g);
    const isValid = isTextValid.test(name) || isEmojiValid.test(name);
    return isValid;
};
exports.validateDomain = validateDomain;
