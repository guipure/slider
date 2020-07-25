# Slider Plugin

## [Демо-страница](https://guipure.github.io/slider/)

## Клонирование репозитория

```
git clone https://github.com/guipure/slider
npm i
```

- Запуск в режиме разработки: `npm run start`
- Сборка в режиме продакшна: `npm run build`
- Запуск тестов: `npm run test`

## Инициализация

Для инициализации вызовите slider на элементе:

```javascript
$(#element).slider()
```

## Настройки

| Параметр | Значение по умолчанию | Тип | Описание |
|-----|----|----|----------|
| type | 'double' | string | `single` - один ползунок, `double` - два |
| orientation | 'horizontal' | string | `horizontal` - горизонтальное положение слайдера, `vertical` - вертикальное |
| min | 0 | number | Минимальное значение |
| max | 10 | number | Максимальное значение |
| step | 1 | number | Шаг: целое положительное число |
| from | 2 | number | Начальная позиция левого ползунка |
| to | 8 | number | Начальная позиция правого ползунка |
| hideFromTo | false | boolean | Скрытие текущих значений ползунков |
| hideScale | false | boolean | Скрытие шкалы значений |

## Архитектура плагина

Плагин построен по концепции MVP (разновидность MVC с пассивным Видом), которая предполагает наличие трёх независимых слоёв приложения: Модели, Вида и Презентера. 

- Модель ничего не знает о Виде и Презентере. Содержит бизнес-логику приложения и не производит расчётов, относящихся к Виду.

- Вид не знает о Модели и Презентере. Он содержит логику, связанную с отображением слайдера и реагирует на действия пользователя. Делится на основной вид и несколько подвидов. Каждый подвид - элемент слайдера.

- Презентер знает о Модели и Виде. С помощью паттерна "Наблюдатель" реализуется так называемое слабое связывания, которое позволяет передавать нужные данные из Вида в Модель и наоборот. Таким образом Презентер является связующим звеном между Моделью и Видом.

В итоге мы получаем три слоя приложения со слабыми связями, позволяющими разрабатывать слои независимо друг от друга. Связи же между видом и подвидами - сильные: данные передаются от основного вида к элементам слайдера напрямую через конструктор класса.

### UML-диаграмма

![UML-diagram](https://i.imgur.com/Yhunuj6.jpg)