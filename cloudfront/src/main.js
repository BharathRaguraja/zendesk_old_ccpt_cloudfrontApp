import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue'
import { messages } from './plugins/i18n'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserPlus, faUser,  faUserSecret,faExchangeAlt,faArrowUp , faLevelUpAlt, faCompress ,faTimes, faPlay , faExternalLinkAlt, faChevronDown ,faChevronLeft , faAddressBook , faCog , faPlus, faPhone , faPhoneSlash , faTh , faCaretDown,faMicrophoneAlt,faMicrophoneAltSlash,faPause,faRandom, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});


Vue.use(BootstrapVue)
library.add(faUserPlus, faArrowDown , faArrowUp,faLevelUpAlt , faUser,faUserSecret,faExchangeAlt, faCompress,faPlay,faTimes, faChevronDown,faExternalLinkAlt,faChevronLeft,faAddressBook,faCog,faPhone,faPlus,faPhoneSlash,faTh,faCaretDown,faMicrophoneAlt , faMicrophoneAltSlash,faPause,faRandom)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
