Клиентский код написан с использованием фреймворка [Vue](https://vuejs.org/) и библиотеки [UIkit](https://getuikit.com/).

Для выполнения задания знать ни то, ни другое не нужно, однако нужно изучить шаблон index.njk на предмет того, какие данные ожидаются от сервера.

Для зачёта выполненного задания достаточно реализовать те методы, которыми пользуется клиентский код.

Важный момент: для того чтобы избежать конфликта между синтаксисом Vue и Nunjucks последние настроены так, что для серверных шаблонов вместо фигурных скобок используются квадратные:

```js
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
```