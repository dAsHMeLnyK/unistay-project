/**
 * Функція для відмінювання іменників залежно від числівника (українська мова)
 * @param {number} number - Число для перевірки
 * @param {string} one - Форма для 1 (об'єкт)
 * @param {string} two - Форма для 2-4 (об'єкти)
 * @param {string} five - Форма для 5-10 і т.д. (об'єктів)
 * @returns {string} - Правильна форма слова
 */
export const getNoun = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
};