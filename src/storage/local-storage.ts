const isBrowser = typeof window !== "undefined"

function getStorage() {
  if (!isBrowser) {
    return null
  }

  return window.localStorage
}

export function readStorageValue<T>(key: string, fallback: T): T {
  const storage = getStorage()
  if (!storage) {
    return fallback
  }

  const rawValue = storage.getItem(key)
  if (rawValue === null) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

export function writeStorageValue<T>(key: string, value: T) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(key, JSON.stringify(value))
}

export function removeStorageValue(key: string) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.removeItem(key)
}

export function generateReadableId(length = 7) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const randomValues = new Uint8Array(length)

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues)
  } else {
    for (let index = 0; index < length; index += 1) {
      randomValues[index] = Math.floor(Math.random() * 255)
    }
  }

  return Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("")
}
