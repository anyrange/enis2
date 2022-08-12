import axios from "axios"
import { nanoid } from "nanoid"
import { ENDPOINTS, DEFAULT_ERROR_MESSAGE, isMock } from "../config"
import useLoaderStore from "../stores/loader"
import useAuthStore from "../stores/auth"
import useSettingsStore from "../stores/settings"

const api = axios.create({
  timeout: 1000 * 30, // 30 seconds
})

const findEndpoint = (url) => {
  return Object.keys(ENDPOINTS).find((key) => {
    const value = ENDPOINTS[key].endpoint
    return url.includes(isMock ? value.mock : value.real)
  })
}

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const loaderStore = useLoaderStore()
    const settingsStore = useSettingsStore()

    const { school: city } = settingsStore.settings
    const { token } = authStore

    const endpoint = findEndpoint(config.url)
    const id = nanoid()

    config.headers.Authorization = `Bearer ${token}`
    config.params = { ...config.params, city }
    config.id = id

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
    error.response.data.message ??
      (error.response.data.message = DEFAULT_ERROR_MESSAGE)

    const id = error.response.config.id
    const endpoint = findEndpoint(error.response.config.url)

    const loaderStore = useLoaderStore()
    loaderStore.loadingQueue = loaderStore.loadingQueue.filter((item) => {
      return item.id !== id
    })
    loaderStore.errors.push({
      key: endpoint,
      message: error.response.data.message,
    })

    return Promise.reject(error)
  }
)

const createEndpoint = (name) => {
  const item = ENDPOINTS[name].endpoint
  return isMock ? item.mock : item.real
}

export const checkHealth = () => {
  return api.get(createEndpoint("HEALTH_SMS"))
}

export const getCity = () => {
  return api.get(createEndpoint("CITY"), { timeout: 1500 })
}

export const login = (credentials = {}) => {
  return api.post(createEndpoint("LOGIN"), credentials)
}

export const refreshCaptcha = () => {
  return api.get(createEndpoint("REFRESH_CAPTCHA"))
}

export const getYears = () => {
  return api.get(createEndpoint("YEARS"))
}

export const getTerms = (yearId) => {
  return api.get(createEndpoint("TERMS") + yearId)
}

export const getDiary = (termId) => {
  return api.get(createEndpoint("DIARY") + termId)
}

export const getSubject = (journalId, evaluations) => {
  return api.get(createEndpoint("SUBJECT"), {
    params: { journalId, evaluations },
  })
}

export const getGrades = (yearID) => {
  return api.get(createEndpoint("GRADES"), { params: { yearID } })
}
