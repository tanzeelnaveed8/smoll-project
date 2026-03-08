import type { IconAliases } from 'vuetify'
import { aliases as defaultAliases } from 'vuetify/iconsets/mdi'
import IconEye from '@/components/icons/IconEye.vue'
import IconSmartHome from '@/components/icons/IconSmartHome.vue'
import IconWritingSign from '@/components/icons/IconWritingSign.vue'
import IconX from '@/components/icons/IconX.vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconCalenderMonth from '@/components/icons/IconCalenderMonth.vue'
import IconMailBox from '@/components/icons/IconMailBox.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconSettings from '@/components/icons/IconSettings.vue'
import IconEyeClosed from '@/components/icons/IconEyeClosed.vue'
import IconArrowBarToLeft from '@/components/icons/IconArrowBarToLeft.vue'
import IconUserCircle from '@/components/icons/IconUserCircle.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconBell from '@/components/icons/IconBell.vue'
import IconPaperClip from '@/components/icons/IconPaperClip.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconEditCircle from '@/components/icons/IconEditCircle.vue'
import IconSearch from '@/components/icons/iconSearch.vue'
import IconCircleMinus from '@/components/icons/IconCircleMinus.vue'
import IconCirclePlus from '@/components/icons/IconCirclePlus.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconDotsVertical from '@/components/icons/IconDotsVertical.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconStarFilled from '@/components/icons/IconStarFilled.vue'
import IconPhoto from '@/components/icons/IconPhoto.vue'
import IconFile from '@/components/icons/IconFile.vue'
import IconVideo from '@/components/icons/IconVideo.vue'
import IconUser from '@/components/icons/IconUser.vue'
import IconInfoCircle from '@/components/icons/IconInfoCircle.vue'
import IconArrowNarrowLeft from '@/components/icons/IconArrowNarrowLeft.vue'
import IconCircle from '@/components/icons/IconCircle.vue'
import IconCircleDot from '@/components/icons/iconCircleDot.vue'
import IconReload from '@/components/icons/IconReload.vue'
import IconSquareCheck from '@/components/icons/IconSquareCheck.vue'
import IconSquare from '@/components/icons/IconSquare.vue'
import IconMicrophone from '@/components/icons/IconMicrophone.vue'
import IconMicrophoneOff from '@/components/icons/IconMicrophoneOff.vue'
import IconMinus from '@/components/icons/IconMinus.vue'
import IconFilterCog from '@/components/icons/IconFilterCog.vue'
import IconFilterLines from '@/components/icons/IconFilterLines.vue'
import IconDots from '@/components/icons/IconDots.vue'
import IconArchive from '@/components/icons/IconArchive.vue'
import IconArchiveFilled from '@/components/icons/IconArchiveFilled.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconPlayerPause from '@/components/icons/IconPlayerPause.vue'
import IconPlayerPlay from '@/components/icons/IconPlayerPlay.vue'
import IconVideoOff from '@/components/icons/IconVideoOff.vue'
import IconHeartHandshake from '@/components/icons/IconHeartHandshake.vue'
import IconMaximize from '@/components/icons/IconMaximize.vue'
import IconLogo from '@/components/icons/IconLogo.vue'
import IconArrowDiagonalMinimize2 from '@/components/icons/IconArrowDiagonalMinimize2.vue'
import IconSquareCheckFilled from '@/components/icons/IconSquareCheckFilled.vue'
import IconCalendarEventFilled from '@/components/icons/IconCalendarEventFilled.vue'
import IconMoodSmile from '@/components/icons/IconMoodSmile.vue'
import IconRewindBackward from '@/components/icons/IconRewindBackward.vue'
import IconArrowNarrowDown from '@/components/icons/IconArrowNarrowDown.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconCircleArrowUpRight from '@/components/icons/IconCircleArrowUpRight.vue'
import IconSquareArrowUp from '@/components/icons/IconSquareArrowUp.vue'
import IconAlertCircle from '@/components/icons/IconAlertCircle.vue'
import IconCloudUpload from '@/components/icons/IconCloudUpload.vue'
import IconCircleCheck from '@/components/icons/IconCircleCheck.vue'
import IconCircleCheckFilled from '@/components/icons/IconCircleCheckFilled.vue'
// Import your custom icon components

const aliases: IconAliases = {
  ...defaultAliases,
  // Map your icon names to the custom names you'll use in your application
  dropdown: IconChevronDown,
  radioOff: IconCircle,
  radioOn: IconCircleDot,
  checkboxOn: IconSquareCheckFilled,
  checkboxOff: IconSquare,
  next: IconChevronRight,
  prev: IconChevronLeft,
  'tb-eye': IconEye,
  'tb-eye-closed': IconEyeClosed,
  'tb-smart-home': IconSmartHome,
  'tb-writing-sign': IconWritingSign,
  'tb-x': IconX,
  'tb-calender-month': IconCalenderMonth,
  'tb-mail-box': IconMailBox,
  'tb-message': IconMessage,
  'tb-settings': IconSettings,
  'tb-arrow-bar-to-left': IconArrowBarToLeft,
  'tb-user-circle': IconUserCircle,
  'tb-check': IconCheck,
  'tb-bell': IconBell,
  'tb-paper-clip': IconPaperClip,
  'tb-chevron-left': IconChevronLeft,
  'tb-chevron-right': IconChevronRight,
  'tb-chevron-down': IconChevronDown,
  'tb-download': IconDownload,
  'tb-edit-circle': IconEditCircle,
  'tb-search': IconSearch,
  'tb-circle-minus': IconCircleMinus,
  'tb-circle-plus': IconCirclePlus,
  'tb-plus': IconPlus,
  'tb-dots-vertical': IconDotsVertical,
  'tb-star': IconStar,
  'tb-star-filled': IconStarFilled,
  'tb-image': IconPhoto,
  'tb-file': IconFile,
  'tb-video': IconVideo,
  'tb-video-off': IconVideoOff,
  'tb-user': IconUser,
  'tb-info-circle': IconInfoCircle,
  'tb-arrow-narrow-left': IconArrowNarrowLeft,
  'tb-reload': IconReload,
  'tb-square-check': IconSquareCheck,
  'tb-square': IconSquare,
  'tb-microphone': IconMicrophone,
  'tb-microphone-off': IconMicrophoneOff,
  'tb-minus': IconMinus,
  'tb-filter-cog': IconFilterCog,
  'tb-filter-lines': IconFilterLines,
  'tb-dots': IconDots,
  'tb-archive': IconArchive,
  'tb-archive-filled': IconArchiveFilled,
  'tb-trash': IconTrash,
  'tb-player-pause': IconPlayerPause,
  'tb-player-play': IconPlayerPlay,
  'tb-heart-handshake': IconHeartHandshake,
  'tb-maximize': IconMaximize,
  'tb-logo': IconLogo,
  'tb-arrow-diagonal-minimize-2': IconArrowDiagonalMinimize2,
  'tb-calendar-event-filled': IconCalendarEventFilled,
  'tb-mood-smile': IconMoodSmile,
  'tb-rewind-bakcward': IconRewindBackward,
  'tb-arrow-narrow-down': IconArrowNarrowDown,
  'tb-arrow-left': IconArrowLeft,
  'tb-circle-arrow-up-right': IconCircleArrowUpRight,
  'tb-square-arrow-up': IconSquareArrowUp,
  'tb-alert-circle': IconAlertCircle,
  'tb-cloud-upload': IconCloudUpload,
  'tb-circle-check': IconCircleCheck,
  'tb-circle-check-filled': IconCircleCheckFilled
}

export { aliases }
