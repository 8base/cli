import { Utils } from "./utils";
import * as i18next       from "i18next";
import { i18n } from "i18next";
import locales from "../locales";


const initTranslations = async (i18next: i18n): Promise<void> => {

  return new Promise<void>((resolve, reject) => {
    i18next.init({
      fallbackLng: "en",
      debug: false,
      defaultNS: "default",
      resources: locales
    }, (err, t) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export class Translations {
  i18n: i18next.i18n;
  async init(): Promise<Translations> {
    await initTranslations(i18next);
    this.i18n = i18next.cloneInstance();
    return this;
  }
}

const translations = new Translations();
export { translations };