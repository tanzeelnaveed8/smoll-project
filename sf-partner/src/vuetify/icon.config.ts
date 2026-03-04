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
import IconUser from '@/components/icons/IconUser.vue'
import IconHelp from '@/components/icons/IconHelp.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconMinusVerticle from '@/components/icons/IconMinusVerticle.vue'
import IconReload from '@/components/icons/IconReload.vue'
import IconInfoCircle from '@/components/icons/IconInfoCircle.vue'
import IconDots from '@/components/icons/IconDots.vue'
import IconMinus from '@/components/icons/IconMinus.vue'
import IconLogo from '@/components/icons/IconLogo.vue'
import IconClockBolt from '@/components/icons/IconClockBolt.vue'
import IconService from '@/components/icons/IconBriefcase2.vue'
import IconVet from '@/components/icons/IconVet.vue'
import IconPet from '@/components/icons/IconPet.vue'
import IconPaw from '@/components/icons/IconPaw.vue'
import IconExclamationCircle from '@/components/icons/IconExclamationCircle.vue'
import IconSquare from '@/components/icons/IconSquare.vue'
import IconSquareCheck from '@/components/icons/IconSquareCheck.vue'
import IconGraph from '@/components/icons/IconGraph.vue'

// Import your custom icon components

const aliases: IconAliases = {
  ...defaultAliases,
  // Map your icon names to the custom names you'll use in your application
  dropdown: IconChevronDown,
  checkboxOff: IconSquare,
  checkboxOn: IconSquareCheck,
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
  'tb-user': IconUser,
  'tb-help': IconHelp,
  'tb-trash': IconTrash,
  'tb-minus-verticle': IconMinusVerticle,
  'tb-reload': IconReload,
  'tb-info-circle': IconInfoCircle,
  'tb-dots': IconDots,
  'tb-minus': IconMinus,
  'tb-logo': IconLogo,
  'tb-clock-bolt': IconClockBolt,
  'tb-briefcase-2': IconService,
  'tb-vets': IconVet,
  'tb-pet': IconPet,
  'tb-paw': IconPaw,
  'tb-exclamation-circle': IconExclamationCircle,
  'tb-square': IconSquare,
  'tb-square-check': IconSquareCheck,
  'tb-graph': IconGraph
}

export { aliases }
