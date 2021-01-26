import store from '../store'
import ua from '../locales/ua'
import en from '../locales/en'

const locales = {
    'uk-UA': ua,
    'en-Us': en,
};

export default function locaizeFilter(key) {
    const locale = store.getters.info.locale || 'uk-UA';
    return locales[locale][key] || `[Localize error]: key ${key} not found`
}