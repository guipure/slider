# Slider Plugin

## [Демо-страница](https://guipure.github.io/slider/)

## Клонирование репозитория

Убедитесь, что у вас установлены [Node.js](https://nodejs.org/en/) и [Git](https://git-scm.com/). Также необходима библиотека [jQuery](https://jquery.com/) версии ^3.5.0.

В командной строке введите:

```
# Скачать репозиторий
git clone https://github.com/guipure/slider

# Изменить текущую директорию
cd slider

# Установить все зависимости
npm i
```

### Список команд

- Запустить локальный сервер для разработки: `npm run start`
- Создать production-сборку (результат помещается в папку `/dist`): `npm run build`
- Запустить тесты: `npm run test`
- Развернуть проект на GitHub Pages: `npm run deploy`

## Инициализация
Подключите библиотеку [jQuery](https://jquery.com/) версии ^3.5.0. Она должна быть загружена на страницу раньше слайдера.

Подключите стили плагина:

```html
<link rel="stylesheet" href="slider.css">
```

И сам плагин:

```html
<script src="slider.js"></script>
```

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
| from | 0 | number | Начальная позиция левого ползунка |
| to | 0 | number | Начальная позиция правого ползунка |
| hideFromTo | false | boolean | Скрытие текущих значений ползунков |
| hideScale | false | boolean | Скрытие шкалы значений |

## Архитектура плагина

Плагин построен по концепции MVP (разновидность MVC с пассивным Видом), которая предполагает наличие трёх независимых слоёв приложения: Модели, Вида и Презентера. 

- Модель ничего не знает о Виде и Презентере. Содержит бизнес-логику приложения и не производит расчётов, относящихся к Виду.

- Вид не знает о Модели и Презентере. Он содержит логику, связанную с отображением слайдера и реагирует на действия пользователя. Делится на основной вид и несколько подвидов. Каждый подвид - элемент слайдера.

- Презентер знает о Модели и Виде. С помощью паттерна "Наблюдатель" реализуется так называемое слабое связывания, которое позволяет передавать нужные данные из Вида в Модель и наоборот. Таким образом Презентер является связующим звеном между Моделью и Видом.

В итоге мы получаем три слоя приложения со слабыми связями, позволяющими разрабатывать слои независимо друг от друга. Связи же между видом и подвидами - сильные: данные передаются от основного вида к элементам слайдера напрямую через конструктор класса.

### UML-диаграмма

![UML-diagram](https://i.imgur.com/cyGCi1N.jpg)