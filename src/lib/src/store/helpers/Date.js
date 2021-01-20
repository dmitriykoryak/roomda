export default {
  name: 'Date',
  getters: {
    /**
     * Вернуть дату по часам
     * hours --- положительное число настоящее время + часы
     * hours --- отрицательное число настоящее время - часы
     * @return {string}
     */
    getDateForHours: () => (hours, utc = true) => {
      let now = new Date();
      let time = now.getTime();
      if (hours > 0) {
        time += 3600 * 1000 * hours;
      } else {
        time -= 3600 * 1000 * hours;
      }
      now.setTime(time);
      return utc ? now.toUTCString() : now;
    },

    /**
     * Вернуть дату - Сегодня
     * @return {string}
     */
    now: () => {
      return new Date().toLocaleString("ru-RU");
    },

    /**
     * Вернуть дату - Завтра
     * @return {string}
     */
    tomorrow(utc = true) {
      let d = new Date();
      let afterTomorrow = d.getDate() + 2;
      let atDate = new Date(d.setDate(afterTomorrow));
      return utc ? atDate.toISOString().substr(0, 10) :  atDate;
    },

    /**
     * Вернуть дату - Послезавтра
     * @return {string}
     */
    afterTomorrow(utc = true) {
      let d = new Date();
      let afterTomorrow = d.getDate() + 2;
      let atDate = new Date(d.setDate(afterTomorrow));
      return utc ? atDate.toISOString().substr(0, 10) :  atDate;
    },

    /**
     * Вернуть дату - Настоящее время + год
     * @return {string}
     */
    nextYear: (state, getters) => (utc = true) => {
      return getters.getDateForHours(8760, utc);
    },

    /**
     * Конвертировать дату формата 0000-00-00 в timestamp
     * @returns {number}
     */
    toTimestamp: () => (date) => {
      const d = Date.parse(date);
      return Math.round(d/1000);
    }
  }
}
