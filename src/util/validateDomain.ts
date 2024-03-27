import emojiRegex from "emoji-regex";

export const validateDomain = (domain: string): boolean => {
    if (!domain) return false;
    const [name, tld] = domain.split(`.`);
    const onlyTLD = new RegExp(/^(thbar|hbar|cream|boo)$/gmu);

    if (!onlyTLD.test(tld) || !tld) {
        return false;
    }
    const isEmojiValid = emojiRegex();
    const isTextValid = new RegExp(/^[a-z0-9-]*$/g);
    const isValid = isTextValid.test(name) || isEmojiValid.test(name);
    return isValid;
};
