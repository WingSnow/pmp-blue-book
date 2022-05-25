import { type UnwrapRef, reactive } from 'vue'

interface SettingProperty {
  autoCollect: boolean
  twoToneLanguage: boolean
}

class Setting {
  data: UnwrapRef<SettingProperty>

  constructor() {
    this.data = reactive({
      autoCollect: true,
      twoToneLanguage: true,
    })
    if (localStorage.getItem('autoCollect') === 'N') {
      this.data.autoCollect = false
    }
    if (localStorage.getItem('twoToneLanguage') === 'N') {
      this.data.twoToneLanguage = false
    }
  }

  setAutoCollect(status?: boolean) {
    if (status !== undefined) {
      this.data.autoCollect = status
    } else {
      this.data.autoCollect = !this.data.autoCollect
    }
    localStorage.setItem('autoCollect', this.data.autoCollect ? 'Y' : 'N')
  }

  setTwoToneLanguage(status?: boolean) {
    if (status !== undefined) {
      this.data.twoToneLanguage = status
    } else {
      this.data.twoToneLanguage = !this.data.twoToneLanguage
    }
    localStorage.setItem(
      'twoToneLanguage',
      this.data.twoToneLanguage ? 'Y' : 'N'
    )
  }
}

const setting = new Setting()

export default setting
