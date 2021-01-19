import Vue from 'vue'

/**
 * ФИЛЬТРЫ
 *
 * Фильтр для вывода Денежного формата
 * пример использования: val | currency

/**
 * Фильтр для преобразования дат
 * timeStamp -> 12.09.2000
 */
Vue.filter('formatTsDT', function fmt(timeStamp = '') {
  if (!timeStamp) return

  var date = new Date(timeStamp * 1000)
  const year = date.getUTCFullYear()
  const month = ('0' + date.getUTCMonth() + 1).slice(-2)
  const day = ('0' + date.getUTCDate()).slice(-2)
  const hours = ('0' + date.getUTCHours()).slice(-2)
  const minutes = ('0' + date.getUTCHours()).slice(-2)
  const seconds = ('0' + date.getUTCHours()).slice(-2)

  return day + '.' + month + '.' + year
})

/**
 * Фильтр для преобразования дата/дата-время в RU формат
 * 2000-09-12 -> 12.09.2000
 * 2000-09-12 00:00 -> 12.09.2000 00:00
 * 2019-10-12 - 2000-10-31 -> 12.09.2019 - 12.09.2000
 */
Vue.filter('formatDT', function fmt(dates = '') {
  if (!dates) return
  // если data range: 2019-10-12 - 2019-10-31 - то перед обработкой разбить ее на массив с двумя датами
  if (dates.length > 17) {
    dates = dates.split(' - ')
  }
  let out = ''

  function getFormatted(date) {
    if (typeof date !== 'string') {
      return date
    }
    const year = date.substr(0, 4)
    const month = date.substr(5, 2)
    const day = date.substr(8, 2)
    const time = date.substr(11, 5)
    return (
      (day ? day + '.' : '') + month + '.' + year + (time ? ' ' + time : '')
    )
  }

  if (Array.isArray(dates)) {
    dates.forEach(date => {
      if (out) {
        out += ' - '
      }
      out += getFormatted(date)
    })
  } else {
    out = getFormatted(dates)
  }
  return out
})

/**
 * Фильтр для преобразования Boolean
 */
Vue.filter('formatBoolean', function fmt(raw = '') {
  if (raw === true || parseInt(raw) === 1) {
    return 'Да'
  } else if (raw === false || parseInt(raw) === 0 || raw === '') {
    return 'Нет'
  } else {
    return raw
  }
})

/**
 * Фильтр для преобразования Телефонных номеров
 */
Vue.filter('formatPhone', function fmt(rawPhone = '') {
  rawPhone = rawPhone.toString()
  if (!rawPhone.length) return

  if (rawPhone.substr(0, 1) === '+') return rawPhone // если правильный формат

  const countryCode = rawPhone.substr(0, 1)
  const code = rawPhone.substr(1, 3)
  const part1 = rawPhone.substr(4, 3)
  const part2 = rawPhone.substr(7, 2)
  const part3 = rawPhone.substr(9, 2)
  return (
    '+' + countryCode + ' (' + code + ') ' + part1 + '-' + part2 + '-' + part3
  )
})
