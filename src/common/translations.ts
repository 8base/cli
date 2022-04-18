import i18next, { cloneInstance, init } from 'i18next';
import locales from '../locales';

const initTranslations = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    init(
      {
        fallbackLng: 'en',
        debug: false,
        defaultNS: 'default',
        resources: locales,
      },
      (err, t) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
};

export class Translations {
  i18n: i18next.i18n;
  async init(): Promise<Translations> {
    await initTranslations();
    this.i18n = cloneInstance();
    return this;
  }
}

const translations = new Translations();
export { translations };
