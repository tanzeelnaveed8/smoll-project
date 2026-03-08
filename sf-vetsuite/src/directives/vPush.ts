const baseClass = 'push-transition'
const pushClass = 'push'

const addBaseClass = (el: HTMLElement) => {
  el.classList.add(baseClass)
}

const togglePushClass = (el: HTMLElement) => {
  addBaseClass(el)
  const method = el.classList.contains(pushClass) ? 'remove' : 'add'
  el.classList[method](pushClass)
}

export const vPush = {
  // mounted(el: HTMLElement) {
  //   el.addEventListener('mousedown', () => togglePushClass(el))
  //   el.addEventListener('mouseup', () => togglePushClass(el))
  //   el.addEventListener('mouseleave', () => el.classList.remove(pushClass))
  // },
  // unmounted(el: HTMLElement) {
  //   el.removeEventListener('mousedown', () => togglePushClass(el))
  //   el.removeEventListener('mouseup', () => togglePushClass(el))
  //   el.removeEventListener('mouseleave', () => el.classList.remove(pushClass))
  // }
}
