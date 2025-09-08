class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890<>[]{}!@#$%^&*'
    this.update = this.update.bind(this)
  }

  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 10)
      const end = start + Math.floor(Math.random() * 10)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

const phrases = [
  // Khmer 🇰🇭
  'សូមស្វាគមន៍មកកាន់ Khmer SMM 🎉',
  'ចាប់ផ្តើមក្នុងឆ្នាំ 2021 🚀',
  'ប្រព័ន្ធការពារទិន្នន័យទាំងមូល 🔐',
  'ដាក់ប្រាក់ដោយស្វ័យប្រវត្តិតាម KHQR 🏦',
  'ទទួលបានជំនឿទុកចិត្តពីអតិថិជនរាប់ពាន់នាក់ ❤️',

  // English 🇬🇧
  'Welcome to Khmer SMM 🎉',
  'Started in 2021 🚀',
  'Complete Data Protection System 🔐',
  'Easy Auto Deposit via KHQR 🏦',
  'Trusted by Thousands ❤️',

  // Chinese 🇨🇳
  '欢迎来到 Khmer SMM 🎉',
  '成立于 2021 年 🚀',
  '全面的数据保护系统 🔐',
  '通过 KHQR 轻松自动充值 🏦',
  '受到成千上万客户的信赖 ❤️',

  // French 🇫🇷
  'Bienvenue chez Khmer SMM 🎉',
  'Lancé en 2021 🚀',
  'Système complet de protection des données 🔐',
  'Dépôt automatique facile via KHQR 🏦',
  'Fiable et approuvé par des milliers de clients ❤️',

  // Japanese 🇯🇵
  'Khmer SMMへようこそ 🎉',
  '2021年にスタート 🚀',
  '完全なデータ保護システム 🔐',
  'KHQRで簡単に自動入金 🏦',
  '何千人ものお客様に信頼されています ❤️',

  // Korean 🇰🇷
  'Khmer SMM에 오신 것을 환영합니다 🎉',
  '2021년에 시작 🚀',
  '완벽한 데이터 보호 시스템 🔐',
  'KHQR를 통한 간편한 자동 입금 🏦',
  '수천 명의 고객에게 신뢰받고 있습니다 ❤️'
];


const el = document.querySelector('.text')
const fx = new TextScramble(el)

let counter = 0
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 6000)
  })
  counter = (counter + 1) % phrases.length
}

next()
