# Gulp 4 + Webpack 4 Boilerplate

* Шаблон створений з метою покращення процесу верстки і написання скриптів у
середніх та великих проектах.

<h2 id="advantages"> Основні переваги: </h2>

- Live Reload в режимі розробки при внесенні змін в файли з розширенням .js, .scss, .html.
- Можливість вкладати файли html в один одного. Частини html, які вкладаються в основний html, можуть вкладати в себе й інші частини.
- JS оброблюється за допомогою Webpack, тому доступні всі переваги ES6+, транспіляція через Babel, а також зручний import/export модулів.
- Встроєнний препроцессор Sass.
- Доступний таск для гнучкої генерація міксинів сітки SmartGrid. SmartGrid - сітка, яка, на відміну від бутстраповської сітки, пишеться виключно в css (а точніше в sass/scss), тому на виході маємо чистий, незахламлений зайвими классами html і зрозумілий фінальний сss. Плюс в gulpfile можна прописати конфіг для генерації сітки відповідно під проект.
- Разом з import/export і другими фічами webpack і ES6 можна вільно використовувати jquery і плагіни для неї. **Варто звернути увагу, що синтаксис підключення багатьох jquery-плагінів трішки відрізняється від звичайного імпорту. Приклад підключення розміщений [в розділі FAQ](#faq)**
- Sourcemaps для scss файлів **тимчасово відключена можливість через некоректну роботу**.
- Доступний таск стиснення картинок і генерації svg-спрайтів.
- Можливість білдити обфускований html та css код за допомогою таску ```npm run hardBuild```
- Встроєнний лінтер - ESLint і Prettier для стандартизованого форматування js-файлів. **Конфіг ESLint - airbnb**
- Встроєнний лінтер стилів - Stylelint для стандартизованого форматування scss-файлів.

<h2 id="requirements"> Вимоги:  </h2>

- Node: >= v12.18.1
- gulp-cli встановленний глобально (`npm i gulp-cli -g`)

**Необхідні розширення для VSCode:**

- Prettier або Prettier ESLint
- ESLint
- Stylelint

<h3 id="stylelint_vscode"> Налаштування Stylelint для VSCode  </h3>

1. В налаштуваннях Stylelint необхідно додати пункт "scss" в параметр Stylelint: Snippet і в параметр Stylelint: Validate.
2. Відкрити настройки редактора в JSON файлі (ctrl + shift + p -> Open Settings (JSON)), знайти пункт "editor.codeActionsOnSave" і надати йому такий вигляд:

```
"editor.codeActionsOnSave": {
  "source.fixAll.stylelint": true
},

```
Це дозволить при зберіганні файлу виправляти помилки  знайдені лінтером стилів, які можливо автоматично виправити.

3. ``` npx stylelint "**/*.scss" --fix ``` - команда, яка автоматично виправить (якщо це можливо) всі файли в проекті або позначить проблеми.

Для інших редакторів є відповідні [плагіни](https://stylelint.io/user-guide/integrations/editor)

<h2 id="priciples"> Принципи роботи:  </h2>

- В даному шаблоні умовно для html, scss і буквально для js файлів є точки входу(entry points); Точки входу - це саме ті файли-бандли, які потраплять в кінцеву папку build.
- Точки входу для html файлів розміщені у верхньому рівні папки src - src/. Файли html, які можуть вкладатися в основні html файли лежать в src/partials.
- Точки входу для scss файлів розміщені у верхньому рівні папки sass - src/sass/. Щоб sass-компілятор випадково не згенерував непотрібну точку входу, на початку назви додавайте " _ " - _someStyles.scss.
- Точки входу для js файлів розміщені у верхньому рівні папки js - src/js/. <br/>
**Не потрібно редагувати gulpfile.js для додавання точок входу для js. Система сама згенерує відповідні точки входу, якщо файли створені по шляху, який вказаний вище**
- При імпорті інших js файлів аліас **"@"** вказує на папку src/js/.
- Для зручного імпорту кожна папка з js-файлами повинна мати файл index.js, який експортує весь вміст цієї папки. Відповідно потім дуже зручно імпортувати файли і це не перетворюється на пекло. Наприклад це буде виглядати так:
```
import { some1, some2, some3 } from "@/utils"
```
- Якщо щось пішло не так, то краще знову ж таки спробувати перезібрати проект :)
- Browsersync відтворює сайт з папки build.

## Папки і файли

---

##### `src` folder

```
.
├── fonts (стандартні шрифти шаблону)
│
├── img (картинки)
│
├── js (js файли, в корені папки лежать точки входу для js)
│   ├── main.js (тут можливий імпорт інших js файлів)
│
├── partials (частини html, які можна перевикористувати в будь-яких html файлах)
│
├── sass (scss файли)
│   ├── abstracts (тут знаходяться файли прогамного рівня препроцесора типу міксини, функції, змінні і т.д.)
│   │   ├── _mixins/ (міксини)
│   │   │   ├── _font-face (міксин для зручного підключення шрифтів)
│   │   │   ├── _smart-grid (міксини для зручного використання layout-сітки, без використання html)
│   │   │   ├── _media-queries (міксини для зручного написання медіа-запитів)
│   │   ├── _global-varibales.scss (файл, де зібрані глобальні змінні)   
│   │
│   ├── components/ (cтилі незалежних компонентів)
│   │   ├── _accordions.scss (файл-семпл для стилів акордеонів)
│   │   ├── _buttons.scss (файл-семпл для стилів акордеонів)
│   │   ├── _index.scss (індексний файл для зручної компоновки файлів папки)
│   │   ├── _popups.scss (файл-семпл для стилів попапів)
│   │   ├── _tabs_.scss (файл-семпл для стилів табів)
│   │ 
│   ├── core/ (папка для ключових стилів проекту: reset стилів, підключення шрифтів, виправлення непотрібного зовнішнього вигляду певних тегів в браузерах)
│   │   ├── _default.scss (файл для reset'у стилів, виправлення тегів, встановлення самих базових стилів)
│   │   ├── _fonts.scss (підключення шрифтів)
│   │   ├── _index.scss (індексний файл для зручної компоновки файлів папки)
│   │   ├── _typography.scss (глобальні стилі типографіки проекту **повинен базуватися на GUI дизайнера**)
│   │   ├── _tabs_.scss (файл-семпл для стилів табів)
│   ├── helpers/ (допомоміжні стилі)
│   │   ├── _animations.scss (анімації проекту)
│   │   ├── _hacks.scss (хаки в одному місці, а не по всьому проекту :D )
│   │   ├── _index.scss (індексний файл для зручної компоновки файлів папки)
│   │   ├── _placeholders.scss (scss плейсхолдери для перевикористання css-коду)
│   │   ├── _utilities_.scss (класи для зручної верстки і перевикористання css-коду)
│   │  
│   ├── layout/ (стилі ключових типових блоків сторінки)
│   │   ├── _footer.scss (стилі футера)
│   │   ├── _grid.scss (стилі для створення сітки)
│   │   ├── _header.scss (стилі хедера)
│   │   ├── _index.scss (індексний файл для зручної компоновки файлів папки)
│   │   ├── _nav.scss (стилі навігації)
│   │   ├── _sidebar_.scss (стилі сайдбару)
│   │
│   ├── libs (папка з css бібліотеками (або підключення їх у index.scss))
│       ├── index.scss (індексний файл для зручної компоновки файлів папки та підключення бібліотек з інших папок)
│ 
│   ├── pages (стилі конкретних сторінок, може бути названа sections для верстки лендингу)
│       ├── index.scss (індексний файл для зручної компоновки файлів папки та підключення бібліотек з інших папок)
│
│   ├── _app (файл, в який імпортуються стилі, які необхідні для всього проекту, тобто з папок abstracts, components, core, helpers, layout, libs)
│   ├── main (точка входу scss (в багатосторінковому сайті це файл стилів головної сторінки сайту), сюди підключаються глобальні стилі, тобто файл _app.scss 
│             та конкретна сторінка з pages (для односторінкового підключаємо вcю папку sections)
│   
├── index.html (індексний html файл і водночас точка входу для html-partials) 

```
---

<h2 id="scripts"> Доступні скріпти:  </h2>

`npm start` чи `npm run start` чи `gulp`

Запуск проекту в режимі develompent.
Проект запуститься в дефолтному браузері по адресі: http://localhost:3000

`npm run build`

Збірка проекту в режимі production.

`npm run hardBuild`

Збірка проекту в режимі production з обфускованим html та css кодом.

<h2 id="gulpTasks"> Доступні gulp-таски:  </h2>

`gulp html` - генерація html <br/>
`gulp css` - генерація css <br/>
`gulp js` - генерація js <br/>
`gulp clean` - очистка папки build <br/>
`gulp svg` генерація svg-спрайту <br/>
`gulp sg` - генерація сітки Smart Grid <br/>
`gulp img` - стистення картинок <br/>
`gulp watch` - запуск спостерігача галпа <br/>
`gulp obfuscate` - обфускувати html та css код в папці build <br/>
`gulp build` - збірка проекту <br/>
`gulp hardBuild` - збірка проекту з обфускованим html та css кодом.<br/>
`gulp reload` - перезавантаження проекту в браузері <br/>

<h2 id="faq"> FAQ:  </h2>

### Що таке Smart Grid і для чого потрібний ?

Smart Grid - це набір міксинів для створення layout-cітки, використовуючи виключно css (scss, less, stylus). Тобто на відміну від сітки Bootstrap не потрібно використовувати массу класів в html.

### Як редагувати та генерувати набір міксинів Smart Grid ?

Конфіг для генерації Smart Grid знаходиться в gulpfile.js в таску (функції) sg, в об'єкті settings. Найважливіші налаштування це:

- Вибір кількості колонок (columns)
- Розмір контейнера і його полей (container)
- Брейкпойнти. (breakPoints)

**При найменуванні брейкпонтів важливо зберігати структуру bp_{ширина екрану}**

**ВАЖЛИВО: не редагуйте файл _smart-grid.scss напряму. Редагуйте спочатку конфіг а потім запускайте в консолі команду ```gulp sg```. Вона перезапише файл _smart-grid.scss**

### Як створювати сітку в scss, використовуючи Smart Grid ?

Для початку варто створити структуру в html. Наприклад:

```
<div class="row">
  <div class="col"></div>
  <div class="col"></div>
  <div class="col"></div>
</div>
````
Далі в scss:

```
.row {
  @include row-flex;
}

.col {
  @include col;
  @include size(4);
  @include size-bp_768(6);
}
```
- Міксин "row-flex" створює ряд, в якому будуть розміщуватися колонки. Система не вимагає створення спеціальних колонок-контейнерів, в яких буде розміщуватися контент, як це в робиться в Bootstrap. Замість .col може бути і відразу елемент з контентом.

**Міксин створює від'ємні маржини зправа і зліва, які необхідні, щоб розтягнути контент зліва і зправа контейнера. Тому якщо хочете додати верхній і нижній маржин до ..row краще це робити повним записом, аби не перебити стилі коротким записом**

```
margin-top: 100px;
margin-bottom: 100px;
```

- Міксин "col" додає до колонки маржини зліва та зрава. Маржини колонок об'єднуються в розмірі і уторюють так званий гаттер між колонками.
- Міксин "size" додає розмір колонки. Тобто скільки колонок займатиме елемент в .row на всіх екранах. У прикладі вказано 4 колонки. Міксин "size-bp_768(6)" - це розширена версія "size", але з брейкпойнтом, що означає, що .col на всіх екранах буде мати 4 колонки, але на ширині екрану 768 буде мати 6. Цей міксин будується так:

```
@include size-{назва міксину брейкпойнту}
```

### Як підключати jquery плагіни ?

Так як webpack'у доступна jquery глобально, то це означає, що можна спокійно імпортувати jquery-плагіни. Приклад імпорту jquery та плагінів. Не обов'язково імпортувати саме з папки node_modules.
```
import $ from 'jquery';

import 'node_modules/inputmask/dist/jquery.inputmask.min.js';
import 'node_modules/inputmask-multi/js/jquery.inputmask-multi.min.js';
```

### Як отримати зовнішній лінк на проект, по якому можна зайти через WI-FI?

Раніше плагін browsersync давав таку можливість, надаючи щось типу такого лінку при запуску

```
External: http://000.000.00.0:3000
```

Запустивши лінк на телефоні можна було отримати доступ до локального проекту і почати тестувати. Але зараз це працює некоректно і лінк не запустититься. Але якщо замість нього підставити IP адресу вашої WI-FI мережі, то все працюватиме:

Запустіть в консолі (windows):

```
ipconfig
```

Знайдіть активне підключення WI-FI, скопіюйте пункт IPv4 (зазвичай це IPv4) і вставте в адресу.
Адреса має виглядати так

```
http://{IPv4}:3000
```