import { Utils } from "./utils";
import * as i18next       from "i18next";

export class Translations {
  i18n: i18next.i18n;
  async init(): Promise<Translations> {
    await Utils.initTranslations(i18next);
    this.i18n = i18next.cloneInstance({initImmediate: false});
    return this;
  }
}

const translations = new Translations();
export { translations };