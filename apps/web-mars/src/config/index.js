import { SCHOOLS } from "@enis2/shared"

const isDev = import.meta.env.DEV

const PROXY_URL = import.meta.env.VITE_PROXY_URL

if (!PROXY_URL) throw new Error("PROXY_URL is not defined")

const DEFAULT_ERROR_MESSAGE = "Что-то пошло не так"

const MOCK_DEVICE_INFO = "SM-A525F"

const DA_LINK = "https://www.donationalerts.com/r/wsehl"
const TG_LINK = "https://t.me/joinchat/ToHSvx2gVOBkMzBi"
const GH_LINK = "https://github.com/anyrange/enis2"

const DEFAULT_RANGES = [0, 40, 65, 85, 100]

export {
  isDev,
  PROXY_URL,
  DEFAULT_ERROR_MESSAGE,
  SCHOOLS,
  DA_LINK,
  TG_LINK,
  GH_LINK,
  DEFAULT_RANGES,
  MOCK_DEVICE_INFO
}
