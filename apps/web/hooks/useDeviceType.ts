import { useMediaQuery } from 'hooks'
import { screens } from 'tailwindcss/defaultTheme'

export function useDeviceType() {
  const isMobile = useMediaQuery(`(max-width: ${screens.sm})`)
  const upToTablets = useMediaQuery(`(max-width: ${screens.lg})`)
  const isTablet = useMediaQuery(`(min-width: ${screens.sm}) and (max-width: ${screens.lg})`)
  const isDesktop = useMediaQuery(`(min-width: ${screens.lg})`)
  const isLargeDesktop = useMediaQuery(`(min-width: ${screens['2xl']})`)

  return {
    isMobile,
    upToTablets,
    isTablet,
    isDesktop,
    isLargeDesktop,
  }
}
