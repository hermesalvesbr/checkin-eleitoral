// useApi.ts

export default function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  const headers = {
    authtoken: config.public.authtoken,
    'Content-Type': 'application/json',
  }

  const makeRequest = async (
    endpoint: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: any
  ) => {
    const {
      data: responseData,
      error,
      pending,
    } = await useFetch(`${baseURL}${endpoint}`, {
      method: method,
      headers: headers,
      body: data,
    })
    if (error.value) {
      console.error('An error occurred:', error.value)
    }
    return { data: responseData, error, pending }
  }

  return { makeRequest }
}
