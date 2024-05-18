import axios from "axios"
import { nanoid } from "nanoid"
import { v4 as uuid } from "uuid"
import { MOCK_DEVICE_INFO, PROXY_URL, DEFAULT_ERROR_MESSAGE } from "../config"
import useLoaderStore from "../stores/loader"
import useAuthStore from "../stores/auth"
import { parseJwt } from "../utils"

const api = axios.create({
  timeout: 1000 * 30, // 30 seconds
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const loaderStore = useLoaderStore()

    const { token } = authStore

    const url = new URL(config.url)

    const endpoint = url.pathname
    const id = nanoid()

    config.headers.Authorization = token
    config.headers["Forward-to"] = url.host
    config.params = { ...config.params }
    config.id = id
    config.url = `${PROXY_URL}${endpoint}`

    if (token && config.data) {
      const userInfo = JSON.parse(parseJwt(token).UserInfo)
      const city = userInfo.Email.split("@")[1].split(".")[0]

      config.headers["Forward-to"] = config.headers["Forward-to"].replace(
        "city",
        city
      )
      config.data = {
        ...config.data,
        token,
        studentId: userInfo.PersonGid,
      }
    }

    loaderStore.loadingQueue.push({ key: endpoint, id })

    return config
  },
  (error) => {
    console.log(`API Call error: ${error}`)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    const id = response.config.id
    const loaderStore = useLoaderStore()
    loaderStore.loadingQueue = loaderStore.loadingQueue.filter((item) => {
      return item.id !== id
    })

    return response.data
  },
  (error) => {
    const id = error.config.id

    const loaderStore = useLoaderStore()

    loaderStore.loadingQueue = loaderStore.loadingQueue.filter((item) => {
      return item.id !== id
    })

    if (!error.response) return Promise.reject(error)

    error.response.data ?? (error.response.data = DEFAULT_ERROR_MESSAGE)

    const endpoint = new URL(error.config.url).pathname

    loaderStore.errors.push({
      key: endpoint,
      message: error.response.data.message,
    })

    return Promise.reject(error)
  }
)

export const login = (credentials = {}) => {
  return api.post("https://identity.micros.nis.edu.kz/v1/Users/Authenticate", {
    ...credentials,
    action: "v1/Users/Authenticate",
    deviceInfo: MOCK_DEVICE_INFO,
    operationId: uuid(),
  })
}

export const refreshTokens = (refreshToken) => {
  return api.post("https://identity.micros.nis.edu.kz/v1/Users/ReissueTokens", {
    action: "v1/Users/ReissueTokens",
    operationId: uuid(),
    deviceInfo: MOCK_DEVICE_INFO,
    refreshToken,
  })
}

export const getGrades = () => {
  return api.post(
    "https://reportcard.micros.nis.edu.kz/v1/ReportCard/GetAllReportCardsAsync",
    {
      action: "v1/ReportCard/GetAllReportCardsAsync",
      operationId: uuid(),
    }
  )
}

export const getDiary = () => {
  return api.post(
    "https://sms.city.nis.edu.kz/jce/Api//Api/GetSubjectsAndPeriods",
    {
      action: "Api/GetSubjectsAndPeriods",
      operationId: uuid(),
    }
  )
}
