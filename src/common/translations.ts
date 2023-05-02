import * as i18next from 'i18next';

import locales from '../locales';

const initTranslations = async (i18n: i18next.i18n): Promise<void> => {
  await i18n.init({
    fallbackLng: 'en',
    debug: false,
    defaultNS: 'default',
    resources: locales,
  });
};

export class Translations {
  i18n: i18next.i18n;
  async init(): Promise<Translations> {
    this.i18n = i18next.createInstance();
    await initTranslations(this.i18n);
    return this;
  }
}

const translations = new Translations();
export { translations };
