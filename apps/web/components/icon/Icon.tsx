import { ComponentPropsWithoutRef, ReactElement } from 'react'
import * as Icons from './icons'

const dimension = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

export enum EIconName {
  arrowDown = 'arrow-down',
  arrowLeft = 'arrow-left',
  arrowRight = 'arrow-right',
  arrowUp = 'arrow-up',
  check = 'check',
  checkboxBlank = 'checkbox-blank',
  checkboxCircle = 'checkbox-circle',
  circleFilled = 'circle-filled',
  error = 'error',
  fallback = 'fallback',
  info = 'info',
  menu = 'menu',
  warning = 'warning',
  close = 'close',
  google = 'google',
  search = 'search',
  closeCircleFill = 'close-circle-fill',
  calendar = 'calendar',
  errorWarning = 'error-warning',
  pages = 'pages',
  earth = 'earth',
  equalizer = 'equalizer',
  accountCircle = 'account-circle',
  arrowLeftLine = 'arrow-left-line',
  accountCircleFill = 'account-circle-fill',
  timeLine = 'time-line',
  chat = 'chat',
  settings = 'settings',
  listSettings = 'list-settings',
  profile = 'profile',
}

const icon: { [key in EIconName]: ReactElement } = {
  'arrow-down': Icons.arrowDown,
  'arrow-left': Icons.arrowLeft,
  'arrow-right': Icons.arrowRight,
  'arrow-up': Icons.arrowUp,
  'checkbox-blank': Icons.checkboxBlank,
  'checkbox-circle': Icons.checkboxCircle,
  'circle-filled': Icons.circleFilled,
  check: Icons.check,
  error: Icons.error,
  fallback: Icons.fallback,
  info: Icons.info,
  menu: Icons.menu,
  warning: Icons.warning,
  close: Icons.close,
  google: Icons.google,
  search: Icons.search,
  'close-circle-fill': Icons.closeCircleFill,
  calendar: Icons.calendar,
  'error-warning': Icons.errorWarning,
  pages: Icons.pages,
  earth: Icons.earth,
  equalizer: Icons.equalizer,
  'account-circle': Icons.accountCircle,
  'arrow-left-line': Icons.arrowLeftLine,
  'account-circle-fill': Icons.accountCircleFill,
  'time-line': Icons.timeLine,
  chat: Icons.chat,
  settings: Icons.settings,
  'list-settings': Icons.listSettings,
  profile: Icons.profile,
}

export type IconProps = ComponentPropsWithoutRef<'svg'> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  name: `${EIconName}`
}

export function Icon({ size = 'lg', name, ...props }: IconProps) {
  const d = dimension[size]

  return (
    <svg viewBox="0 0 24 24" width={d} height={d} {...props}>
      {icon[name] ?? Icons.fallback}
    </svg>
  )
}
