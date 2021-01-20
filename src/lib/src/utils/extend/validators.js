/**
 * Дополнительные валидаторы
 */

import VeeValidate from 'vee-validate'

/**
 * Boolean
 * @todo выдает ошибку на булев тип - разобраться
 */
VeeValidate.Validator.extend('boolean', {
  getMessage: field => 'поле ' + field + ' должно иметь булев тип.',
  validate: value => {
    let validation = value === true || value === false
    return true
  }
})

/**
 * String
 */
VeeValidate.Validator.extend('string', {
  getMessage: field => 'поле ' + field + ' должно быть строкой.',
  validate: value => {
    return true
  }
})

/**
 * Text
 */
VeeValidate.Validator.extend('text', {
  getMessage: field => 'поле ' + field + ' должно быть текстом.',
  validate: value => {
    return true
  }
})

/**
 * html
 */
VeeValidate.Validator.extend('html', {
  getMessage: field => 'поле ' + field + ' должно быть html.',
  validate: value => {
    return true
  }
})

/**
 * Each
 */
VeeValidate.Validator.extend('each', {
  getMessage: field => 'поле ' + field + ' должно быть массивом.',
  validate: value => {
    let validation = Array.isArray(value) || undefined
    return true
  }
})

/**
 * Many
 */
VeeValidate.Validator.extend('many', {
  getMessage: field => 'поле ' + field + ' должно быть массивом.',
  validate: value => {
    let validation = Array.isArray(value) || undefined
    return true
  }
})

/**
 * Many-required
 */
VeeValidate.Validator.extend('required-many', {
  getMessage: field => 'поле ' + field + ' обязательно для заполнения.',
  validate: value => {
    return (
      value &&
      value[0] !== '' &&
      value[0] !== null &&
      typeof value[0] !== 'undefined'
    )
  }
})

/**
 * Color
 */
VeeValidate.Validator.extend('color', {
  getMessage: field =>
    'поле ' + field + ' должно быть строковым значением цвета.',
  validate: value => {
    let validation = true
    return validation
  }
})

/**
 * Img
 */
VeeValidate.Validator.extend('img', {
  getMessage: field => 'поле ' + field + ' должно быть изображением.',
  validate: value => {
    return true
  }
})

/**
 * Video
 */
VeeValidate.Validator.extend('video', {
  getMessage: field => 'поле ' + field + ' должно быть url видео.',
  validate: value => {
    return true
  }
})

/**
 * Time
 */
VeeValidate.Validator.extend('time', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом времени.',
  validate: value => {
    return true
  }
})

/**
 * Year
 */
VeeValidate.Validator.extend('year', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом года.',
  validate: value => {
    if (!value) return true

    const isNumeric = !isNaN(parseInt(value))
    const yearLength = value.length === 4

    return isNumeric && yearLength
  }
})

/**
 * Phone
 */
VeeValidate.Validator.extend('phone', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом телефона.',
  validate: value => {
    //const validation = /\+?7\(?\d\d\d\)?\d\d\d-?\d\d-?\d\d/.test(value)
    if (!value) return true

    const validation = value.length >= 11
    return validation
  }
})

/**
 * Date
 */
VeeValidate.Validator.extend('date', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом даты.',
  validate: value => {
    //const validation = /(0|1|2|3)\d\.(0|1)\d\.(1|2)\d\d\d/.test(value);
    return true
  }
})

/**
 * Dt
 */
VeeValidate.Validator.extend('dt', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом даты/времени.',
  validate: value => {
    return true
  }
})

/**
 * dt_range
 */
VeeValidate.Validator.extend('dt_range', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом даты.',
  validate: value => {
    return true
  }
})

/**
 * oneOf
 */
VeeValidate.Validator.extend('oneOf', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным форматом одного из нескольких.',
  validate: value => {
    return true
  }
})

/**
 * oneOf
 */
VeeValidate.Validator.extend('money', {
  getMessage: field =>
    'поле ' + field + ' должно быть правельным денежным форматом.',
  validate: value => {
    return true
  }
})
