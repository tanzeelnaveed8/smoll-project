import { CaseStatusEnum } from '@/stores/types/case.d'
import { ConsultationStatusEnum } from '@/stores/types/consultation.d'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const truncateString = (str: string, num: number) => {
  if (str?.length > num) {
    return str.slice(0, num) + '...'
  } else {
    return str
  }
}

export const getStatusData = (
  status: ConsultationStatusEnum
): {
  label: string
  color: string
} => {
  switch (status) {
    case ConsultationStatusEnum.SCHEDULED:
      return {
        label: 'Scheduled',
        color: 'rgb(108, 16, 225)'
      }
    case ConsultationStatusEnum.EXPIRED:
      return {
        label: 'Expired',
        color: '#E02A2A'
      }
    case ConsultationStatusEnum.COMPLETED:
      return {
        label: 'Completed',
        color: '#333'
      }
    case ConsultationStatusEnum.INITIATED:
      return {
        label: 'Initiated',
        color: '#2F6E20'
      }
    case ConsultationStatusEnum.REJECTED:
      return {
        label: 'Rejected',
        color: '#E02A2A'
      }
    default:
      return {
        label: 'Unknown',
        color: '#000'
      }
  }
}

export const getCaseStatusData = (
  status: CaseStatusEnum
): {
  label: string
  color: string
} => {
  switch (status) {
    case CaseStatusEnum.OPEN:
      return {
        label: 'Open',
        color: '#56b686'
      }
    case CaseStatusEnum.OPEN_ESCALATED:
      return {
        label: 'Escalated',
        color: '#e31f7d'
      }
    case CaseStatusEnum.CLOSED:
      return {
        label: 'Closed',
        color: '#222222'
      }
    default:
      return {
        label: 'Unknown',
        color: '#000'
      }
  }
}

function parseTime(timeStr: string) {
  const period = timeStr.slice(-2) // 'AM' or 'PM'
  let hours = parseInt(timeStr.slice(0, -2), 10)

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return hours * 60 // convert to minutes
}

export function sortByCurrentTime(arr: { id: string; content: string }[]) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60

  const sortedTimeGroup = arr
    .map((obj: { id: string; content: string }) => ({
      ...obj,
      timeInMinutes: parseTime(obj.id)
    }))
    .sort((a: any, b: any) => {
      const diffA = (a.timeInMinutes - currentMinutes + 1440) % 1440
      const diffB = (b.timeInMinutes - currentMinutes + 1440) % 1440
      return diffA - diffB
    })

  return sortedTimeGroup
}

export const convertTimeToUtc = (time: string) => {
  const date = dayjs().format('YYYY-MM-DD')
  return dayjs(date + 'T' + time)
    .utc()
    .format('HH:mm')
}

export const convertTimeToLocal = (time: string) => {
  const date = dayjs().format('YYYY-MM-DD')

  return dayjs(date.toString() + 'T' + time + 'Z').format('HH:mm')
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private audioURL: string | null = null

  async startRecording(): Promise<void> {
    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })

          this.mediaRecorder = new MediaRecorder(this.stream)

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.audioChunks.push(event.data)
              resolve()
            }
          }

          this.audioChunks = [] // Clear previous chunks
          this.mediaRecorder.start(1000) // Start recording, fire ondataavailable every 1 second
        } catch (error) {
          reject(error)
        }
      })()
    })
  }

  async pauseRecording(): Promise<string> {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      // Wait for the 'pause' event
      await new Promise((resolve) =>
        this.mediaRecorder!.addEventListener('pause', resolve, { once: true })
      )
    }

    // Create a blob from the recorded chunks
    const blob = new Blob(this.audioChunks)

    // Create and return an object URL for the blob
    return URL.createObjectURL(blob)
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      this.revokeAudioURL()
    }
  }

  async stopRecording(): Promise<{ file: File; duration: number }> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = async () => {
          const audioFile = this.createAudioFile()
          const duration = await this.getAudioDuration(audioFile)
          this.releaseResources()
          resolve({ file: audioFile, duration })
        }
        this.mediaRecorder.stop()
      }
    })
  }

  deleteRecording(): void {
    if (this.mediaRecorder) this.mediaRecorder.stop()
    this.releaseResources()
  }

  private revokeAudioURL(): void {
    if (this.audioURL) {
      URL.revokeObjectURL(this.audioURL)
      this.audioURL = null
    }
  }

  private createAudioFile(): File {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/m4a' })
    const fileName = `audio_${new Date().getTime()}.m4a`
    return new File([audioBlob], fileName, { type: 'audio/m4a' })
  }

  private releaseResources(): void {
    this.audioChunks = []
    this.revokeAudioURL()
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }
      audio.src = URL.createObjectURL(file)
    })
  }
}

export function formatDuration(seconds: number) {
  if (!seconds || isNaN(seconds)) return '00:00' // Handle undefined or invalid values
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function capitalizeFirst(str?: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '-'
}

export const shortenFileName = (fileName: string, maxLength: number): string => {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return fileName // No extension found

  const name = fileName.slice(0, lastDotIndex)
  const extension = fileName.slice(lastDotIndex) // Keep the extension

  return name.length > maxLength ? name.slice(0, maxLength) + '...' + extension : fileName
}
