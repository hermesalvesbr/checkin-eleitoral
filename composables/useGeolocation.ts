// composables/useGeolocation.ts
export async function useGeolocation() {
  let city = null
  let region = null

  const getCityByIP = async () => {
    try {
      const response = await $fetch<{ city: string, region: string }>(
        'http://ip-api.com/json/',
      )
      if (response) {
        city = response.city || null
        region = response.region || null
      }
    }
    catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

  await getCityByIP()

  return { city, region }
}
