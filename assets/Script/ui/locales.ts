export namespace locales {
    export function getText(texts: Array<string>): string {
        if (texts) {
            return texts[0];
        }
        return "";
    }
}
