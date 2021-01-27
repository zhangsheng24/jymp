export const phone = (value) => {
  if (!/^1[3456789]\d{9}$/.test(value.trim())) {
    return false
  } else {
    return true
  }
}

export const password = (value) => {
  if (value.trim().length < 6) {
    return false
  } else {
    return true
  }
}