import { defineRule, configure } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

// VeeValidate 驗證規則設定
Object.entries(all).forEach(([name, rule]) => {
  defineRule(name, rule);
});
// i18n
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true
});

setLocale('zh_TW');

export default defineNuxtPlugin((_nuxtApp) => {});
