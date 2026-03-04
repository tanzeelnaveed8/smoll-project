import msgSound from '@/assets/sound/msg.mp3'
import notifSound from '@/assets/sound/notif.wav'

export function useSound() {
  const sound = new Audio('/sounds/notification.mp3')
  sound.play()

  const playSound = (type: 'chat' | 'notif') => {
    let sound = new Audio()

    if (type === 'chat') {
      sound = new Audio(msgSound)
    } else {
      sound = new Audio(notifSound)
    }

    sound.volume = 0.1
    sound.play()
  }

  return {
    playSound
  }
}
