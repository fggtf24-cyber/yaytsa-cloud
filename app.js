import { EN, TERMS } from './i18n.js?v=70';
import { setupSocial, cropImage, askDialog, readImage, micStream, micError } from './social.js?v=49';

// Программы добавляют админы прямо на сайте. APPS — стартовый список.
// file — прямая ссылка на .exe. Для GitHub-релиза: .../releases/latest/download/<имя>.exe (всегда свежая версия).
// site — необязательно: если поля нет, кнопки «Сайт» не будет.
const APPS = [
  {
    id: 'yaytsa-cloud',
    name: 'Яйца Cloud',
    nameEn: 'Yaytsa Cloud',
    icon: 'assets/yaytsa-cloud.png?v=3',
    desc: 'Приложение Яйца Cloud для Windows: ставит и обновляет все программы с сайта в один клик, а сообщения и ответы приходят уведомлениями.',
    descEn: 'The Yaytsa Cloud app for Windows: installs and updates every program from the site in one click, with messages and replies as notifications.',
    file: 'https://github.com/fggtf24-cyber/yaytsa-cloud-desktop/releases/latest/download/YaytsaCloud.exe',
    androidFile: 'https://github.com/fggtf24-cyber/yaytsa-cloud-android/releases/latest/download/YaytsaCloud.apk',
    size: '1 МБ',
    sizeEn: '1 MB',
    repo: 'https://github.com/fggtf24-cyber/yaytsa-cloud-desktop',
    features: [
      'Все программы сайта в одном окне: «Установить», «Открыть», «Обновить» и «Удалить» без поиска файлов',
      'Сам замечает новые версии программ и напоминает обновиться',
      'Лента, профиль и чаты как на сайте, со всеми новыми функциями сразу',
      'Сообщения, ответы и лайки приходят уведомлениями Windows',
      'Значок в трее и запуск вместе с Windows, крестик прячет окно',
      'Обновляется сам',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Права администратора не нужны: ставится в папку пользователя',
    ],
    featuresEn: [
      'Every program from the site in one window: Install, Open, Update and Remove without hunting for files',
      'Notices new versions of your programs and reminds you to update',
      'Feed, profile and chats just like on the site, with every new feature right away',
      'Messages, replies and likes arrive as Windows notifications',
      'Tray icon and start with Windows, the close button hides the window',
      'Updates itself',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'No administrator rights needed: installs into your user folder',
    ],
  },
  {
    id: 'smooth-cursor',
    name: 'Smooth Cursor',
    icon: 'assets/smooth-cursor.png',
    demo: 'assets/smooth-cursor-demo.mp4',
    desc: 'Плавный курсор для записей экрана в OBS, как в Screen Studio. Клики попадают точно в цель.',
    descEn: 'A smooth cursor for OBS screen recordings, like in Screen Studio. Clicks land exactly on target.',
    file: 'https://github.com/fggtf24-cyber/smooth-cursor-obs/releases/latest/download/SmoothCursor-Setup.exe',
    linuxFile: 'https://github.com/fggtf24-cyber/smooth-cursor-obs/releases/latest/download/SmoothCursor-linux-x86_64.tar.gz',
    size: '130 МБ',
    sizeEn: '130 MB',
    repo: 'https://github.com/fggtf24-cyber/smooth-cursor-obs',
    // site: 'https://smoothcursor.ru/', // ponytail: хостинг пока лежит, раскомментировать (или вписать в редакторе), когда поднимут
    features: [
      'Запись по F9: OBS пишет видео, программа логирует курсор с частотой 240 Гц',
      'Сглаживает дёрганые движения мыши',
      'При клике курсор чуть сжимается и наклоняется',
      'Motion blur на быстрых движениях',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows, 64-бит, или Linux: X11, а на Wayland GNOME или KDE',
      'OBS Studio 30 или новее',
      'ffmpeg: если его нет, программа скачает сама (около 100 МБ)',
      'Права администратора не нужны',
    ],
    featuresEn: [
      'Record with F9: OBS captures video while the app logs the cursor at 240 Hz',
      'Smooths out jerky mouse movement',
      'The cursor squeezes and tilts slightly on click',
      'Motion blur on fast movement',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows, 64-bit, or Linux: X11, or GNOME or KDE on Wayland',
      'OBS Studio 30 or newer',
      'ffmpeg: if missing, the app downloads it (about 100 MB)',
      'No administrator rights needed',
    ],
  },
  {
    id: 'voicetype',
    name: 'VoiceType',
    icon: 'assets/voicetype.png',
    desc: 'Голосовой ввод в любое окно по горячей клавише. Работает на вашем компьютере, без облака и лимитов.',
    descEn: 'Voice typing into any window with a hotkey. Runs on your computer, no cloud and no limits. Speech recognition is tuned for Russian.',
    file: 'https://github.com/brlk33/Voice-Type/raw/main/VoiceType-Setup.exe',
    size: 'Около 7 ГБ',
    sizeEn: 'About 7 GB',
    repo: 'https://github.com/brlk33/Voice-Type',
    features: [
      'Диктовка: держите правый Ctrl и говорите, текст появится там, где стоит курсор',
      'Длинные записи: текст распознаётся по ходу записи',
      'Файлы: аудио и видео любой длины в текст',
      'YouTube: текст ролика по ссылке',
      'Чистая речь: убирает «э-э», «м-м» и повторы',
      'Словарь замен для терминов',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Видеокарта NVIDIA рекомендуется, без неё работает на процессоре медленнее',
      'Около 7 ГБ на диске',
      'Интернет на время установки: 10–20 минут, установщик сам скачает всё нужное',
    ],
    featuresEn: [
      'Dictation: hold right Ctrl and speak, the text appears at the cursor',
      'Long recordings: text is recognized as you record',
      'Files: audio and video of any length to text',
      'YouTube: video text from a link',
      'Clean speech: removes filler sounds and repeats',
      'Replacement dictionary for terms',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'NVIDIA graphics card recommended, it runs slower on the CPU',
      'About 7 GB of disk space',
      'Internet during installation: 10–20 minutes, the installer downloads everything it needs',
    ],
  },
  {
    id: 'yaytsechist',
    name: 'Яйцечист',
    nameEn: 'Yaytsechist',
    icon: 'assets/yaytsechist.png',
    desc: 'Чистит Windows от мусора, показывает, что занимает место на диске, и ускоряет отклик в играх.',
    descEn: 'Cleans junk from Windows, shows what takes up disk space and improves game responsiveness.',
    file: 'https://github.com/fggtf24-cyber/yaytsechist/releases/latest/download/Yaytsechist.exe',
    size: '31 МБ',
    sizeEn: '31 MB',
    portable: true,
    repo: 'https://github.com/fggtf24-cyber/yaytsechist',
    features: [
      'Оптимизация для игр: свой план питания, таймер 0.5 мс, отключение Game DVR. Всё возвращается одной кнопкой',
      'Очистка диска: временные файлы, кэш обновлений, браузеров и лаунчеров, отчёты об ошибках, корзина',
      'Место на диске: схема из прямоугольников, папки по размеру, самые большие файлы, поиск, выгрузка в CSV',
      'Очистка памяти: вручную, по порогу загрузки или по расписанию',
      'Работа в фоне: значок в трее и запуск вместе с Windows',
      'Обновляется сама при запуске',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Права администратора: программа попросит их при запуске',
      'Часть настроек оптимизации требует перезагрузки',
      'Очистка диска удаляет файлы навсегда, в корзину отправляет только вкладка «Место на диске»',
    ],
    featuresEn: [
      'Game optimization: custom power plan, 0.5 ms timer, Game DVR off. One button restores everything',
      'Disk cleanup: temp files, update, browser and launcher caches, error reports, recycle bin',
      'Disk space: treemap, folders by size, largest files, search, CSV export',
      'Memory cleanup: manual, by load threshold or on a schedule',
      'Background mode: tray icon and start with Windows',
      'Updates itself on launch',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'Administrator rights: the app asks for them on launch',
      'Some optimization settings need a restart',
      'Disk cleanup deletes files permanently, only the Disk space tab sends them to the recycle bin',
    ],
  },
  {
    id: 'fig2ae',
    name: 'Fig2AE',
    icon: 'assets/fig2ae.png',
    desc: 'Переносит макеты из Figma в After Effects одной кнопкой: фигуры, текст, градиенты и эффекты остаются редактируемыми.',
    descEn: 'Moves Figma designs into After Effects with one button: shapes, text, gradients and effects stay editable.',
    file: 'https://github.com/fggtf24-cyber/fig2ae/raw/main/Fig2AE-Setup.exe',
    silent: '/quiet', // самодельный установщик: ключ тихой установки для приложения Яйца Cloud
    macInstall: 'curl -fsSL https://raw.githubusercontent.com/fggtf24-cyber/fig2ae/main/install-mac.sh | bash',
    size: '190 КБ',
    sizeEn: '190 KB',
    repo: 'https://github.com/fggtf24-cyber/fig2ae',
    features: [
      'Выделили фрейм в Figma, нажали «Send selection to Ae» — композиция появляется в открытом проекте After Effects',
      'Новая композиция или прямо в текущую, с позиции курсора на таймлайне, как в AEUX',
      'Фигуры, живой текст, градиенты, тени, блюры и маски переносятся редактируемыми. Что не переносится один в один, плагин показывает списком',
      'Прямоугольники и эллипсы можно получать параметрическими фигурами AE',
      'Группы — прекомпами или null-слоями. Кнопки Precomp, Un-Precomp и удаление null-слоёв групп',
      'Окно прогресса прямо в After Effects: сколько слоёв перенеслось, кнопки «Стоп» (оставить построенное) и «Отмена» (убрать всё)',
      'В окне Project всё по папкам: Fig2AE → кадр → композиция, Precomps, Images; повторный перенос — «(2)», «(3)»',
      'Отдельный элемент кадра встаёт на своё место в композиции, а не в левый верхний угол',
      'Галочка «Skip invisible layers»: не переносит то, что не видно в кадре — за границами, под маской, скрытое',
      'Линии графиков — один живой путь с обводкой AE, пунктир через Dashes',
      'Референсный кадр из Figma поверх, чтобы сверить результат',
      'Кнопка Log: журнал ошибок копируется одним нажатием',
      'Обновляется сама, без переустановки и перезапуска After Effects',
    ],
    needs: [
      'Windows 10 или 11, либо macOS',
      'After Effects 2022 или новее',
      'Figma desktop: плагин подключается через Plugins → Development → Import plugin from manifest',
      'Установка на Windows: запустите Fig2AE-Setup.exe и нажмите «Установить»',
      'Установка на Mac: одна строка в Терминале, Node.js не нужен',
      'На Mac нет окна прогресса в After Effects: «Стоп» и «Отмена» находятся в окне плагина Figma',
      'Права администратора не нужны',
    ],
    featuresEn: [
      'Select a frame in Figma, press "Send selection to Ae" — the comp appears in the open After Effects project',
      'New comp or straight into the current one, at the playhead, like AEUX',
      'Shapes, live text, gradients, shadows, blurs and masks stay editable. Anything not transferred 1:1 is listed by the plugin',
      'Rectangles and ellipses can come in as AE parametric shapes',
      'Groups as precomps or null layers. Precomp, Un-Precomp and delete-group-nulls buttons',
      'Progress window right in After Effects: layers done so far, Stop (keep what is built) and Cancel (remove everything)',
      'Tidy Project panel: Fig2AE → frame → comp, Precomps, Images; a repeated import becomes "(2)", "(3)"',
      'A single element of a frame lands where it is in the frame, not in the top-left corner',
      '"Skip invisible layers": leaves out what can\'t be seen in the frame — off-frame, under a mask, hidden',
      'Chart lines come in as one live path with an AE stroke, dashes via Dashes',
      'Figma reference frame on top to compare the result',
      'Log button: the error log is copied in one click',
      'Updates itself, no reinstall and no After Effects restart',
    ],
    needsEn: [
      'Windows 10 or 11, or macOS',
      'After Effects 2022 or newer',
      'Figma desktop: the plugin is added via Plugins → Development → Import plugin from manifest',
      'Windows setup: run Fig2AE-Setup.exe and click Install',
      'Mac setup: one line in Terminal, no Node.js needed',
      'On a Mac there is no progress window in After Effects: Stop and Cancel are in the Figma plugin window',
      'No administrator rights needed',
    ],
  },
  {
    id: 'yaytsa-timer',
    name: 'Яйцетаймер',
    nameEn: 'Яйцетаймер',
    icon: 'assets/yaytsa-timer.png?v=3',
    desc: 'Помодоро-таймер с учётом рабочих часов. Проекты с дедлайнами, время в программах как в Steam, карта активности из квадратиков и напоминание поверх всех окон.',
    descEn: 'A pomodoro timer that tracks your work hours. Projects with deadlines, Steam-like time in your programs, an activity heatmap and a reminder on top of every window.',
    file: 'https://github.com/brlk33/Yaytsa-Timer/raw/main/YaytsaTimer-Setup.exe',
    androidFile: 'https://github.com/brlk33/Yaytsa-Timer/raw/main/YaytsaTimer.apk',
    size: '3 МБ',
    sizeEn: '3 MB',
    repo: 'https://github.com/brlk33/Yaytsa-Timer',
    features: [
      'Свои интервалы: по умолчанию 25/5, работа и перерыв меняются с шагом 5 минут',
      'Учёт часов: каждый заход записывается вместе с задачей, над которой вы работали',
      'Кнопка «Стоп»: можно закончить заход раньше — от 10 минут работа сохранится, но таймер мягко уговорит доделать',
      'Серии: выберите число заходов и время начала, например 4 по 50 минут с 14:00, и таймер сам проведёт их подряд с перерывами. После последнего захода перерыва нет — и после одиночного тоже',
      'Проекты: время по каждому проекту и дедлайны, выбор проекта из списка прямо на таймере. Готовый проект отмечаете галочкой — он уходит в архив',
      'Время в программах как в Steam: сколько часов открыта программа и сколько вы в ней активно работали — за сегодня, неделю, месяц, 3 месяца или всё время. Поиск по всем программам на компьютере, у каждой своя иконка',
      'Статистика: сегодня, 7 и 30 дней, столбики или карта активности из квадратиков за 3 месяца, полгода или год, цель на день, выгрузка и загрузка CSV',
      'Напоминание справа снизу поверх любых окон и видео во весь экран. Не исчезает, пока не нажмёте',
      'Работа в фоне: значок в трее, крестик прячет окно, таймер идёт дальше. Прогресс виден прямо на значке в панели задач',
      'Запуск вместе с Windows, сразу в трей',
      'Кнопка «Тест 5 сек», чтобы проверить звук и напоминание',
      'Интерфейс в стиле Notion: свой заголовок окна, плавные анимации, тёмная и светлая тема, русский и английский',
      'Адаптивный интерфейс: окно можно сделать маленьким, лишнее аккуратно прячется. Масштаб на Ctrl + и Ctrl −',
      'Обновляется сама: новая версия скачивается в фоне, установка по кнопке «Перезапустить»',
      'Синхронизация ПК и телефона через аккаунт Яйца Cloud: запустили таймер на телефоне — он идёт и на ПК. История, проекты и настройки одинаковые везде',
      'Есть версия для Android, сделанная под большой палец: вкладки-иконки внизу, переход свайпом, крупные кнопки внизу экрана. Обратный отсчёт в шторке, сигнал в конце захода даже при закрытом приложении, свой звук сигнала',
    ],
    needs: [
      'Windows 10 или 11, 64-бит',
      'Около 3 МБ на диске',
      'Работает на встроенном в Windows движке Edge (WebView2), он есть в Windows 10 и 11',
      'Права администратора не нужны',
      'Для телефона: Android 8 или новее, APK весит около 130 КБ',
    ],
    featuresEn: [
      'Custom intervals: 25/5 by default, focus and break change in 5-minute steps',
      'Hour tracking: every session is saved with the task you worked on',
      'A Stop key: finish a session early and from 10 minutes on the work is kept, though the timer gently talks you into finishing',
      'Series: pick how many sessions and when to start, say four 50-minute sessions from 2 pm, and the timer runs them back to back with breaks. No break after the last session, or after a single one',
      'Projects: time and deadlines per project, picked from a list right on the timer. Tick a finished project and it moves to the archive',
      'Steam-like time in your programs: hours a program was open and hours you actively used it, for today, a week, a month, 3 months or all time. Search across every program on the PC, each with its own icon',
      'Stats: today, 7 and 30 days, bars or an activity heatmap for 3 months, 6 months or a year, daily goal, CSV export and import',
      'A bottom-right reminder on top of any window and fullscreen video. It stays until you click it',
      'Runs in the background: tray icon, the close button hides the window and the timer keeps going. Progress shows right on the taskbar button',
      'Launch with Windows, straight to the tray',
      'A "Test 5 sec" button to check the sound and the reminder',
      'Notion-style interface: its own title bar, smooth animations, dark and light theme, Russian and English',
      'Responsive layout: make the window small and the extras tuck away neatly. Zoom with Ctrl + and Ctrl −',
      'Updates itself: the new version downloads in the background and installs with one "Restart" click',
      'Sync between PC and phone with your Яйца Cloud account: start the timer on the phone and it runs on the PC too. History, projects and settings match everywhere',
      'An Android version made for your thumb: icon tabs at the bottom, swipe between them, big buttons low on the screen. A countdown in the notification shade, an alert at the end of a session even when the app is closed, your own alert sound',
    ],
    needsEn: [
      'Windows 10 or 11, 64-bit',
      'About 3 MB of disk space',
      'Runs on the Edge engine built into Windows (WebView2), included in Windows 10 and 11',
      'No administrator rights needed',
      'On the phone: Android 8 or newer, the APK is about 130 KB',
    ],
  },
  {
    id: 'forma',
    name: 'Forma',
    icon: 'assets/forma.png',
    demo: 'assets/forma-demo.mp4',
    desc: 'Конвертер файлов с круговым меню: тащите файл в Проводнике, жмёте Shift и отпускаете над нужным форматом. Раньше называлась Sweetch.',
    descEn: 'A file converter with a radial menu: drag a file in Explorer, press Shift and drop it on the format you need. Formerly Sweetch.',
    file: 'https://github.com/fggtf24-cyber/Sweetch/releases/latest/download/Forma-Setup.exe',
    size: '101 МБ',
    sizeEn: '101 MB',
    repo: 'https://github.com/fggtf24-cyber/Sweetch',
    features: [
      'Перетащите файл в Проводнике или на рабочем столе, нажмите Shift и отпустите над нужным форматом',
      'Ctrl открывает инструменты, Alt действия. Без мыши: Ctrl + Alt + Space',
      'Изображения, включая RAW с камер, аудио, видео, PDF, документы, таблицы, презентации, субтитры и архивы',
      'Качество остаётся исходным, а сами файлы не перезаписываются',
      'Всё работает на вашем компьютере',
      'Обновляется сама',
    ],
    needs: [
      'Windows 10 (1809 или новее) или 11, 64-бит',
      'LibreOffice для части операций с Office и PDF, ставится отдельно',
    ],
    featuresEn: [
      'Drag a file in Explorer or on the desktop, press Shift and drop it on the format you need',
      'Ctrl opens tools, Alt opens actions. Without a mouse: Ctrl + Alt + Space',
      'Images, including camera RAW, audio, video, PDF, documents, spreadsheets, presentations, subtitles and archives',
      'Quality stays the same and your original files are not overwritten',
      'Everything runs on your computer',
      'Updates itself',
    ],
    needsEn: [
      'Windows 10 (1809 or newer) or 11, 64-bit',
      'LibreOffice for some Office and PDF operations, installed separately',
    ],
  },
];

// Стартовый список «Других проектов». Правки админов лежат в Firestore и накладываются поверх APPS и PROJECTS.
const PROJECTS = [
  {
    id: 'soundcloud',
    name: '52swag jams',
    desc: 'Наша музыка на SoundCloud.',
    descEn: 'Our music on SoundCloud.',
    url: 'https://soundcloud.com/f-fggt/sets/52swag-jams',
  },
];

// Публичный конфиг: этот ключ не секрет, он и должен быть на клиенте. Запись защищают правила в firestore.rules.
const FIREBASE = {
  apiKey: 'AIzaSyB5N_ynBpx9cD8cyy4da_HFMHVc-qZ_YyU',
  authDomain: 'yaytsa-cloud.firebaseapp.com',
  projectId: 'yaytsa-cloud',
  appId: '1:404414364346:web:074a88baecb305d25aa083',
};
const FIREBASE_CDN = 'https://www.gstatic.com/firebasejs/13.1.0/';

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Неверная почта или пароль.',
  'auth/invalid-email': 'Проверьте адрес почты.',
  'auth/missing-password': 'Введите пароль.',
  'auth/weak-password': 'Пароль должен быть не короче 6 символов.',
  'auth/email-already-in-use': 'Эта почта уже зарегистрирована. Попробуйте войти.',
  'auth/too-many-requests': 'Слишком много попыток. Подождите немного.',
  'auth/network-request-failed': 'Нет связи с сервером. Проверьте интернет.',
  'auth/popup-blocked': 'Браузер заблокировал окно входа. Разрешите всплывающие окна.',
  'auth/account-exists-with-different-credential': 'Эта почта уже зарегистрирована другим способом.',
  'permission-denied': 'Нет прав на это действие. Для правок войдите через Google с почтой админа.',
  'username/invalid': 'Имя пользователя: 1–20 символов, латиница, цифры и _.',
  'username/unknown': 'Такого @имени нет. Проверьте соавторов.',
  'link/invalid': 'Такую ссылку сайт не знает. Проверьте её или посмотрите список соцсетей.',
  'link/duplicate': 'Две ссылки на одну соцсеть. Оставьте одну.',
  'username/taken': 'Это имя уже занято. Попробуйте другое.',
};

const view = document.getElementById('view');
const search = document.getElementById('search');
const avatar = document.getElementById('avatar');
const toastEl = document.getElementById('toast');
const bellWrap = document.getElementById('bell-wrap');
const bell = document.getElementById('bell');
const bellCount = document.getElementById('bell-count');
const bellPanel = document.getElementById('bell-panel');
const meMenu = document.getElementById('me-menu');
const cookieBar = document.getElementById('cookie');

// Язык: сохранённый выбор, иначе язык браузера.
function savedLang() {
  try {
    const stored = localStorage.getItem('lang');
    if (stored === 'ru' || stored === 'en') return stored;
  } catch { /* приватный режим: просто не запомним */ }
  return navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
let lang = savedLang();

// Перевод интерфейса: ключ в словаре EN — сама русская строка.
const T = (text, vars = {}) => (lang === 'en' ? EN[text] ?? text : text).replace(/\{(\w+)\}/g, (_, k) => vars[k]);
// Перевод содержимого: поле descEn и другие, если заполнено, иначе русский текст.
const tr = (item, field) => (lang === 'en' && item[`${field}En`]?.length ? item[`${field}En`] : item[field]);
const nm = a => tr(a, 'name');

function applyStaticText() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = T(el.dataset.t); });
  document.querySelectorAll('[data-t-placeholder]').forEach(el => { el.placeholder = T(el.dataset.tPlaceholder); });
  document.querySelectorAll('[data-t-label]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.tLabel)); });
  const button = document.getElementById('lang');
  button.textContent = lang === 'ru' ? 'EN' : 'RU';
  button.setAttribute('aria-label', T(lang === 'ru' ? 'Переключить на английский' : 'Переключить на русский'));
  drawThemeButton();
  if (auth) auth.languageCode = lang;
  if (!user) avatar.textContent = initial();
}

const isLight = () => document.documentElement.dataset.theme === 'light';

function drawThemeButton() {
  const label = T(isLight() ? 'Тёмная тема' : 'Светлая тема');
  const button = document.getElementById('theme');
  button.setAttribute('aria-label', label);
  button.title = label;
}

function toggleTheme() {
  const next = isLight() ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch { /* приватный режим */ }
  drawThemeButton();
  sendTheme();
}

function setLang(next) {
  lang = next;
  try { localStorage.setItem('lang', next); } catch { /* приватный режим */ }
  applyStaticText();
  drawBell();
  render();
}

const PROJECTS_TAB = 'projects';
const COMMUNITY_TAB = 'community';
const AUTHORS_TAB = 'authors';
let cat = 'all';
let authMode = 'login';
let fb = null;          // модуль firebase-auth
let fs = null;          // модуль firebase-firestore
let auth = null;
let db = null;
let user = null;
let realAdmin = false; // почта есть в admins
let isMod = false;     // документ mods/<uid>: отстраняет, банит, удаляет посты и комментарии, но не ходит в админку
let isAdmin = false;   // админские кнопки на экране: админ может смотреть сайт глазами обычного пользователя
let authState = 'loading';    // loading | ready | failed
let contentState = 'loading'; // loading | ready | failed
let authors = {};   // uid админа -> { name }: публичные имена для поля «Автор»
let messages = [];  // личка: полученные и отправленные
let replies = [];   // ответы в личке
let stopMessages = [];
let notifications = [];
let stopNotifications = [];
let broadcasts = []; // посты с @everyone
let contentReady = null; // промис загрузки каталога из базы
let profile = {};  // users/<uid>: name, photo, birthday (ГГГГ-ММ-ДД или ММ-ДД, видит только владелец)
let apps = APPS;
let projects = PROJECTS;

// Всё, что вводят в редакторе, попадает в разметку только через esc и safeUrl.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const safeUrl = u => (/^(https:\/\/|assets\/)/.test(u || '') ? esc(u) : '');
// Из ссылки берём только id ролика: в плеер не попадает ничего, что написал автор.
const youtubeId = u => /^https:\/\/(?:(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})(?![\w-])/.exec(u || '')?.[1] || '';
// Иконка: файл сайта, ссылка или картинка, загруженная в редакторе и сохранённая строкой.
const icon = a => (/^data:image\/(png|jpeg|webp);base64,/.test(a.icon || '') ? esc(a.icon) : safeUrl(a.icon)) || 'assets/favicon.svg';

// Профили, посты, подписки и чаты живут в social.js. Модулю отдаём доступ к общему состоянию через геттеры.
const social = setupSocial({
  T, esc, view, nm, icon,
  get fs() { return fs; },
  get db() { return db; },
  get user() { return user; },
  get isAdmin() { return isAdmin; },
  get isStaff() { return isAdmin || isMod; },
  get lang() { return lang; },
  get apps() { return apps; },
  get authState() { return authState; },
  get birthday() { return profile.birthday || ''; },
  authorApps: uid => authorApps(uid),
  push: (kind, id) => pushSend(kind, id),
  route: () => route(),
  render: () => render(),
  toast: text => toast(text),
  notify: (...args) => notify(...args),
  drawInboxCount: () => drawInboxCount(),
  drawRail: () => drawRail(),
  onAppLike: (id, d) => { likes[id] = (likes[id] || 0) + d; },
});

/* ---------- Приложения ---------- */

// Значки систем, для которых есть сборка. Windows есть всегда, остальные по наличию файла.
const OS_ICON = {
  Windows: 'M3 5.5l7.5-1v7H3zM11.5 4.4L21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.4z',
  macOS: 'M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8zM14.2 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.7-1.3z',
  Linux: 'M12 2C9.5 2 8 4 8 7c0 1.5-.5 2.5-1.5 4S4 14.5 5 17c.5 1.3 2 2 3 3 1 .8 2.3 2 4 2s3-1.2 4-2c1-1 2.5-1.7 3-3 1-2.5-.5-4.5-1.5-6S16 8.5 16 7c0-3-1.5-5-4-5z',
  Android: 'M6 18v-8h12v8a1 1 0 0 1-1 1h-1v2.5a1.5 1.5 0 0 1-3 0V19h-2v2.5a1.5 1.5 0 0 1-3 0V19H7a1 1 0 0 1-1-1zM3.5 10A1.5 1.5 0 0 1 5 11.5v5a1.5 1.5 0 0 1-3 0v-5A1.5 1.5 0 0 1 3.5 10zm17 0a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-3 0v-5a1.5 1.5 0 0 1 1.5-1.5zM6 9a6 6 0 0 1 12 0z',
};
const platform = a => `<span class="platforms">${['Windows', a.macInstall && 'macOS', a.linuxFile && 'Linux', a.androidFile && 'Android'].filter(Boolean)
  .map(os => `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" role="img" aria-label="${os}"><title>${os}</title><path d="${OS_ICON[os]}"/></svg>`).join('')}</span>`;
const isMac = /Macintosh/.test(navigator.userAgent);
const isLinux = /Linux/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
// Сайт открыт в приложении Яйца Cloud для Windows: программы ставятся, открываются и обновляются кнопкой.
const desktop = / YaytsaCloud\//.test(navigator.userAgent) ? window.chrome?.webview : null;
// Приложение Яйца Cloud для Android: тот же сайт в WebView, мост YaytsaAndroid (MainActivity.kt).
// Ставить программы оно не умеет, только тема, уведомления и вход через Google.
const android = / YaytsaCloudAndroid\//.test(navigator.userAgent) && window.YaytsaAndroid ? {
  postMessage: m => window.YaytsaAndroid.post(JSON.stringify(m)),
  addEventListener: (_, f) => addEventListener('yaytsa-app', e => f({ data: e.detail })),
} : null;
const host = desktop || android; // любое из двух приложений
// В приложении вход и настройки лежат в его собственной папке, а не в браузере.
if (host) {
  const note = cookieBar.querySelector('[data-t]');
  note.dataset.t = 'Мы храним в приложении вход и настройки: без этого оно не работает. Рекламы и слежки нет.';
  note.textContent = T(note.dataset.t);
}
// Заголовок окна приложения красится в цвет сайта, а полоса прокрутки — в стиле сайта.
function sendTheme() {
  // Цвет берём из переменной темы: у фона страницы плавный переход, и в первый момент он ещё старый.
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  host?.postMessage({ type: 'theme', bg, light: isLight() });
  // Полоса с часами у сайта на экране «Домой» (iPhone, Android) — тоже в цвет темы.
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', bg);
}
sendTheme();
if (host) {
  // in-app — полосы прокрутки в стиле сайта; на телефоне их и так нет.
  if (desktop) document.documentElement.classList.add('in-app');
  document.getElementById('rail-settings').hidden = !desktop;
}
// Сообщения, общие для обоих приложений: клик по уведомлению, ошибка, вход через Google из браузера.
host?.addEventListener('message', ({ data }) => {
  if (data.type === 'go' && data.href) location.hash = data.href.replace(/^#/, '');
  else if (data.type === 'error') toast(data.text);
  else if (data.type === 'google-cred' && data.idToken) attempt(() => fb.signInWithCredential(auth, fb.GoogleAuthProvider.credential(data.idToken, data.accessToken || null)));
});

/* ---------- Уведомления на телефон и в браузер (Web Push) ---------- */
// Рассылает сервер на Cloudflare (yaytsa-cloud-push). Тот, кто написал ответ или сообщение, сообщает ему id записи,
// сервер проверяет её в базе и шлёт адресату. На iPhone работает у сайта, добавленного на экран «Домой» (iOS 16.4+).
const PUSH = 'https://yaytsa-cloud-push.fggtf24.workers.dev';
const PUSH_KEY = 'BAfvxfbfWiIrW66dJji5Sb1iy_1gSZjTJvkIbLKxXBpf5i2moye336KCS4Gw1IY8BovTfo9D3FnW0VOJW-TAM08';
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
// В приложениях для Windows и Android уведомления свои.
const webPush = !host && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
if (!host && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('message', ({ data }) => { if (data?.type === 'go' && data.href) location.hash = data.href.replace(/^#/, ''); });
}
async function pushApi(path, data) {
  if (!user) return;
  const r = await fetch(PUSH + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: await user.getIdToken(), ...data }) });
  if (!r.ok) throw new Error('push ' + r.status);
}
// Отправитель зовёт сервер после записи в базу: уведомление дойдёт, даже если у адресата всё закрыто.
const pushSend = (kind, id) => { pushApi('/send', { kind, id }).catch(() => {}); };
const pushSub = async () => (webPush ? (await navigator.serviceWorker.ready).pushManager.getSubscription() : null);
// Вошёл в аккаунт — подписка этого устройства переходит к нему (и обновляется, если браузер её сменил).
async function pushRelink() {
  const sub = Notification.permission === 'granted' ? await pushSub() : null;
  if (sub) await pushApi('/subscribe', { sub: sub.toJSON() });
}
async function setPush(on, perm) {
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (on) {
    if ((await perm) !== 'granted') throw new Error('denied');
    sub ||= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: Uint8Array.from(atob(PUSH_KEY.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)) });
  }
  if (sub) await pushApi('/subscribe', { sub: sub.toJSON(), off: !on });
  if (!on && sub) await sub.unsubscribe();
}
// Карточка в аккаунте: включить уведомления на этом устройстве.
const pushCard = () => (host ? '' : `
        <section class="edit-card" id="push-card">
          <div class="edit-title"><h2>${T('Уведомления')}</h2><p>${T('Ответы, лайки и сообщения приходят на это устройство, даже когда сайт закрыт.')}</p></div>
          <p class="msg" id="push-note" hidden></p>
          <div class="edit-account-actions"><button type="button" class="btn" id="push-toggle" hidden></button></div>
        </section>`);
async function drawPush(note = '') {
  const card = view.querySelector('#push-card');
  if (!card) return;
  const btn = card.querySelector('#push-toggle'), msg = card.querySelector('#push-note');
  const say = t => { msg.textContent = t; msg.hidden = !t; };
  if (isIOS && !standalone) {
    btn.hidden = true;
    return say(T('На iPhone: нажмите «Поделиться» → «На экран Домой» и откройте Яйца Cloud с экрана Домой. Там появится кнопка «Включить».'));
  }
  if (!webPush) { btn.hidden = true; return say(T('Этот браузер не умеет показывать уведомления.')); }
  const on = Notification.permission === 'granted' && !!(await pushSub().catch(() => null));
  btn.hidden = false;
  btn.textContent = T(on ? 'Выключить' : 'Включить');
  btn.dataset.on = on ? '1' : '';
  say(note || (Notification.permission === 'denied' ? T('Уведомления запрещены. Разрешите их в настройках браузера или телефона для этого сайта.') : ''));
}
let installed = {}; // id -> { state: installed | update | busy, progress, open }, присылает приложение
const desktopButton = (a, cls = 'btn') => {
  const s = installed[a.id];
  const [act, label] = !s ? ['install', 'Установить'] : s.state === 'update' ? ['install', 'Обновить'] : s.state === 'busy' ? ['', s.progress >= 0 ? T('Установка {n}%', { n: Math.round(s.progress * 100) }) : s.progress === -2 ? 'Удаление…' : 'Установка…'] : s.open ? ['open', 'Открыть'] : ['', 'Установлено'];
  // «Открыть» и «Обновить» синие: это главное действие для уже установленной программы.
  const blue = s && (act === 'open' || s.state === 'update') && !cls.includes('primary') ? ' primary' : '';
  return `<button type="button" class="${cls}${blue} dt" data-dt="${act}" data-dt-id="${esc(a.id)}" data-cls="${cls}"${act ? '' : ' disabled'}>${T(label)}</button>`;
};
const removeButton = a => (installed[a.id] && installed[a.id].state !== 'busy' && installed[a.id].removable !== false
  ? `<button type="button" class="btn dt-rm" data-dt="remove" data-dt-id="${esc(a.id)}">${T('Удалить')}</button>`
  : `<span class="dt-rm" data-dt-id="${esc(a.id)}" hidden></span>`);
// Состояние поменялось: перерисовываем только кнопки, а не страницу.
function drawDesktop() {
  view.querySelectorAll('[data-dt-id]').forEach(b => {
    const a = apps.find(x => x.id === b.dataset.dtId);
    if (a) b.outerHTML = b.classList.contains('dt-rm') ? removeButton(a) : desktopButton(a, b.dataset.cls);
  });
}
const sendCatalog = () => desktop?.postMessage({ type: 'catalog', apps: apps.filter(a => safeUrl(a.file) && a.id !== 'yaytsa-cloud').map(a => ({ id: a.id, name: a.name, file: a.file, silent: a.silent || '' })) });
sendCatalog();
// Папка для программ: вкладка «Настройки» (есть только в приложении) и окно при первой установке.
// Путь можно вставить руками или выбрать кнопкой «Обзор…»; проверяет и сохраняет его приложение.
let appRoot = '';
const rootField = () => `
  <label class="field wide">${T('Папка для программ')}
    <span class="root-row">
      <input name="root" data-root required autocomplete="off" spellcheck="false" placeholder="D:\Programs" value="${esc(appRoot)}">
      <button type="button" class="btn" data-pick-root>${T('Обзор…')}</button>
    </span>
  </label>
  <p class="msg wide" role="alert" data-root-msg></p>`;
function renderSettings() {
  if (!desktop) { location.replace('#'); return; }
  document.title = `${T('Настройки')} — ${T('Яйца Cloud')}`;
  view.innerHTML = `
    <section class="section panel edit">
      <header class="edit-top"><h1>${T('Настройки')}</h1></header>
      <form id="root-form" class="edit-card">
        <div class="edit-title"><h2>${T('Установка программ')}</h2><p>${T('Новые программы ставятся сюда. Уже установленные останутся на месте.')}</p></div>
        <div class="edit-fields">${rootField()}</div>
        <div class="root-bar"><button class="btn primary">${T('Сохранить')}</button></div>
      </form>
      <form id="mic-form" class="edit-card">
        <div class="edit-title"><h2>${T('Микрофон')}</h2><p>${T('Для голосовых сообщений. Нажмите «Проверить» и скажите что-нибудь: полоска должна двигаться.')}</p></div>
        <div class="edit-fields">
          <label class="field wide">${T('Какой микрофон использовать')}<select data-mic><option value="">${T('По умолчанию')}</option></select></label>
          <meter class="wide mic-level" data-mic-level min="0" max="1" value="0" hidden></meter>
          <p class="msg wide" role="alert" data-mic-msg></p>
        </div>
        <div class="root-bar"><button class="btn primary">${T('Проверить')}</button></div>
      </form>
    </section>`;
  desktop.postMessage({ type: 'settings' });
  setupMicSettings(view.querySelector('#mic-form'));
}
// Выбор микрофона для голосовых. Названия микрофонов браузер отдаёт только после разрешения, поэтому список
// заполняется ещё раз после «Проверить».
function setupMicSettings(form) {
  const select = form.querySelector('[data-mic]');
  const meter = form.querySelector('[data-mic-level]');
  const msg = form.querySelector('[data-mic-msg]');
  const fill = async () => {
    const mics = (await navigator.mediaDevices?.enumerateDevices?.() || []).filter(d => d.kind === 'audioinput' && d.deviceId !== 'default' && d.deviceId !== 'communications');
    let saved = '';
    try { saved = localStorage.getItem('mic') || ''; } catch { /* приватный режим */ }
    select.innerHTML = `<option value="">${T('По умолчанию')}</option>` + mics.map((d, i) => `<option value="${esc(d.deviceId)}">${esc(d.label || T('Микрофон {n}', { n: i + 1 }))}</option>`).join('');
    select.value = mics.some(d => d.deviceId === saved) ? saved : '';
  };
  fill().catch(console.error);
  select.addEventListener('change', () => { try { localStorage.setItem('mic', select.value); } catch { /* приватный режим */ } });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'msg wide';
    msg.textContent = '';
    let stream;
    try { stream = await micStream(); } catch (err) { msg.textContent = micError(err, T); return; }
    await fill().catch(console.error);
    const audio = new AudioContext();
    const analyser = audio.createAnalyser();
    audio.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    meter.hidden = false;
    msg.className = 'msg ok wide';
    msg.textContent = T('Микрофон работает: {name}', { name: stream.getAudioTracks()[0]?.label || T('По умолчанию') });
    const end = Date.now() + 6000;
    const tick = () => {
      analyser.getByteTimeDomainData(buf);
      meter.value = Math.min(1, Math.max(...buf.map(v => Math.abs(v - 128))) / 64);
      if (Date.now() < end && form.isConnected) requestAnimationFrame(tick);
      else { stream.getTracks().forEach(t => t.stop()); audio.close(); meter.value = 0; meter.hidden = true; }
    };
    tick();
  });
}
// Первая установка: приложение спрашивает папку, после выбора ставим программу.
function askRoot(id) {
  const dlg = document.createElement('dialog');
  dlg.className = 'r-crop r-ask';
  dlg.innerHTML = `
    <form class="r-crop-box" id="root-ask">
      <h2>${T('Куда ставить программы?')}</h2>
      <p class="empty">${T('Вставьте путь или выберите папку. Поменять можно в настройках.')}</p>
      ${rootField()}
      <div class="r-crop-bar">
        <button type="button" class="btn" data-ask-cancel>${T('Отмена')}</button>
        <button class="btn primary">${T('Установить')}</button>
      </div>
    </form>`;
  dlg.dataset.install = id;
  dlg.querySelector('[data-ask-cancel]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => dlg.remove());
  view.append(dlg);
  dlg.showModal();
  desktop.postMessage({ type: 'settings' });
}
desktop?.addEventListener('message', ({ data }) => {
  if (data.type === 'apps') { installed = data.apps || {}; drawDesktop(); }
  else if (data.type === 'settings') {
    appRoot = data.root || '';
    if (!data.error) view.querySelectorAll('[data-root]').forEach(i => { if (!i.dataset.dirty || data.saved) { i.value = appRoot; delete i.dataset.dirty; } });
    const dlg = view.querySelector('dialog[data-install]');
    if (data.saved && dlg) { desktop.postMessage({ type: 'install', id: dlg.dataset.install }); dlg.close(); }
    view.querySelectorAll('[data-root-msg]').forEach(m => {
      m.className = data.saved ? 'msg ok' : 'msg';
      m.textContent = data.error || (data.saved ? T('Сохранено.') : '');
    });
  }
  else if (data.type === 'picked') view.querySelectorAll('[data-root]').forEach(i => { i.value = data.path; i.dataset.dirty = '1'; });
  else if (data.type === 'need-root') askRoot(data.id);
});
const download = (a, cls = 'btn') => desktop && a.id === 'yaytsa-cloud' ? '' : desktop ? desktopButton(a, cls) : `<a class="${cls} dl" data-id="${esc(a.id)}" href="${safeUrl(a.file)}" aria-label="${T('Скачать {name}', { name: esc(nm(a)) })}">${T(a.macInstall || a.linuxFile || a.androidFile ? 'Скачать для Windows' : 'Скачать')}</a>`;
const linuxButton = (a, cls = 'btn') => `<a class="${cls} dl-linux" data-id="${esc(a.id)}" href="${safeUrl(a.linuxFile)}">${T('Скачать для Linux')}</a>`;
// Внутри Android-приложения само приложение скачивать незачем.
const androidButton = (a, cls = 'btn') => android && a.id === 'yaytsa-cloud' ? '' : `<a class="${cls} dl-android" data-id="${esc(a.id)}" href="${safeUrl(a.androidFile)}">${T('Скачать для Android')}</a>`;
const iosButton = (cls = 'btn') => `<button type="button" class="${cls} ios-install">${T('Установить на iPhone')}</button>`;
const macButton = (a, cls = 'btn') => `<button type="button" class="${cls} dl-mac" data-id="${esc(a.id)}">${T('Скачать для Mac')}</button>`;
const siteLink = a => (safeUrl(a.site) ? `<a class="link" href="${safeUrl(a.site)}" target="_blank" rel="noopener">${T('Сайт')}</a>` : '');
const editLink = (kind, a) => (isAdmin ? `<a class="link" href="#edit/${kind}/${esc(a.id)}" aria-label="${T('Изменить {name}', { name: esc(nm(a)) })}">${T('Изменить')}</a>` : '');
// Каждый раз спрашиваем аккаунт: иначе Google молча входит в последний и сменить его нельзя.
const googleProvider = () => { const p = new fb.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' }); return p; };
const media = a => {
  // Файл, загруженный в заявке, лежит в demos/{id}: подставим после отрисовки, каталог его не тянет.
  if (a.demo === 'file') return `<img id="app-demo" data-app="${esc(a.id)}" alt="${T('{name} в работе', { name: esc(nm(a)) })}" hidden>`;
  // Ссылка на страницу файла в GitHub (/blob/) отдаёт HTML, а не картинку: берём сам файл (/raw/).
  const src = safeUrl(a.demo).replace(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/blob\//, '$1/raw/');
  if (!src) return '';
  return /\.(mp4|webm)(\?|$)/i.test(src)
    ? `<video src="${src}" autoplay muted loop playsinline aria-label="${T('{name} в работе', { name: esc(nm(a)) })}"></video>`
    : `<img src="${src}" alt="${T('{name} в работе', { name: esc(nm(a)) })}">`;
};
// authorUid получает баги и идеи, coauthors только подписаны на карточке.
const authorName = a => authors[a.authorUid]?.name || social.nameOf(a.authorUid);
const authorUids = a => [...new Set([a.authorUid, ...(a.coauthors || [])].filter(Boolean))];
const authorLink = uid => {
  const handle = social.handleOf(uid);
  return handle ? `<a class="link" href="#u/${esc(handle)}">@${esc(handle)}</a>` : esc(authors[uid]?.name || '');
};
const authorText = a => {
  const links = authorUids(a).map(authorLink).filter(Boolean);
  return links.length ? T(links.length > 1 ? 'Авторы: {name}' : 'Автор: {name}', { name: links.join(', ') }) : '';
};
const authorLine = a => (authorText(a) ? `<p class="author">${authorText(a)}</p>` : '');

const card = a => `
  <article class="card">
    <div class="card-head">
      <img src="${icon(a)}" alt="">
      <h2><a href="#app/${esc(a.id)}">${esc(nm(a))}</a></h2>
      ${a.community ? `<span class="tag">${T('Сообщество')}</span>` : ''}
      ${platform(a)}
    </div>
    ${authorLine(a)}
    <p>${esc(tr(a, 'desc'))}</p>
    <div class="card-foot">
      ${a.community ? social.likeBox(a.id, likes[a.id]) : ''}
      <a class="link" href="#app/${esc(a.id)}" aria-label="${T('Подробнее о {name}', { name: esc(nm(a)) })}">${T('Подробнее')}</a>
      ${siteLink(a)}
      ${editLink('apps', a)}
      ${isAndroid && a.androidFile ? androidButton(a) : isLinux && a.linuxFile ? linuxButton(a) : isMac && a.macInstall ? macButton(a) : download(a)}
    </div>
  </article>`;

const review = a => {
  const id = youtubeId(a.review);
  return id ? `
    <h2>${T('Обзор')}</h2>
    <iframe class="player review" title="${T('Обзор {name}', { name: esc(nm(a)) })}" src="https://www.youtube-nocookie.com/embed/${id}" loading="lazy"
      allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>` : '';
};

// Ссылка на soundcloud.com в проекте сама превращается в плеер.
const soundcloud = p => (/^https:\/\/soundcloud\.com\//.test(p.url || '') ? `
  <iframe class="player" title="${T('Плеер: {name}', { name: esc(p.name) })}" allow="autoplay; encrypted-media"
    src="https://w.soundcloud.com/player/?url=${encodeURIComponent(p.url)}&color=%231473e6&show_comments=false&show_teaser=false&visual=true"></iframe>` : '');

const projectCard = p => `
  <article class="card${soundcloud(p) ? ' wide' : ''}">
    <div class="card-head"><h2>${esc(p.name)}</h2></div>
    <p>${esc(tr(p, 'desc'))}</p>
    ${soundcloud(p)}
    <div class="card-foot">
      ${editLink('projects', p)}
      <a class="btn open" href="${safeUrl(p.url)}" target="_blank" rel="noopener" aria-label="${T('Открыть {name}', { name: esc(p.name) })}">${T('Открыть')}</a>
    </div>
  </article>`;

// Промо-плитка заодно карточка приложения Яйца Cloud: отдельной карточки в общей сетке у него нет.
const promo = () => {
  const a = apps.find(x => x.id === 'yaytsa-cloud');
  const app = a && !desktop && /Windows/.test(navigator.userAgent);
  // С телефона на Android (не из самого приложения) предлагаем APK.
  const phone = a && a.androidFile && isAndroid && !android;
  // На iPhone приложения нет, но сайт ставится на экран «Домой» и тогда присылает уведомления.
  const iphone = isIOS && !standalone && !host;
  return `
  <article class="card promo">
    <div class="card-head">
      <img src="assets/yaytsa-cloud.png?v=3" width="30" height="30" alt="">
      <h2>${app ? `<a href="#app/${esc(a.id)}">${esc(nm(a))}</a>` : 'Яйца Cloud'}</h2>
    </div>
    <p>${T('Все программы бесплатные. Без подписки.')}${app ? ' ' + T('Ставьте и обновляйте их в один клик в приложении для Windows.') : ''}</p>
    ${app ? `
      <div class="card-foot">
        <a class="link" href="#app/${esc(a.id)}">${T('Подробнее')}</a>
        ${editLink('apps', a)}
        ${download(a)}
      </div>` : phone ? `
      <p>${T('Лента, чаты и уведомления в приложении для Android.')}</p>
      <div class="card-foot">
        <a class="link" href="#app/${esc(a.id)}">${T('Подробнее')}</a>
        ${androidButton(a)}
      </div>` : iphone ? `
      <p>${T('Лента, чаты и уведомления на iPhone: добавьте сайт на экран «Домой».')}</p>
      <div class="card-foot">
        <button type="button" class="btn ios-install">${T('Установить на iPhone')}</button>
      </div>` : ''}
    <div class="eggs" aria-hidden="true">
      ${['#6FA8FF', '#FFB347', '#A58BFF', '#FF6F91', '#FFFFFF', '#6BE3B4', '#5ED0F0', '#FF8A5B', '#FFC531']
        .map(c => `<i style="background:${c}"></i>`).join('')}
    </div>
  </article>`;
};

function renderApps() {
  const q = search.value.trim().toLowerCase();
  const found = a => !q || `${a.name} ${nm(a)} ${authorName(a)} ${tr(a, 'desc')}`.toLowerCase().includes(q);
  const onProjects = cat === PROJECTS_TAB;
  const onCommunity = cat === COMMUNITY_TAB;
  const onAuthors = cat === AUTHORS_TAB;
  const list = (onProjects ? projects : apps.filter(a => !!a.community === onCommunity)).filter(found);
  if (onCommunity) {
    list.sort(communitySort === 'top' ? (a, b) => (likes[b.id] || 0) - (likes[a.id] || 0) || addedAt(b) - addedAt(a) : (a, b) => addedAt(b) - addedAt(a));
    if (realAdmin) fillAddedAt();
  }
  const sorts = onCommunity && list.length ? `
      <div class="r-sorts app-sorts" role="group" aria-label="${T('Сортировка')}">
        ${[['new', 'Новые'], ['top', 'Популярные']].map(([id, label]) => `<button type="button" class="r-sort" data-csort="${id}" aria-current="${id === communitySort ? 'page' : 'false'}">${T(label)}</button>`).join('')}
      </div>` : '';
  const tabs = [['all', T('Все приложения')], [COMMUNITY_TAB, T('Сообщество')], [AUTHORS_TAB, T('Топ авторов')], [PROJECTS_TAB, T('Другие проекты')]];
  // В «Сообществе» программу предлагает любой, в остальных вкладках запись сразу добавляет админ.
  const add = onCommunity ? `<a class="btn tabs-add" href="#publish">${T('Добавить программу')}</a>`
    : !isAdmin || onAuthors ? ''
    : `<a class="btn tabs-add" href="#edit/${onProjects ? 'projects' : 'apps'}/new">${T(onProjects ? 'Добавить проект' : 'Добавить программу')}</a>`;

  view.innerHTML = `
    <div class="tabs" role="group" aria-label="${T('Категории')}">
      ${tabs.map(([id, label]) => `<button type="button" data-cat="${esc(id)}" aria-pressed="${id === cat}">${esc(label)}</button>`).join('')}
      ${add}
    </div>
    <section class="section">
      <h1>${T(onProjects ? 'Другие наши проекты' : onCommunity ? 'Программы сообщества' : onAuthors ? 'Топ авторов' : 'Программы с яйцами')}</h1>
      ${sorts}
      ${onAuthors ? `<p class="empty top-note">${T('По скачиваниям всех программ автора. Соавторам скачивания тоже засчитываются.')}</p>${authorsList(q)}`
      : list.length
        ? `<div class="grid">${cat === 'all' && !q ? promo() + list.filter(a => a.id !== 'yaytsa-cloud').map(card).join('') : list.map(onProjects ? projectCard : card).join('')}</div>`
        : `<p class="empty">${T(onCommunity && !q ? 'Здесь появятся программы участников. Предложите свою первым!' : 'Ничего не нашлось.')}</p>`}
    </section>`;
}

// Значки списка на странице программы. SVG, а не символы ✓ ↓ @ !: у символов шрифта свои отступы, и в кружке они съезжают.
const META_ICONS = {
  ok: '<path d="M6.5 12.5l3.5 3.5 7.5-8"/>',
  down: '<path d="M12 6v12M7 13l5 5 5-5"/>',
  at: '<circle cx="12" cy="12" r="3.5"/><path d="M15.5 9v4.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8"/>',
  warn: '<path d="M12 6.5v7"/><path d="M12 17.5v.01"/>',
};
const metaIcon = name => `<i${name === 'ok' ? ' class="ok"' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${META_ICONS[name]}</svg></i>`;

function renderApp(a) {
  const list = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const demo = media(a);
  const features = tr(a, 'features') || [];
  const needs = tr(a, 'needs') || [];
  const size = tr(a, 'size');
  const isWindows = /Windows/.test(navigator.userAgent);
  // Яйца Cloud на iPhone ставится как сайт на экран «Домой»: кнопка с инструкцией (кроме уже установленного).
  const ios = a.id === 'yaytsa-cloud' && !host && !standalone;
  view.innerHTML = `
    <div class="app-bar">
      <a class="app-back" href="#apps" aria-label="${T('Все приложения')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </a>
      <span>${esc(nm(a))}</span>
    </div>
    <div class="app-page">
      <aside class="app-side">
        <div class="app-title">
          <img src="${icon(a)}" alt="">
          <h1>${esc(nm(a))}</h1>
        </div>
        <div class="app-platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>
          ${T('Настольные ПК')}
        </div>
        <p class="app-desc">${esc(tr(a, 'desc'))}</p>
        <ul class="app-meta">
          <li>${isWindows || (isMac && a.macInstall) || (isLinux && a.linuxFile) || (isAndroid && a.androidFile) || (ios && isIOS) ? `${metaIcon('ok')}${T('Работает на этом устройстве')}` : `${metaIcon('warn')}${T(a.macInstall ? 'Только для Windows и Mac' : a.linuxFile ? 'Только для Windows и Linux' : a.androidFile ? 'Только для Windows и Android' : 'Только для Windows')}`}</li>
          ${size ? `<li>${metaIcon('down')}${T(a.portable ? '{size}, установка не нужна' : '{size} после установки', { size: esc(size) })}</li>` : ''}
          ${authorText(a) ? `<li>${metaIcon('at')}<span>${authorText(a)}</span></li>` : ''}
          ${a.community ? `<li>${metaIcon('warn')}${T('Программу добавил участник. Админ проверил заявку, но файл вы скачиваете на свой риск.')}</li>` : ''}
        </ul>
        ${ios && isIOS ? iosButton('btn primary') + download(a) + androidButton(a) : (a.androidFile ? (isAndroid ? androidButton(a, 'btn primary') + download(a) : download(a, 'btn primary') + androidButton(a)) : a.linuxFile ? (isLinux ? linuxButton(a, 'btn primary') + download(a) : download(a, 'btn primary') + linuxButton(a)) : !a.macInstall ? download(a, 'btn primary') : isMac ? macButton(a, 'btn primary') + download(a) : download(a, 'btn primary') + macButton(a)) + (ios ? iosButton() : '')}
        ${desktop ? removeButton(a) : ''}
        ${a.community ? `<figure id="author-selfie" class="author-selfie" data-app="${esc(a.id)}" hidden></figure>` : ''}
        ${authorName(a) ? `<a class="btn report-link" href="#report/${esc(a.id)}">${T('Сообщить о баге или идее')}</a>` : ''}
        <div class="app-links">
          ${siteLink(a)}
          ${safeUrl(a.repo) ? `<a class="link" href="${safeUrl(a.repo)}" target="_blank" rel="noopener">GitHub</a>` : ''}
          ${editLink('apps', a)}
        </div>
      </aside>
      <div class="app-main">
        ${features.length ? `
          <h2>${T('Основное использование')}</h2>
          <div class="use">
            <div class="use-text">
              <p class="use-lead">${esc(features[0])}</p>
              ${list(features.slice(1))}
            </div>
            ${demo}
          </div>` : (demo ? `<div class="use">${demo}</div>` : '')}
        ${review(a)}
        ${needs.length ? `<h2>${T('Системные требования')}</h2><div class="use"><div class="use-text">${list(needs)}</div></div>` : ''}
        <h2>${T('Обсуждения')}</h2>
        <div id="app-threads" class="app-threads" data-app="${esc(a.id)}"><p class="empty">${T('Загрузка…')}</p></div>
        <p id="msg" class="msg" role="alert"></p>
      </div>
    </div>`;
  social.fillAppThreads(a.id);
  if (a.community) loadAuthorSelfie(a.id);
  if (a.demo === 'file') loadDemo(a.id);
}

async function loadDemo(id) {
  if (!fs) return;
  const image = (await fs.getDoc(fs.doc(db, 'demos', id)).catch(() => null))?.data()?.image;
  const img = document.getElementById('app-demo');
  if (img?.dataset.app !== id || !DEMO_IMAGE.test(image || '')) return;
  img.src = image;
  img.hidden = false;
}

// Селфи лежит отдельным документом: каталог грузится без него, а удалённая заявка уносит и селфи.
async function loadAuthorSelfie(id) {
  if (!fs) return;
  const image = (await fs.getDoc(fs.doc(db, 'selfies', id)).catch(() => null))?.data()?.image;
  const box = document.getElementById('author-selfie');
  if (box?.dataset.app !== id || !social.isImage(image)) return;
  box.innerHTML = `<img src="${image}" alt="${T('Селфи автора')}"><figcaption>${T('Селфи автора')}</figcaption>`;
  box.hidden = false;
}

const when = ts => ts?.toDate?.().toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', { dateStyle: 'medium', timeStyle: 'short' }) || '';

/* ---------- Звук ---------- */

// Браузер разрешает звук только после первого нажатия на странице, поэтому заводим его на этот момент.
let audio = null;
addEventListener('pointerdown', () => {
  audio ||= new AudioContext();
  audio.resume();
});

function soundOn() {
  try { return !localStorage.getItem('muted'); } catch { return true; }
}

// Две мягкие ноты вверх. Файл не нужен: звук собирается здесь же.
function ping() {
  if (!audio || !soundOn()) return;
  [[880, 0], [1175, 0.11]].forEach(([freq, delay]) => {
    const start = audio.currentTime + delay;
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.frequency.value = freq;
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(0.08, start + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
    tone.connect(volume).connect(audio.destination);
    tone.start(start);
    tone.stop(start + 0.24);
  });
}

// Звучим, только когда непрочитанных стало больше. Первые секунды после входа молчим:
// в это время подгружаются старые уведомления, и они не новые.
const heard = { bell: 0, inbox: 0 };
let quietUntil = 0;
function soundOnGrowth(kind, count, note) {
  if (count > heard[kind] && Date.now() > quietUntil) {
    ping();
    // В приложении то же самое приходит уведомлением Windows, если окно свёрнуто или в трее.
    if (host && note) host.postMessage({ type: 'notify', ...note() });
  }
  heard[kind] = count;
}

/* ---------- Уведомления ---------- */

// Сервера нет: уведомление пишет браузер того, кто ответил или лайкнул. Правила проверяют, что оно настоящее.
// У лайка id постоянный, поэтому «снял и поставил снова» второго уведомления не даст: такую запись правила отклонят.
function notify(type, commentId, to, appId, text = '') {
  if (to === user.uid) return;
  const col = fs.collection(db, 'notifications');
  const ref = type === 'like' ? fs.doc(col, `like_${commentId}_${user.uid}`)
    : type === 'follow' ? fs.doc(col, `follow_${user.uid}_${to}`)
    : type === 'mention' ? fs.doc(col, `mention_${commentId || appId}_${to}`)
    : fs.doc(col);
  fs.setDoc(ref, {
    to,
    from: user.uid,
    fromName: myName(),
    type,
    appId,
    commentId,
    text: text.slice(0, 120),
    createdAt: fs.serverTimestamp(),
    read: false,
  }).then(() => pushSend('note', ref.id)).catch(() => {}); // комментарий или лайк уже сохранён, без уведомления он не пострадает
}

function watchNotifications(u) {
  stopNotifications.forEach(stop => stop());
  stopNotifications = [];
  notifications = [];
  broadcasts = [];
  if (u) {
    // ponytail: тянем все уведомления человека и сортируем в браузере, индекс не нужен.
    stopNotifications = [
      fs.onSnapshot(
        fs.query(fs.collection(db, 'notifications'), fs.where('to', '==', u.uid)),
        snap => {
          notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          drawBell();
          drawInboxCount();
        },
        console.error,
      ),
      fs.onSnapshot(
        fs.query(fs.collection(db, 'broadcasts'), fs.orderBy('createdAt', 'desc'), fs.limit(10)),
        snap => {
          broadcasts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          drawBell();
        },
        console.error,
      ),
    ];
  }
  drawBell();
}

// @everyone: один документ на всех, поэтому прочитанность каждый браузер помнит сам.
// ponytail: на другом устройстве такой пост снова будет новым. Для общей отметки её надо хранить в users/<uid>.
function seenBroadcasts() {
  try { return +localStorage.getItem('seenBroadcasts') || 0; } catch { return 0; }
}

function allNotes() {
  const joined = Date.parse(user?.metadata.creationTime) || 0;
  const seen = seenBroadcasts();
  const everyone = broadcasts
    .filter(b => b.from !== user?.uid && (b.createdAt?.toMillis() || Date.now()) >= joined)
    .map(b => ({
      id: `b_${b.id}`, type: 'everyone', fromName: b.fromName, appId: b.id, commentId: b.id, text: b.title,
      createdAt: b.createdAt, read: (b.createdAt?.toMillis() || 0) <= seen,
    }));
  // Сообщения считает красный значок у «Сообщений», в колокольчике их нет.
  return [...notifications.filter(n => n.type !== 'dm'), ...everyone].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
}

// Лайки одного комментария сливаются в одну строку, как на YouTube. Список уже отсортирован: первым идёт самый новый.
function groupNotes(list) {
  const groups = new Map();
  for (const n of list) {
    const key = n.type === 'like' ? `like_${n.commentId}` : n.id;
    const group = groups.get(key);
    if (group) {
      group.people.push(n.fromName);
      group.read &&= n.read;
      group.text ||= n.text;
    } else {
      groups.set(key, { ...n, people: [n.fromName] });
    }
  }
  return [...groups.values()].slice(0, 30);
}

const likesWord = n => {
  if (lang === 'en') return n === 1 ? 'like' : 'likes';
  const tens = n % 100;
  const last = n % 10;
  if (tens > 10 && tens < 20) return 'лайков';
  if (last === 1) return 'лайк';
  return last > 1 && last < 5 ? 'лайка' : 'лайков';
};

const noteTitle = n => {
  const count = n.people.length;
  const names = n.people.slice(0, 2).map(p => `<b>${esc(p)}</b>`);
  const single = {
    like: 'Лайк от {name}',
    follow: '{name} подписался(-ась) на вас',
    everyone: '{name} отметил(а) всех в посте',
    mention: 'Упоминание от {name}',
    mod: n.appId ? 'Админ одобрил вашу программу' : 'Админ отклонил вашу программу',
  }[n.type] || 'Ответ от {name}';
  if (count === 1) return T(single, { name: names[0] });
  const [a, b] = names;
  const who = count === 2 ? T('{a} и {b}', { a, b }) : T('{a}, {b} и ещё {n}', { a, b, n: count - 2 });
  return `${who}: ${count} ${likesWord(count)}`;
};

// fromName и text пишут посетители: только через esc.
const noteHref = n => ({
  follow: `#uid/${esc(n.from)}`,
  treply: `#post/${esc(n.appId)}/${esc(n.commentId)}`,
  everyone: `#post/${esc(n.appId)}`,
  mention: n.commentId ? `#post/${esc(n.appId)}/${esc(n.commentId)}` : `#post/${esc(n.appId)}`,
  mod: n.appId ? `#app/${esc(n.appId)}` : '#publish',
}[n.type] || `#app/${esc(n.appId)}/${esc(n.commentId)}`);

const noteItem = n => `
  <a class="note${n.read ? '' : ' unread'}" href="${noteHref(n)}">
    <span>${noteTitle(n)}</span>
    ${n.text ? `<span class="note-text">${esc(n.text)}</span>` : ''}
    <span class="note-time">${when(n.createdAt)}</span>
  </a>`;

function drawBell() {
  const groups = groupNotes(allNotes());
  const unread = groups.filter(n => !n.read).length;
  bellWrap.hidden = !user;
  bellCount.hidden = !unread;
  bellCount.textContent = unread > 9 ? '9+' : unread;
  soundOnGrowth('bell', unread, () => {
    const n = groups.find(g => !g.read);
    const title = new DOMParser().parseFromString(noteTitle(n), 'text/html').body.textContent;
    return { title, body: n.text || '', href: noteHref(n) };
  });
  bell.setAttribute('aria-label', unread ? T('Уведомления, новых: {n}', { n: unread }) : T('Уведомления'));
  if (!bellPanel.hidden) {
    bellPanel.innerHTML = groups.map(noteItem).join('') || `<p class="empty">${T('Пока нет уведомлений.')}</p>`;
  }
}

function toggleBell(open) {
  bellPanel.hidden = !open;
  bell.setAttribute('aria-expanded', open);
  drawBell();
  if (!open) return;
  notifications.filter(n => !n.read && n.type !== 'dm').forEach(n => {
    fs.updateDoc(fs.doc(db, 'notifications', n.id), { read: true }).catch(console.error);
  });
  try { localStorage.setItem('seenBroadcasts', Date.now()); } catch { /* приватный режим */ }
}

/* ---------- Редактор (только админы) ---------- */

// [поле, подпись, тип, блок]; * в конце типа — обязательное. Поля с блоком прячутся в сворачиваемую секцию.
const FIELDS = {
  apps: [
    ['icon', 'Иконка', 'icon'],
    ['name', 'Название', 'text*'],
    ['authorUid', 'Автор (аккаунт админа)', 'author'],
    ['coauthors', 'Соавторы', 'people'],
    ['desc', 'Описание', 'area*'],
    ['file', 'Ссылка на .exe', 'url*'],
    ['size', 'Размер после установки, например 130 МБ', 'text'],
    ['features', 'Что умеет (один пункт на строку)', 'lines'],
    ['needs', 'Системные требования (один пункт на строку)', 'lines'],
    ['site', 'Сайт программы', 'url', 'Ссылки и демо'],
    ['repo', 'GitHub', 'url', 'Ссылки и демо'],
    ['demo', 'Ссылка на картинку, гифку или .mp4', 'url', 'Ссылки и демо'],
    ['review', 'Обзор на YouTube: ссылка на видео', 'url', 'Ссылки и демо'],
    ['nameEn', 'Название', 'text', 'Английская версия'],
    ['descEn', 'Описание', 'area', 'Английская версия'],
    ['sizeEn', 'Размер, например 130 MB', 'text', 'Английская версия'],
    ['featuresEn', 'Что умеет (один пункт на строку)', 'lines', 'Английская версия'],
    ['needsEn', 'Системные требования (один пункт на строку)', 'lines', 'Английская версия'],
  ],
  projects: [
    ['name', 'Название', 'text*'],
    ['desc', 'Описание', 'area'],
    ['url', 'Ссылка', 'url*'],
    ['descEn', 'Описание', 'area', 'Английская версия'],
  ],
};

// Поле формы по описанию из FIELDS. Им же собрана заявка на программу.
const field = item => ([key, label, type]) => {
  const required = type.endsWith('*') ? 'required' : '';
  const t = type.replace('*', '');
  const value = Array.isArray(item[key]) ? item[key].join('\n') : item[key] ?? '';
  if (t === 'icon') {
    return `
      <div class="field">${T(label)}
        <div class="icon-pick">
          <img id="icon-preview" src="${icon(item)}" alt="">
          <label class="btn">${T('Загрузить с компьютера')}<input id="icon-file" class="sr" type="file" accept="image/*,.heic,.heif"></label>
        </div>
        <input type="hidden" name="${key}" value="${esc(value)}">
      </div>`;
  }
  if (key === 'demo') {
    return `
      <label class="field">${T(label)}<input name="${key}" value="${esc(value)}" pattern="(https://|assets/).+|file" title="${T('Ссылка должна начинаться с https://')}"></label>
      <div class="field">${T('Или загрузите картинку либо гифку')}
        <div class="icon-pick">
          <img id="demo-preview" class="demo-preview" src="assets/favicon.svg" alt="">
          <label class="btn">${T('Загрузить файл')}<input id="demo-file" class="sr" type="file" accept="image/png,image/jpeg,image/webp,image/gif,.heic,.heif"></label>
        </div>
        <small class="r-hint">${T('Картинка до 20 МБ: после загрузки выберите, какая часть попадёт в рамку. Гифка до 500 КБ, её края обрежутся по рамке. Видео загрузить нельзя, дайте ссылку на .mp4.')}</small>
        <input type="hidden" name="demoFile">
      </div>`;
  }
  if (t === 'people') {
    const names = (item[key] || []).map(social.handleOf).filter(Boolean).map(h => `@${h}`).join(' ');
    return `
      <label class="field">${T(label)}
        <input name="${key}" value="${esc(names)}" autocomplete="off" data-suggest="@" placeholder="@neba @drug">
        <small class="r-hint">${T('Через пробел, начните с @ и выберите человека из списка.')}</small>
      </label>`;
  }
  // Автор заявки из сообщества не в списке админов, но терять его при сохранении нельзя.
  const outsider = value && !authors[value] ? `<option value="${esc(value)}" selected>${esc(social.nameOf(value) || value)}</option>` : '';
  const control = t === 'author' ? `
    <select name="${key}">
      <option value="">${T('Не указан')}</option>
      ${outsider}
      ${Object.entries(authors).map(([uid, a]) => `<option value="${esc(uid)}" ${uid === value ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}
    </select>`
    : t === 'area' || t === 'lines'
    ? `<textarea name="${key}" rows="${t === 'lines' ? 6 : 3}" ${required}>${esc(value)}</textarea>`
    : `<input name="${key}" value="${esc(value)}" ${required} ${t === 'url' ? `pattern="(https://|assets/).+" title="${T('Ссылка должна начинаться с https://')}"` : ''}>`;
  return `<label class="field">${T(label)}${control}</label>`;
};

function renderEditor(kind, id) {
  const note = text => { view.innerHTML = `<section class="section panel"><p class="empty">${text}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note(T('Загрузка…'));
  if (contentState === 'failed') return note(T('Не удалось загрузить данные. Обновите страницу.'));
  if (!isAdmin) return note(T('Редактировать могут только админы, вошедшие через Google.'));
  const item = id === 'new' ? {} : (kind === 'apps' ? apps : projects).find(x => x.id === id);
  if (!item) return note(T('Такой записи нет.'));
  view.innerHTML = `
    <section class="section panel account editor">
      <h1>${id === 'new' ? T('Новая запись') : T('Изменить: {name}', { name: esc(item.name) })}</h1>
      <form id="edit-form" class="account" data-kind="${kind}" data-id="${esc(id)}">
        ${FIELDS[kind].filter(f => !f[3]).map(field(item)).join('')}
        ${[...new Set(FIELDS[kind].map(f => f[3]).filter(Boolean))].map(group => `
          <details class="more">
            <summary>${T(group)}</summary>
            <div class="more-body">${FIELDS[kind].filter(f => f[3] === group).map(field(item)).join('')}</div>
          </details>`).join('')}
        <button class="btn primary">${T('Сохранить')}</button>
      </form>
      ${id === 'new' ? '' : `<button type="button" class="btn danger" id="delete">${T('Удалить')}</button>`}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

// Значения формы в том виде, в каком они лягут в базу.
async function readFields(form, fields) {
  const data = Object.fromEntries(new FormData(form));
  for (const [key, , type] of fields) {
    data[key] = type === 'lines' ? data[key].split('\n').map(l => l.trim()).filter(Boolean)
      : type === 'people' ? await social.uidsByNames(data[key])
      : data[key].trim();
  }
  return data;
}

async function saveItem(form) {
  const { kind, id } = form.dataset;
  const { demoFile, ...data } = await readFields(form, FIELDS[kind]);
  if (data.review && !youtubeId(data.review)) return say(T('Нужна ссылка на видео YouTube.'));
  if (demoFile) data.demo = 'file';
  // Для записей из кода (APPS/PROJECTS) в Firestore пишем только то, что отличается от кода.
  // Иначе первое же сохранение замораживает все поля, и следующие правки в коде (новая ссылка, размер) не видны на сайте.
  const base = id === 'new' ? null : (kind === 'apps' ? APPS : PROJECTS).find(x => x.id === id);
  const norm = v => (v == null || v === '' || (Array.isArray(v) && !v.length)) ? '' : v;
  if (base) for (const key of Object.keys(data)) {
    if (JSON.stringify(norm(data[key])) === JSON.stringify(norm(base[key]))) data[key] = fs.deleteField();
  }
  const col = fs.collection(db, kind);
  const ref = id === 'new' ? fs.doc(col) : fs.doc(col, id);
  await fs.setDoc(ref, data, { merge: true });
  if (demoFile) await fs.setDoc(fs.doc(db, 'demos', ref.id), { uid: user.uid, image: demoFile });
  await loadContent();
  location.hash = kind === 'apps' ? `app/${ref.id}` : 'apps';
}

/* ---------- Заявка на программу ---------- */

const PUBLISH_FIELDS = ['icon', 'name', 'coauthors', 'desc', 'file', 'size', 'features', 'needs', 'site', 'repo', 'demo', 'review']
  .map(key => FIELDS.apps.find(f => f[0] === key));

const STATUS = {
  pending: ['На проверке', 'idea'],
  approved: ['Одобрена', 'ok'],
  rejected: ['Отклонена', 'bug'],
};
const statusTag = s => `<span class="tag ${STATUS[s.status][1]}">${T(STATUS[s.status][0])}</span>`;

function renderPublish() {
  const note = html => { view.innerHTML = `<section class="section panel"><h1>${T('Добавить программу')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (authState === 'failed') return note(T('Сервис сейчас недоступен. Обновите страницу позже.'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы предложить программу.')}`);
  if (!social.hasProfile()) return note(`${T('Сначала выберите @имя.')} <a class="link" href="#account">${T('Открыть профиль')}</a>`);
  view.innerHTML = `
    <section class="section panel account editor">
      <h1>${T('Добавить программу')}</h1>
      <p class="empty">${T('Заявка уйдёт админам на проверку. После одобрения программа появится во вкладке «Сообщество».')}</p>
      <form id="publish-form" class="account">
        ${PUBLISH_FIELDS.filter(f => !f[3]).map(field({})).join('')}
        <details class="more">
          <summary>${T('Ссылки и демо')}</summary>
          <div class="more-body">${PUBLISH_FIELDS.filter(f => f[3]).map(field({})).join('')}</div>
          </div>
        </details>
        <div class="field">${T('Ваше селфи (обязательно)')}
          <div class="icon-pick">
            <img id="selfie-preview" src="assets/favicon.svg" alt="">
            <label class="btn">${T('Загрузить селфи')}<input id="selfie-file" class="sr" type="file" accept="image/*,.heic,.heif"></label>
          </div>
          <small class="r-hint">${T('После одобрения селфи будет видно всем на странице программы.')}</small>
          <input type="hidden" name="selfie">
        </div>
        <button class="btn primary">${T('Отправить на проверку')}</button>
      </form>
      <p id="msg" class="msg" role="alert"></p>
      <div id="my-subs"></div>
    </section>`;
  fillMySubmissions();
}

let mySubs = []; // свои заявки на странице «Добавить программу»

async function fillMySubmissions() {
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'submissions'), fs.where('uid', '==', user.uid)));
  const box = document.getElementById('my-subs');
  if (!box || snap.empty) return;
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  mySubs = list;
  box.innerHTML = `
    <h2 class="stats-sub">${T('Мои заявки')}</h2>
    ${list.map(s => `
      <article class="comment">
        <div class="comment-body">
          <div class="comment-head"><b>${esc(s.name)}</b>${statusTag(s)}<span>${when(s.createdAt)}</span></div>
          ${s.reason ? `<p>${T('Причина: {text}', { text: esc(s.reason) })}</p>` : ''}
          <div class="comment-actions">
            ${s.status === 'approved' ? `<a class="link" href="#app/${esc(s.id)}">${T('Открыть')}</a>` : ''}
            <button type="button" class="link linkbtn" data-del-sub="${esc(s.id)}">${T('Удалить заявку')}</button>
          </div>
        </div>
      </article>`).join('')}`;
}

// Окно согласия: без явного «да» селфи не уйдёт.
function askSelfieConsent(image) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'r-crop';
    dlg.innerHTML = `
      <form method="dialog" class="r-crop-box">
        <h2>${T('Ваше селфи увидят все')}</h2>
        <img class="consent-selfie" src="${image}" alt="">
        <p class="empty">${T('Когда админ одобрит программу, это селфи будет видно всем посетителям на её странице. Убрать его можно, удалив заявку.')}</p>
        <div class="r-crop-bar">
          <button class="btn" value="no">${T('Отмена')}</button>
          <button class="btn primary" value="yes">${T('Согласен(-на), отправить')}</button>
        </div>
      </form>`;
    document.body.append(dlg);
    dlg.addEventListener('close', () => {
      resolve(dlg.returnValue === 'yes');
      dlg.remove();
    });
    dlg.showModal();
  });
}

async function sendSubmission(form) {
  const { selfie, demoFile, ...data } = await readFields(form, PUBLISH_FIELDS);
  if (demoFile) data.demo = 'file';
  if (!selfie) return say(T('Добавьте своё селфи: без него заявку не принять.'));
  if (!/^https:\/\//.test(data.file)) return say(T('Ссылка должна начинаться с https://'));
  if (data.review && !youtubeId(data.review)) return say(T('Нужна ссылка на видео YouTube.'));
  if (!data.review) delete data.review;
  if (!await askSelfieConsent(selfie)) return;
  const sub = fs.doc(fs.collection(db, 'submissions'));
  const batch = fs.writeBatch(db);
  batch.set(sub, { ...data, uid: user.uid, status: 'pending', selfiePublic: true, createdAt: fs.serverTimestamp() });
  batch.set(fs.doc(db, 'selfies', sub.id), { uid: user.uid, image: selfie });
  if (demoFile) batch.set(fs.doc(db, 'demos', sub.id), { uid: user.uid, image: demoFile });
  await batch.commit();
  renderPublish();
  say(T('Заявка отправлена. Решение придёт в уведомления.'), true);
}

async function deleteSubmission(id) {
  if (!await askDialog(T, { title: T('Удалить заявку и селфи?'), text: T('Со страницы программы селфи тоже пропадёт.'), ok: 'Удалить', danger: true })) return;
  const batch = fs.writeBatch(db);
  batch.delete(fs.doc(db, 'submissions', id));
  batch.delete(fs.doc(db, 'selfies', id));
  if (submissions.find(s => s.id === id)?.demo === 'file' || mySubs.find(s => s.id === id)?.demo === 'file') batch.delete(fs.doc(db, 'demos', id));
  await batch.commit();
  await drawPending();
  render();
}

/* ---------- Админка ---------- */

let submissions = []; // заявки на экране админки

async function drawPending() {
  const count = document.getElementById('admin-count');
  count.hidden = true;
  if (!isAdmin) return;
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'submissions'), fs.where('status', '==', 'pending')));
  count.hidden = snap.empty;
  count.textContent = snap.size > 9 ? '9+' : snap.size;
}

const submissionCard = s => `
  <article class="comment sub">
    ${s.selfie ? `<img class="sub-selfie" src="${s.selfie}" alt="${T('Селфи автора')}">` : ''}
    <div class="comment-body">
      <div class="comment-head"><img class="sub-icon" src="${icon(s)}" alt=""><b>${esc(s.name)}</b>${statusTag(s)}<span>${when(s.createdAt)}</span></div>
      <p class="author">${authorText({ authorUid: s.uid, coauthors: s.coauthors })}</p>
      <p>${esc(s.desc)}</p>
      ${s.features?.length ? `<ul>${s.features.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      <div class="comment-actions wrap">
        ${safeUrl(s.file) ? `<a class="link" href="${safeUrl(s.file)}" target="_blank" rel="noopener nofollow">${T('Файл')}</a>` : ''}
        ${safeUrl(s.repo) ? `<a class="link" href="${safeUrl(s.repo)}" target="_blank" rel="noopener nofollow">GitHub</a>` : ''}
        ${safeUrl(s.site) ? `<a class="link" href="${safeUrl(s.site)}" target="_blank" rel="noopener nofollow">${T('Сайт')}</a>` : ''}
        ${safeUrl(s.review) ? `<a class="link" href="${safeUrl(s.review)}" target="_blank" rel="noopener nofollow">${T('Обзор')}</a>` : ''}
      </div>
      ${s.reason ? `<p>${T('Причина: {text}', { text: esc(s.reason) })}</p>` : ''}
      <div class="comment-actions wrap">
        ${s.status === 'pending' ? `
          <button type="button" class="btn primary" data-approve="${esc(s.id)}">${T('Одобрить')}</button>
          <button type="button" class="btn" data-reject="${esc(s.id)}">${T('Отклонить')}</button>` : ''}
        <button type="button" class="link linkbtn" data-del-sub="${esc(s.id)}">${T('Удалить заявку')}</button>
      </div>
    </div>
  </article>`;

async function renderAdmin(tab) {
  const shell = html => {
    view.innerHTML = `
      <section class="section panel admin">
        <header class="admin-head">
          <h1>${T('Админка')}</h1>
          <p class="empty">${T(tab === 'users' ? 'Все, кто заходил на сайт под своим аккаунтом.' : tab === 'deleted' ? 'Программы и проекты, удалённые с сайта. Их можно вернуть как были.' : 'Программы от пользователей. Одобренные появятся во вкладке «Сообщество».')}</p>
        </header>
        <div class="tabs" role="group" aria-label="${T('Разделы')}">
          <a class="tab" href="#admin" aria-current="${!['users', 'deleted'].includes(tab)}">${T('Программы на проверку')}</a>
          <a class="tab" href="#admin/users" aria-current="${tab === 'users'}">${T('Пользователи')}</a>
          <a class="tab" href="#admin/deleted" aria-current="${tab === 'deleted'}">${T('Удалённые')}</a>
        </div>
        ${html}
        <p id="msg" class="msg" role="alert"></p>
      </section>`;
  };
  const empty = text => shell(`<div class="edit-card"><p class="empty">${text}</p></div>`);
  if (authState === 'loading') return empty(T('Загрузка…'));
  if (!isAdmin) return empty(T('Этот раздел видят только админы, вошедшие через Google.'));
  empty(T('Загрузка…'));
  try {
    if (tab === 'deleted') {
      // Удаление на сайте только ставит пометку deleted: запись и всё в ней остаётся, поэтому вернуть можно целиком.
      const kinds = [['apps', APPS, 'Программа'], ['projects', PROJECTS, 'Проект']];
      const snaps = await Promise.all(kinds.map(([k]) => fs.getDocs(fs.collection(db, k))));
      if (route().tab !== 'deleted') return;
      const list = kinds.flatMap(([kind, base, label], i) => snaps[i].docs.filter(d => d.data().deleted)
        .map(d => ({ ...base.find(x => x.id === d.id), ...d.data(), id: d.id, kind, label })));
      if (!list.length) return empty(T('Удалённых нет.'));
      return shell(`
        <ul class="deleted-list">${list.map(a => `
          <li class="edit-card">
            <img src="${icon(a)}" alt="" width="36" height="36">
            <span><b>${esc(nm(a) || a.id)}</b><small>${T(a.label)} · ${esc(a.id)}</small></span>
            <button type="button" class="btn" data-restore="${esc(a.kind)}/${esc(a.id)}">${T('Вернуть')}</button>
          </li>`).join('')}
        </ul>`);
    }
    if (tab === 'users') {
      const snap = await fs.getDocs(fs.collection(db, 'accounts'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (Date.parse(b.created) || 0) - (Date.parse(a.created) || 0));
      await Promise.all([social.loadPeople(list.map(a => a.id)), social.loadRoles(list.map(a => a.id), true)]);
      if (route().tab !== 'users') return;
      const date = text => (Date.parse(text) ? new Date(text).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU') : '—');
      const way = { 'google.com': 'Google', password: T('Почта') };
      return shell(`
        <p class="empty">${T('Всего: {n}. Человек попадает сюда, когда заходит на сайт под своим аккаунтом.', { n: list.length })}</p>
        <div class="table-box"><table>
          <thead><tr><th scope="col">${T('Почта')}</th><th scope="col">${T('Логин')}</th><th scope="col">${T('Имя')}</th><th scope="col">${T('Способ входа')}</th><th scope="col">${T('Регистрация')}</th><th scope="col">${T('Был на сайте')}</th><th scope="col"><span class="sr">${T('Действия')}</span></th></tr></thead>
          <tbody>${list.map(a => `
            <tr>
              <th scope="row">${esc(a.email) || '—'}</th>
              <td>${social.handleOf(a.id) ? authorLink(a.id) : '—'}${social.roleTags(a.id)}</td>
              <td>${esc(social.nameOf(a.id)) || '—'}</td>
              <td>${esc(way[a.provider] || a.provider)}</td>
              <td>${date(a.created)}</td>
              <td>${a.lastSeen ? date(a.lastSeen.toDate()) : '—'}</td>
              <td>${a.id === user.uid ? '' : `<button type="button" class="r-iconbtn small" data-mod-menu="${esc(a.id)}" title="${T('Модерация')}" aria-label="${T('Модерация')}">⋯</button>`}</td>
            </tr>`).join('')}</tbody>
        </table></div>`);
    }
    const snap = await fs.getDocs(fs.collection(db, 'submissions'));
    // Сначала то, что ждёт решения, внутри по свежести.
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.status !== 'pending') - (b.status !== 'pending')
      || (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    await Promise.all([
      social.loadPeople(list.flatMap(s => [s.uid, ...(s.coauthors || [])])),
      ...list.filter(s => s.status === 'pending').map(async s => {
        const image = (await fs.getDoc(fs.doc(db, 'selfies', s.id))).data()?.image;
        s.selfie = social.isImage(image) ? image : '';
      }),
    ]);
    if (route().name !== 'admin' || route().tab === 'users') return;
    submissions = list;
    shell(list.map(submissionCard).join('') || `<div class="edit-card"><p class="empty">${T('Пока нет программ на проверку.')}</p></div>`);
  } catch (e) {
    console.error(e);
    empty(T('Не удалось загрузить данные. Обновите страницу.'));
  }
}

// Одобренная заявка становится обычной записью каталога, так что страница, комментарии и статистика работают сами.
async function decide(id, approve) {
  const s = submissions.find(x => x.id === id);
  const reason = approve ? '' : await askDialog(T, { title: T('Отклонить заявку'), text: T('Причину увидит автор.'), input: true, placeholder: T('Причина отказа'), ok: 'Отклонить', danger: true });
  if (!s || reason === null) return;
  const { id: _id, selfie: _selfie, selfiePublic: _public, uid, status: _status, createdAt: _createdAt, reason: _reason, ...fields } = s;
  const batch = fs.writeBatch(db);
  if (approve) batch.set(fs.doc(db, 'apps', id), { ...fields, authorUid: uid, community: true, addedAt: fs.serverTimestamp() });
  batch.update(fs.doc(db, 'submissions', id), { status: approve ? 'approved' : 'rejected', reason: reason.trim().slice(0, 300) });
  await batch.commit();
  notify('mod', id, uid, approve ? id : '', reason.trim() ? `${s.name}: ${reason.trim()}` : s.name);
  await loadContent();
  await drawPending();
  render();
}

/* ---------- Соглашение и куки ---------- */

function renderTerms() {
  view.innerHTML = `
    <section class="section panel terms">
      ${(lang === 'en' ? TERMS.en : TERMS.ru).map(([title, text], i) => (i ? `<h2>${title}</h2><p>${text}</p>` : `<h1>${title}</h1><p class="empty">${text}</p>`)).join('')}
    </section>`;
}

function drawCookieBar() {
  try { cookieBar.hidden = !!localStorage.getItem('cookieOk'); } catch { cookieBar.hidden = false; }
}

/* ---------- Данные ---------- */

// Запись из Firestore ложится поверх стартовой с тем же id.
// deleted: стартовые записи живут в коде, поэтому их помечаем, а не стираем.
function merge(base, snap) {
  const items = new Map(base.map(a => [a.id, a]));
  snap.forEach(d => items.set(d.id, { ...items.get(d.id), ...d.data(), id: d.id }));
  return [...items.values()].filter(a => !a.deleted);
}

async function loadContent() {
  const [a, p, people] = await Promise.all(['apps', 'projects', 'authors'].map(c => fs.getDocs(fs.collection(db, c))));
  apps = merge(APPS, a);
  sendCatalog();
  projects = merge(PROJECTS, p);
  people.forEach(d => { authors[d.id] = d.data(); });
  await Promise.all([social.loadPeople(apps.flatMap(authorUids)), loadDownloads(), loadLikes()]);
  contentState = 'ready';
}

// Лайки программ сообщества: applikes/<id программы> = { n }. Свой лайк — votes/a_<id>_<uid>, как у постов.
let likes = {};
let communitySort = 'new'; // new — по дате выхода, top — по лайкам
async function loadLikes() {
  try { (await fs.getDocs(fs.collection(db, 'applikes'))).forEach(d => { likes[d.id] = d.data().n || 0; }); }
  catch (e) { console.error(e); } // правила ещё не опубликованы: лайков просто не видно
}

// Дата выхода — когда программу одобрили. У одобренных раньше её нет: браузер админа берёт время заявки.
const addedAt = a => a.addedAt?.toMillis?.() || 0;
let addedFilled = false;
async function fillAddedAt() {
  if (addedFilled) return;
  addedFilled = true;
  for (const a of apps.filter(x => x.community && !x.addedAt)) {
    try {
      const s = await fs.getDoc(fs.doc(db, 'submissions', a.id));
      const at = s.data()?.createdAt || fs.Timestamp.now();
      await fs.updateDoc(fs.doc(db, 'apps', a.id), { addedAt: at });
      a.addedAt = at;
    } catch (e) { console.error(e); }
  }
}

// Скачивания по программам, открыты всем: из них топ авторов и цифры в профиле.
// Подробная статистика по дням (stats) по-прежнему только для админов.
let downloads = {}; // id программы -> сколько раз скачали
async function loadDownloads() {
  try { (await fs.getDocs(fs.collection(db, 'downloads'))).forEach(d => { downloads[d.id] = d.data().n || 0; }); }
  catch (e) { console.error(e); } // правила ещё не опубликованы: топ просто не покажем
}

// Авторы по сумме скачиваний их программ (соавторам тоже засчитывается).
function topAuthors() {
  const by = new Map();
  apps.forEach(a => authorUids(a).forEach(uid => {
    const x = by.get(uid) || { uid, n: 0, apps: 0 };
    x.n += downloads[a.id] || 0;
    x.apps++;
    by.set(uid, x);
  }));
  return [...by.values()].filter(x => social.nameOf(x.uid)).sort((a, b) => b.n - a.n || b.apps - a.apps);
}
const plural = (n, one, few, many) => (lang === 'en' ? (n === 1 ? one : many)
  : n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many);
const dlText = n => `${n.toLocaleString(lang === 'en' ? 'en' : 'ru')} ${T(plural(n, 'скачивание', 'скачивания', 'скачиваний'))}`;
const authorsList = q => {
  const top = topAuthors().map((x, i) => ({ ...x, rank: i + 1 }))
    .filter(x => !q || `${social.nameOf(x.uid)} ${social.handleOf(x.uid)}`.toLowerCase().includes(q));
  if (!top.length) return `<p class="empty">${T(q ? 'Ничего не нашлось.' : 'Авторов пока нет.')}</p>`;
  return `
    <ol class="top-authors">${top.map(x => `
      <li><a href="${social.profileHref(x.uid)}">
        <span class="top-rank">${x.rank}</span>${social.ava(x.uid, 40)}
        <span class="top-who"><b>${esc(social.nameOf(x.uid))}</b>${social.handleOf(x.uid) ? `<small>@${esc(social.handleOf(x.uid))}</small>` : ''}</span>
        <span class="top-num"><b>${dlText(x.n)}</b><small>${x.apps} ${T(plural(x.apps, 'программа', 'программы', 'программ'))}</small></span>
      </a></li>`).join('')}
    </ol>`;
};

// Программы автора для его профиля.
function authorApps(uid) {
  const list = apps.filter(a => authorUids(a).includes(uid));
  if (!list.length) return '';
  return `
    <section class="r-card">
      <h3 class="r-card-title small">${T('Программы')}</h3>
      <ul class="author-apps">${list.map(a => `
        <li><a href="#app/${esc(a.id)}"><img src="${icon(a)}" alt="" width="32" height="32"><span><b>${esc(nm(a))}</b>${downloads[a.id] ? `<small>${dlText(downloads[a.id])}</small>` : ''}</span></a></li>`).join('')}
      </ul>
    </section>`;
}

// Админ сам появляется в списке авторов при входе, а смена имени в профиле меняет подпись на всех его программах.
async function syncAuthor() {
  const name = (displayName() || 'Админ').slice(0, 80);
  await fs.setDoc(fs.doc(db, 'authors', user.uid), { name });
  authors[user.uid] = { name };
}

async function loadProfile(u) {
  if (!u) return {};
  try {
    return (await fs.getDoc(fs.doc(db, 'users', u.uid))).data() || {};
  } catch (e) {
    console.error(e);
    return {};
  }
}

// Браузер не может прочитать список аккаунтов Firebase, поэтому каждый сам отмечается здесь при входе.
async function syncAccount(u) {
  const { signInProvider } = await u.getIdTokenResult();
  await fs.setDoc(fs.doc(db, 'accounts', u.uid), {
    email: u.email || '',
    provider: signInProvider,
    created: u.metadata.creationTime || '',
    lastSeen: fs.serverTimestamp(),
  });
}

async function checkAdmin(u) {
  if (!u?.email) return false;
  try {
    return (await fs.getDoc(fs.doc(db, 'admins', u.email.toLowerCase()))).exists();
  } catch (e) {
    console.error(e); // правила не пускают: вход не через Google
    return false;
  }
}

/* ---------- Аккаунт ---------- */

function renderAccount() {
  if (authState !== 'ready') {
    view.innerHTML = `<section class="section panel"><h1>${T('Аккаунт')}</h1><p class="empty">${
      T(authState === 'loading' ? 'Загрузка…' : 'Сервис входа сейчас недоступен. Скачивать программы можно и без аккаунта.')}</p></section>`;
    return;
  }
  if (user) {
    view.innerHTML = `
      <section class="section panel edit">
        <header class="edit-top">
          <h1>${T('Редактирование профиля')}</h1>
          ${social.accountNote()}
        </header>
        <div class="edit-profile">
          ${social.bannerField()}
          <div class="edit-id">
            <span class="avatar big" id="big-avatar"></span>
            <div class="edit-who">
              <b>${esc(displayName() || T('Пользователь'))}</b>
              <small>${social.handleOf(user.uid) ? `@${esc(social.handleOf(user.uid))}` : esc(user.email)}</small>
            </div>
            <div class="profile-photo">
              <label class="btn">${T('Загрузить фото')}<input id="photo" class="sr" type="file" accept="image/*,.heic,.heif"></label>
              ${profile.photo ? `<button type="button" class="link linkbtn" id="photo-remove">${T('Убрать фото')}</button>` : ''}
            </div>
          </div>
        </div>
        <form id="profile-form" class="edit-form">
          <section class="edit-card">
            <div class="edit-title"><h2>${T('Основное')}</h2><p>${T('Так вас видят другие люди на сайте.')}</p></div>
            <div class="edit-fields">
              <label class="field">${T('Имя')}<input name="name" maxlength="80" autocomplete="name"></label>
              ${birthdayField(profile.birthday)}
              ${social.accountFields()}
            </div>
          </section>
          ${social.netFields()}
          ${social.privacyFields()}
          <div class="edit-bar">
            <p id="msg" class="msg" role="alert"></p>
            <button class="btn primary">${T('Сохранить')}</button>
          </div>
        </form>
        ${pushCard()}
        <section class="edit-card edit-account">
          <div class="edit-title"><h2>${T('Аккаунт')}</h2><p id="who"></p></div>
          ${isAdmin ? `<p class="msg ok">${T('Вы админ: кнопки «Изменить» и «Добавить» есть в каталоге, цифры в разделе «Статистика».')}</p>` : ''}
          <div class="edit-account-actions">
            <a class="link" href="#terms">${T('Пользовательское соглашение')}</a>
            <button type="button" class="btn" id="logout">${T('Выйти')}</button>
          </div>
        </section>
      </section>`;
    view.querySelector('#who').textContent = user.email;
    drawPush();
    view.querySelector('[name=name]').value = displayName();
    drawAvatar(view.querySelector('#big-avatar'));
    return;
  }
  const reg = authMode === 'register';
  view.innerHTML = `
    <section class="section panel account">
      <h1>${T(reg ? 'Создать аккаунт' : 'Вход')}</h1>
      <div class="tabs" role="group" aria-label="${T('Вход или регистрация')}">
        <button type="button" data-mode="login" aria-pressed="${!reg}">${T('Вход')}</button>
        <button type="button" data-mode="register" aria-pressed="${reg}">${T('Регистрация')}</button>
      </div>
      <button type="button" class="btn google" id="google">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M21 12.2h-9M20.6 12.2a8.8 8.8 0 1 1-2.6-6.3"/></svg>
        ${T('Продолжить с Google')}
      </button>
      <p class="or">${T('или')}</p>
      <form id="auth-form" class="account">
        <label class="field">${T('Почта')}
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label class="field">${T('Пароль')}
          <input name="password" type="password" required minlength="6" autocomplete="${reg ? 'new-password' : 'current-password'}">
        </label>
        ${reg ? birthdayField() : ''}
        <button class="btn primary">${T(reg ? 'Создать аккаунт' : 'Войти')}</button>
      </form>
      ${reg ? '' : `<button type="button" class="link linkbtn" id="reset">${T('Забыли пароль?')}</button>`}
      <p class="r-hint">${T('Входя на сайт, вы принимаете')} <a class="link" href="#terms">${T('пользовательское соглашение')}</a>.</p>
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

// День рождения: видит только сам человек (users/<uid>). Поле type=date даёт ГГГГ-ММ-ДД.
const birthdayField = (value = '') => `
  <label class="field">${T('День рождения')}
    <input name="birthday" type="date" min="1900-01-01" max="${new Date().toISOString().slice(0, 10)}" autocomplete="bday" value="${/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''}">
    <small class="r-hint">${T('Видите только вы. В этот день сайт вас поздравит.')}</small>
  </label>`;

// Поздравление показываем при первом заходе в течение месяца после дня рождения, по разу на устройстве в год.
async function greetBirthday(u) {
  const m = /(\d{2})-(\d{2})$/.exec(profile.birthday || '');
  if (!u || !m) return;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = [now.getFullYear(), now.getFullYear() - 1].find(y => {
    let d = new Date(y, +m[1] - 1, +m[2]);
    if (d.getMonth() !== +m[1] - 1) d = new Date(y, 1, 28); // 29 февраля в невисокосный год
    const days = (today - d) / 864e5;
    return days >= 0 && days <= 30;
  });
  if (!year) return;
  const key = `bday-${u.uid}`;
  try { if (localStorage.getItem(key) === String(year)) return; } catch { /* без хранилища покажем как есть */ }
  // Автору программы сообщества — его селфи из заявки, остальным — аватарка.
  await contentReady;
  const own = apps.find(a => a.community && a.authorUid === u.uid);
  let photo = '';
  if (own) photo = (await fs.getDoc(fs.doc(db, 'selfies', own.id)).catch(() => null))?.data()?.image || '';
  if (!social.isImage(photo)) photo = myPhoto();
  const { celebrate } = await import('./birthday.js?v=1');
  // Как обращаться: bdayName из users/<uid> (админ ставит в консоли, например прозвище), иначе имя из профиля, иначе логин.
  celebrate({ name: profile.bdayName || displayName() || social.nameOf(u.uid) || T('Пользователь'), photo, lang });
  try { localStorage.setItem(key, String(year)); } catch { /* ничего */ }
}

const displayName = () => profile.name || user?.displayName || '';
const myName = () => (displayName() || 'Пользователь').slice(0, 80);
const myPhoto = () => profile.photo || user?.photoURL || '';

const initial = () => (displayName() || user?.email || '')[0] || (lang === 'en' ? 'Me' : 'Я');

function drawAvatar(el) {
  const src = profile.photo || user?.photoURL;
  el.textContent = src ? '' : initial();
  if (!src) return;
  const img = new Image();
  img.src = src;
  img.alt = '';
  img.referrerPolicy = 'no-referrer'; // без этого аватарки Google часто не грузятся
  el.append(img);
}

async function saveBanner(banner) {
  await social.updatePublic({ banner });
  renderAccount();
  say(T('Сохранено.'), true);
}

async function saveProfile(data) {
  await fs.setDoc(fs.doc(db, 'users', user.uid), data, { merge: true });
  profile = { ...profile, ...data };
  await social.mirror({ name: myName(), photo: myPhoto().length <= 100000 ? myPhoto() : '' });
  if (realAdmin) await syncAuthor();
  drawAvatar(avatar);
  renderAccount();
  say(T('Сохранено.'), true);
}

// Storage на бесплатном тарифе нет, поэтому картинки ужимаем в браузере и храним строкой в базе.
async function photoToDataUrl(file, size = 128, type = 'image/jpeg') {
  const bitmap = await readImage(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas.getContext('2d').drawImage(bitmap,
    (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  return canvas.toDataURL(type, 0.8);
}

// Демо из заявки. Лимит документа в базе 1 МиБ, поэтому строка не длиннее DEMO_MAX.
const DEMO_MAX = 700000;
const DEMO_RATIO = 540 / 608;
const DEMO_IMAGE = /^data:image\/(png|jpeg|webp|gif);base64,/;
const fileToDataUrl = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
async function demoToDataUrl(file) {
  // Гифку не трогаем: canvas оставит от анимации один кадр.
  if (file.type === 'image/gif') {
    if (file.size > 500 * 1024) throw new Error('big-gif');
    return fileToDataUrl(file);
  }
  if (file.size > 20 * 1024 * 1024) throw new Error('big');
  // Рамка демо на странице программы 540×608 (как у наших гифок): пользователь сам выбирает, что в неё попадёт.
  return cropImage(file, T, { ratio: DEMO_RATIO, out: 810, limit: DEMO_MAX });
}

/* ---------- Баги и идеи ---------- */

function renderReport(appId) {
  const note = html => { view.innerHTML = `<section class="section panel"><h1>${T('Сообщить о баге или идее')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading' || contentState === 'loading') return note(T('Загрузка…'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы написать автору программы.')}`);
  if (!apps.some(authorName)) return note(T('Пока ни у одной программы не указан автор.'));
  const option = a => (authorName(a)
    ? `<option value="${esc(a.id)}" ${a.id === appId ? 'selected' : ''}>${T('{name} (автор: {author})', { name: esc(nm(a)), author: esc(authorName(a)) })}</option>`
    : `<option disabled>${T('{name} (автор не указан)', { name: esc(nm(a)) })}</option>`);
  view.innerHTML = `
    <section class="section panel account editor">
      <h1>${T('Сообщить о баге или идее')}</h1>
      <form id="report-form" class="account">
        <label class="field">${T('Что это')}
          <select name="type"><option value="bug">${T('Баг')}</option><option value="idea">${T('Идея')}</option></select>
        </label>
        <label class="field">${T('Программа')}
          <select name="appId" required>${apps.map(option).join('')}</select>
        </label>
        <label class="field">${T('Сообщение')}
          <textarea name="text" rows="6" maxlength="2000" required></textarea>
        </label>
        <div class="report-bar">${social.attachBar()}<button class="btn primary">${T('Отправить автору')}</button></div>
      </form>
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
}

async function sendReport(form) {
  const { type, appId, text, image } = Object.fromEntries(new FormData(form));
  const app = apps.find(a => a.id === appId);
  if (!authorName(app) || !text.trim()) return;
  await fs.addDoc(fs.collection(db, 'messages'), {
    to: app.authorUid,
    from: user.uid,
    fromName: myName(),
    fromEmail: user.email || '',
    type,
    appId,
    appName: app.name.slice(0, 100),
    text: text.trim(),
    createdAt: fs.serverTimestamp(),
    read: false,
    ...(social.isImage(image) ? { image } : {}),
  });
  form.reset();
  social.clearAttach(form);
  say(T('Отправлено. Сообщение получит {name}, ответ появится в разделе «Сообщения».', { name: authorName(app) }), true);
}

// Сообщения видят оба участника: автор получает, отправитель видит свои и ответы на них.
function watchMessages(u) {
  stopMessages.forEach(stop => stop());
  stopMessages = [];
  messages = [];
  replies = [];
  if (u) {
    const lists = { to: [], from: [] };
    const update = () => {
      const byId = new Map([...lists.to, ...lists.from].map(m => [m.id, m]));
      messages = [...byId.values()].sort((x, y) => (y.createdAt?.toMillis() || 0) - (x.createdAt?.toMillis() || 0));
      drawInboxCount();
      if (route().name === 'inbox') renderInbox();
    };
    const rows = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const col = name => fs.collection(db, name);
    stopMessages = [
      ...['to', 'from'].map(side => fs.onSnapshot(
        fs.query(col('messages'), fs.where(side, '==', u.uid)),
        snap => { lists[side] = rows(snap); update(); },
        console.error,
      )),
      fs.onSnapshot(
        fs.query(col('replies'), fs.where('participants', 'array-contains', u.uid)),
        snap => { replies = rows(snap); update(); },
        console.error,
      ),
    ];
  }
  drawInboxCount();
}

// «Профиль» в левом меню ведёт на свою публичную страницу, если @имя уже выбрано.
function drawRail() {
  document.getElementById('rail-profile').href = user ? social.myHref() : '#account';
  document.getElementById('rail-admin-group').hidden = !isAdmin;
}

function toggleMeMenu(open) {
  meMenu.hidden = !open;
  avatar.setAttribute('aria-expanded', open);
  if (!open) return;
  meMenu.innerHTML = `
    <a role="menuitem" href="${esc(social.myHref())}">${T('Перейти на страницу')}</a>
    <a role="menuitem" href="#account">${T('Редактировать профиль')}</a>
    ${realAdmin ? `<button type="button" role="menuitem" id="view-mode">${T(isAdmin ? 'Вид пользователя' : 'Вид админа')}</button>` : ''}
    <button type="button" role="menuitem" id="sound-mode">${T(soundOn() ? 'Выключить звук' : 'Включить звук')}</button>
    <button type="button" role="menuitem" id="me-logout">${T('Выйти')}</button>`;
}

// Настоящие права остаются в правилах базы: переключатель только прячет админские кнопки.
function setAdminView(on) {
  isAdmin = realAdmin && on;
  try { localStorage.setItem('userView', on ? '' : '1'); } catch { /* приватный режим */ }
  drawRail();
  drawPending().catch(console.error);
  render();
}

// Своё ограничение: человек должен понимать, почему не получается писать.
function drawBanBar(u) {
  const bar = document.getElementById('ban-bar');
  const b = u && social.banOf(u.uid);
  bar.hidden = !b;
  if (!b) return;
  const when = b.until && new Date(b.until).toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  bar.textContent = (b.until ? T('Вы отстранены до {date}. До этого времени можно только читать сайт.', { date: when }) : T('Ваш аккаунт заблокирован. Можно только читать сайт.'))
    + (b.reason ? ` ${T('Причина')}: ${b.reason}` : '');
}

function savedAdminView() {
  try { return !localStorage.getItem('userView'); } catch { return true; }
}

function drawInboxCount() {
  const unread = messages.filter(m => m.to === user?.uid && !m.read).length
    + notifications.filter(n => n.type === 'dm' && !n.read).length // ответы на баги и идеи
    + social.unreadChats();
  const count = document.getElementById('inbox-count');
  count.hidden = !unread;
  count.textContent = unread > 9 ? '9+' : unread;
  soundOnGrowth('inbox', unread, () => social.lastUnread() || { title: T('Новое сообщение'), body: '', href: '#chat' });
}

// Имена, почту и текст пишут посетители: только через esc.
const replyItem = r => `
  <div class="comment-body reply-item">
    <div class="comment-head"><b>${esc(r.name)}</b><span>${when(r.createdAt)}</span></div>
    <p>${esc(r.text)}</p>
  </div>`;

const messageItem = m => {
  const mine = m.to === user.uid;
  const thread = replies.filter(r => r.messageId === m.id)
    .sort((x, y) => (x.createdAt?.toMillis() || Infinity) - (y.createdAt?.toMillis() || Infinity));
  return `
    <article class="comment">
      <div class="comment-body">
        <div class="comment-head">
          <span class="tag ${m.type === 'idea' ? 'idea' : 'bug'}">${T(m.type === 'idea' ? 'Идея' : 'Баг')}</span>
          <a class="link" href="#app/${esc(m.appId)}">${esc(m.appName)}</a>
          <span>${when(m.createdAt)}</span>
        </div>
        <p>${esc(m.text)}</p>
        ${social.imageTag(m.image)}
        <div class="comment-head">${mine ? `<b>${esc(m.fromName)}</b><span>${esc(m.fromEmail)}</span>` : `<span>${T('Вы написали автору программы')}</span>`}</div>
        ${thread.length ? `<div class="thread">${thread.map(replyItem).join('')}</div>` : ''}
        <form class="comment-form message-reply" data-id="${esc(m.id)}">
          <textarea name="text" rows="2" maxlength="2000" required aria-label="${T('Ответ')}" placeholder="${T('Напишите ответ')}"></textarea>
          <button class="btn primary">${T('Ответить')}</button>
        </form>
        ${mine ? `<div class="comment-actions"><button type="button" class="link linkbtn" data-del-message="${esc(m.id)}">${T('Удалить')}</button></div>` : ''}
      </div>
    </article>`;
};

function renderInbox() {
  const note = html => { view.innerHTML = `<section class="section panel"><h1>${T('Сообщения')}</h1><p class="empty">${html}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (!user) return note(`<a class="link" href="#account">${T('Войдите')}</a>${T(', чтобы видеть сообщения.')}`);
  // Список обновляется сам, поэтому недописанные ответы переносим в новую разметку.
  const drafts = new Map([...view.querySelectorAll('.message-reply')].map(f => [f.dataset.id, f.elements.text.value]));
  const active = document.activeElement?.closest?.('.message-reply')?.dataset.id;
  view.innerHTML = `
    <section class="section panel inbox">
      <div class="inbox-head"><h1>${T('Баги и идеи')}</h1><a class="link" href="#chat">${T('Чаты')}</a></div>
      ${messages.map(messageItem).join('') || `<p class="empty">${T('Пока сообщений нет. Здесь будут ваши баги и идеи, ответы на них и письма по вашим программам.')}</p>`}
      <p id="msg" class="msg" role="alert"></p>
    </section>`;
  view.querySelectorAll('.message-reply').forEach(f => {
    f.elements.text.value = drafts.get(f.dataset.id) || '';
    if (f.dataset.id === active) f.elements.text.focus();
  });
  messages.filter(m => m.to === user.uid && !m.read).forEach(m => {
    fs.updateDoc(fs.doc(db, 'messages', m.id), { read: true }).catch(console.error);
  });
  notifications.filter(n => n.type === 'dm' && !n.read).forEach(n => {
    fs.updateDoc(fs.doc(db, 'notifications', n.id), { read: true }).catch(console.error);
  });
}

async function sendReply(form) {
  const text = form.elements.text.value.trim();
  const m = messages.find(x => x.id === form.dataset.id);
  if (!text || !m) return;
  await fs.addDoc(fs.collection(db, 'replies'), {
    messageId: m.id,
    participants: [m.to, m.from],
    from: user.uid,
    name: myName(),
    text,
    createdAt: fs.serverTimestamp(),
  });
  form.reset();
  notify('dm', m.id, m.to === user.uid ? m.from : m.to, m.appId, text);
}

/* ---------- Статистика ---------- */

const today = () => new Date().toISOString().slice(0, 10);

// ponytail: счётчики пишет браузер, поэтому накрутить их можно. Для честных цифр нужен сервер.
function count(key) {
  fs?.setDoc(fs.doc(db, 'stats', `${key}_${today()}`), { n: fs.increment(1) }, { merge: true })
    .catch(console.error);
  if (key.startsWith('dl_')) {
    const id = key.slice(3);
    downloads[id] = (downloads[id] || 0) + 1;
    fs?.setDoc(fs.doc(db, 'downloads', id), { n: fs.increment(1) }, { merge: true }).catch(console.error);
  }
}

function countVisit() {
  try {
    if (sessionStorage.getItem('counted')) return;
    sessionStorage.setItem('counted', '1');
  } catch { /* приватный режим: посчитаем как есть */ }
  count('visits');
}

async function renderStats() {
  const note = text => { view.innerHTML = `<section class="section panel"><h1>${T('Статистика')}</h1><p class="empty">${text}</p></section>`; };
  if (authState === 'loading') return note(T('Загрузка…'));
  if (!isAdmin) return note(T('Статистику видят только админы, вошедшие через Google.'));
  note(T('Загрузка…'));
  let snap;
  try {
    snap = await fs.getDocs(fs.collection(db, 'stats'));
  } catch (e) {
    console.error(e);
    return note(T('Не удалось загрузить статистику.'));
  }
  if (route().name !== 'stats') return;

  const rows = [];
  snap.forEach(d => {
    const m = d.id.match(/^(visits|dl_(.+))_(\d{4}-\d{2}-\d{2})$/);
    if (m) rows.push({ app: m[2], day: m[3], n: d.data().n || 0 });
  });
  const since = days => new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
  const sum = (test, from = '') => rows.filter(r => test(r) && r.day >= from).reduce((t, r) => t + r.n, 0);
  const isVisit = r => !r.app;
  const isDownload = r => !!r.app;
  const periods = [[T('Сегодня'), today()], [T('7 дней'), since(7)], [T('30 дней'), since(30)], [T('Всё время'), '']];
  const line = (name, test) => `<tr><th scope="row">${esc(name)}</th>${periods.map(([, from]) => `<td>${sum(test, from)}</td>`).join('')}</tr>`;
  const ids = [...new Set([...apps.map(a => a.id), ...rows.filter(isDownload).map(r => r.app)])];
  // Открытые счётчики появились позже статистики: догоняем их до суммы за всё время.
  ids.forEach(id => {
    const total = sum(r => r.app === id);
    if (total > (downloads[id] || 0)) {
      downloads[id] = total;
      fs.setDoc(fs.doc(db, 'downloads', id), { n: total }).catch(console.error);
    }
  });
  const appName = id => { const a = apps.find(x => x.id === id); return a ? nm(a) : id; };
  const days = [...Array(14)].map((_, i) => since(i + 1));

  view.innerHTML = `
    <section class="section panel stats">
      <h1>${T('Статистика')}</h1>
      <div class="table-box"><table>
        <thead><tr><th></th>${periods.map(([label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead>
        <tbody>
          ${line(T('Заходы'), isVisit)}
          ${line(T('Скачивания'), isDownload)}
          ${ids.map(id => line(`↓ ${appName(id)}`, r => r.app === id)).join('')}
        </tbody>
      </table></div>
      <h2 class="stats-sub">${T('По дням')}</h2>
      <div class="table-box"><table>
        <thead><tr><th scope="col">${T('День')}</th><th scope="col">${T('Заходы')}</th><th scope="col">${T('Скачивания')}</th></tr></thead>
        <tbody>${days.map(day => `<tr><th scope="row">${day}</th><td>${sum(r => isVisit(r) && r.day === day)}</td><td>${sum(r => isDownload(r) && r.day === day)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="empty">${T('Заход считается один раз за сеанс браузера. Скачивание считается по нажатию кнопки.')}</p>
    </section>`;
}

function say(text, ok = false) {
  const msg = view.querySelector('#msg');
  msg.textContent = text;
  msg.classList.toggle('ok', ok);
}

async function attempt(fn) {
  try {
    await fn();
  } catch (e) {
    if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
    console.error(e);
    say(T(AUTH_ERRORS[e.code] || 'Не получилось. Попробуйте ещё раз.'));
  }
}

async function initFirebase() {
  try {
    const [{ initializeApp }, authModule, firestoreModule] = await Promise.all([
      import(`${FIREBASE_CDN}firebase-app.js`),
      import(`${FIREBASE_CDN}firebase-auth.js`),
      import(`${FIREBASE_CDN}firebase-firestore.js`),
    ]);
    fb = authModule;
    fs = firestoreModule;
    const app = initializeApp(FIREBASE);
    auth = fb.getAuth(app);
    db = fs.getFirestore(app);
    auth.languageCode = lang;
    countVisit();
    contentReady = loadContent()
      .catch(e => { console.error(e); contentState = 'failed'; }) // каталог останется стартовым
      .then(render);
    fb.onAuthStateChanged(auth, async u => {
      [realAdmin, profile] = await Promise.all([checkAdmin(u), loadProfile(u), u && social.loadRoles([u.uid], true)]);
      isMod = !!u && social.isModUid(u.uid);
      drawBanBar(u);
      isAdmin = realAdmin && savedAdminView();
      user = u;
      quietUntil = Date.now() + 4000;
      authState = 'ready';
      await social.onUser(u);
      watchNotifications(u);
      watchMessages(u);
      // Android-приложение само проверяет уведомления, пока закрыто: ему нужен вход (refreshToken живёт долго).
      android?.postMessage({ type: 'auth', uid: u?.uid || '', refresh: u?.refreshToken || '' });
      if (u && webPush) pushRelink().catch(() => {});
      if (realAdmin) await syncAuthor().catch(console.error);
      if (u) {
        syncAccount(u).catch(console.error);
      }
      drawAvatar(avatar);
      toggleMeMenu(false);
      document.getElementById('rail-inbox').hidden = !u;
      drawRail();
      drawPending().catch(console.error);
      render();
      greetBirthday(u).catch(console.error);
    });
  } catch (e) {
    // Каталог и скачивание от Firebase не зависят: падают только аккаунты и правки.
    console.error(e);
    authState = contentState = 'failed';
    render();
  }
}

/* ---------- Навигация и события ---------- */

function route() {
  const parts = location.hash.slice(1).split('/');
  const s = social.route(parts);
  if (s) return s;
  const [name, a, b] = parts;
  if (['account', 'stats', 'inbox', 'publish', 'terms', 'settings'].includes(name)) return { name };
  if (name === 'admin') return { name, tab: a };
  if (name === 'report') return { name, appId: a };
  if (name === 'timer-login' || name === 'app-login') return { name, target: a, state: b };
  if (name === 'edit' && FIELDS[a] && b) return { name, kind: a, id: b };
  const app = name === 'app' && apps.find(x => x.id === a);
  return app ? { name: 'app', app } : { name: 'apps' };
}

const RAIL = { 'timer-login': 'account', 'app-login': 'account', feed: 'feed', post: 'feed', submit: 'feed', u: 'account', uid: 'account', chat: 'inbox', inbox: 'inbox', account: 'account', stats: 'stats', report: 'report', admin: 'admin', settings: 'settings' };

function render() {
  const r = route();
  document.querySelectorAll('.rail a').forEach(a => {
    // Соглашение ни к одному разделу меню не относится, поэтому ничего не подсвечиваем
    if (r.name !== 'terms' && a.dataset.route === (RAIL[r.name] || 'apps')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (r.social) { social.render(r); return; } // заголовок вкладки social.js ставит сам, когда загрузит данные
  if (r.name === 'account') renderAccount();
  else if (r.name === 'timer-login') renderTimerLogin(r);
  else if (r.name === 'app-login') renderAppLogin(r);
  else if (r.name === 'stats') renderStats();
  else if (r.name === 'inbox') renderInbox();
  else if (r.name === 'report') renderReport(r.appId);
  else if (r.name === 'publish') renderPublish();
  else if (r.name === 'admin') renderAdmin(r.tab);
  else if (r.name === 'terms') renderTerms();
  else if (r.name === 'settings') renderSettings();
  else if (r.name === 'edit') renderEditor(r.kind, r.id);
  else if (r.name === 'app') renderApp(r.app);
  else renderApps();
  document.title = r.app ? `${nm(r.app)} — ${T('Яйца Cloud')}` : T('Яйца Cloud — все приложения');
}

// Вход в Яйцетаймер через Google. Внутри программы (WebView) Google вход не пускает, поэтому программа
// открывает эту страницу в обычном браузере, а она передаёт сессию обратно: на ПК — странице программы
// на 127.0.0.1 (в #фрагменте, он не уходит в сеть), на телефоне — по ссылке yaytsa://auth.
// state — случайная строка от программы, по ней программа узнаёт свой запрос.
function timerTarget(r) {
  if (!/^[0-9a-f]{16,64}$/.test(r.state || '')) return null;
  const rt = encodeURIComponent(user.refreshToken);
  if (r.target === 'a') return `yaytsa://auth?state=${r.state}&rt=${rt}`;
  const port = /^p(\d{2,5})$/.exec(r.target || '');
  return port ? `http://127.0.0.1:${port[1]}/cb#state=${r.state}&rt=${rt}` : null;
}

function renderTimerLogin(r) {
  const valid = /^(a|p\d{2,5})$/.test(r.target || '') && /^[0-9a-f]{16,64}$/.test(r.state || '');
  if (!valid) {
    view.innerHTML = `<section class="section panel"><h1>${T('Вход в Яйцетаймер')}</h1><p class="empty">${T('Ссылка устарела. Нажмите «Войти через Google» в Яйцетаймере ещё раз.')}</p></section>`;
    return;
  }
  if (authState !== 'ready' || !user) {
    renderAccount();
    const box = view.querySelector('section');
    if (box && authState === 'ready') box.insertAdjacentHTML('afterbegin', `<p class="msg ok">${T('Войдите, чтобы подключить Яйцетаймер. Потом вернётесь в программу.')}</p>`);
    return;
  }
  view.innerHTML = `
    <section class="section panel">
      <h1>${T('Вход в Яйцетаймер')}</h1>
      <p>${T('Аккаунт')}: <b id="timer-who"></b></p>
      <p class="empty">${T('Яйцетаймер получит доступ только к своим данным: истории, проектам и настройкам таймера.')}</p>
      <div class="edit-account-actions">
        <button type="button" class="btn primary" id="timer-connect">${T('Открыть Яйцетаймер')}</button>
        <button type="button" class="btn" id="logout">${T('Другой аккаунт')}</button>
      </div>
      <p class="msg ok" id="timer-done" hidden>${T('Готово. Если программа не открылась сама, вернитесь в неё вручную.')}</p>
    </section>`;
  view.querySelector('#timer-who').textContent = user.email || displayName();
  view.querySelector('#timer-connect').addEventListener('click', () => {
    const url = timerTarget(r);
    if (!url) return;
    view.querySelector('#timer-done').hidden = false;
    location.href = url;
  });
}

// Вход через Google в приложении Яйца Cloud для Windows. Внутри приложения Google вход не пускает, а заново
// входить в Google долго, поэтому приложение открывает эту страницу в обычном браузере. Здесь человек выбирает
// аккаунт, и мы отдаём приложению подтверждение от Google: на его страницу 127.0.0.1 во #фрагменте, в сеть он не уходит.
function renderAppLogin(r) {
  const port = /^p(\d{2,5})$/.exec(r.target || '')?.[1];
  const valid = port && /^[0-9a-f]{32}$/.test(r.state || '');
  view.innerHTML = `
    <section class="section panel">
      <h1>${T('Вход в приложение Яйца Cloud')}</h1>
      ${valid ? `
        <p class="empty">${T('Выберите аккаунт Google, и приложение войдёт в него само.')}</p>
        <div class="edit-account-actions"><button type="button" class="btn primary" id="app-google">${T('Продолжить с Google')}</button></div>
        <p class="msg ok" id="app-done" hidden>${T('Готово. Вернитесь в приложение, эту вкладку можно закрыть.')}</p>
        <p class="msg" id="app-err" hidden></p>`
      : `<p class="empty">${T('Ссылка устарела. Нажмите «Продолжить с Google» в приложении ещё раз.')}</p>`}
    </section>`;
  view.querySelector('#app-google')?.addEventListener('click', async () => {
    const err = view.querySelector('#app-err');
    err.hidden = true;
    try {
      if (!fb) throw new Error('loading');
      const cred = fb.GoogleAuthProvider.credentialFromResult(await fb.signInWithPopup(auth, googleProvider()));
      if (!cred?.idToken) throw new Error('no-token');
      view.querySelector('#app-done').hidden = false;
      location.href = `http://127.0.0.1:${port}/cb#${new URLSearchParams({ state: r.state, id: cred.idToken, at: cred.accessToken || '' })}`;
    } catch (e) {
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
      console.error(e);
      err.textContent = T('Не получилось. Попробуйте ещё раз.');
      err.hidden = false;
    }
  });
}

// На Mac ставим строкой в Терминале: у скачанного браузером файла macOS блокирует запуск, у curl такой метки нет.
function macInstallDialog(a) {
  const dlg = document.createElement('dialog');
  dlg.className = 'r-crop';
  dlg.innerHTML = `
    <form method="dialog" class="r-crop-box">
      <h2>${T('Установка {name} на Mac', { name: esc(nm(a)) })}</h2>
      <ol class="mac-steps">
        <li>${T('Откройте Терминал: Cmd+Пробел, введите Terminal.')}</li>
        <li>${T('Вставьте эту строку и нажмите Return:')}</li>
      </ol>
      <code class="mac-cmd">${esc(a.macInstall)}</code>
      <p class="empty">${T('Пароль не нужен. Что сделать дальше в After Effects и Figma, покажет сам Терминал.')}</p>
      <div class="r-crop-bar">
        <button class="btn">${T('Закрыть')}</button>
        <button type="button" class="btn primary">${T('Скопировать')}</button>
      </div>
    </form>`;
  const copy = dlg.querySelector('button[type=button]');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(a.macInstall);
      copy.textContent = T('Скопировано');
    } catch {
      getSelection().selectAllChildren(dlg.querySelector('code'));
      copy.textContent = T('Нажмите Cmd+C');
    }
  });
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

// На iPhone ставят из Safari через «Поделиться»: кнопку «Установить» сайт нажать за человека не может.
function iosInstallDialog() {
  const dlg = document.createElement('dialog');
  dlg.className = 'r-crop';
  dlg.innerHTML = `
    <form method="dialog" class="r-crop-box">
      <h2>${T('Яйца Cloud на iPhone')}</h2>
      <ol class="mac-steps">
        <li>${T('Внизу Safari нажмите «Поделиться» — квадрат со стрелкой вверх.')}</li>
        <li>${T('Прокрутите список и выберите «На экран Домой», затем «Добавить».')}</li>
        <li>${T('Откройте Яйца Cloud со значка на экране Домой и войдите.')}</li>
        <li>${T('Включите уведомления: «Аккаунт» → «Уведомления» → «Включить».')}</li>
      </ol>
      <p class="empty">${T('Нужен iOS 16.4 или новее. Уведомления приходят, только если открывать с экрана Домой.')}</p>
      <div class="r-crop-bar"><button class="btn primary">${T('Понятно')}</button></div>
    </form>`;
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

let toastTimer;
function toast(text) {
  toastEl.textContent = text;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 9000);
}

view.addEventListener('click', e => {
  const t = e.target.closest('button, a');
  if (!t) return;
  if (t.dataset.cat) { cat = t.dataset.cat; renderApps(); }
  if (t.dataset.csort) { communitySort = t.dataset.csort; renderApps(); }
  else if (t.dataset.mode) { authMode = t.dataset.mode; renderAccount(); }
  else if (t.dataset.dt) {
    const id = t.dataset.dtId;
    if (t.dataset.dt === 'install') count(`dl_${id}`);
    if (t.dataset.dt !== 'remove') desktop.postMessage({ type: t.dataset.dt, id });
    else askDialog(T, { title: T('Удалить {name}?', { name: nm(apps.find(x => x.id === id)) }), ok: 'Удалить', danger: true })
      .then(yes => yes && desktop.postMessage({ type: 'remove', id }));
  }
  else if (t.classList.contains('dl')) {
    count(`dl_${t.dataset.id}`);
    toast(T('Скачивание началось. Если Windows покажет SmartScreen: «Подробнее», затем «Выполнить в любом случае».'));
  }
  else if (t.classList.contains('dl-linux')) {
    count(`dl_${t.dataset.id}`);
    toast(T('Скачивание началось. Распакуйте архив и запустите install.sh.'));
  }
  else if (t.classList.contains('dl-android')) {
    count(`dl_${t.dataset.id}`);
    toast(T('Скачивание началось. Откройте файл, Android попросит разрешить установку.'));
  }
  else if (t.classList.contains('ios-install')) iosInstallDialog();
  else if (t.classList.contains('dl-mac')) {
    count(`dl_${t.dataset.id}`);
    macInstallDialog(apps.find(x => x.id === t.dataset.id));
  }
  else if (t.dataset.modMenu) social.modChooser(t.dataset.modMenu);
  else if (t.dataset.approve) attempt(() => decide(t.dataset.approve, true));
  else if (t.dataset.reject) attempt(() => decide(t.dataset.reject, false));
  else if (t.dataset.delSub) attempt(() => deleteSubmission(t.dataset.delSub));
  else if (t.dataset.delMessage) {
    attempt(async () => {
      if (await askDialog(T, { title: T('Удалить сообщение?'), ok: 'Удалить', danger: true })) await fs.deleteDoc(fs.doc(db, 'messages', t.dataset.delMessage));
    });
  }
  else if (t.dataset.restore) {
    const [kind, id] = t.dataset.restore.split('/');
    attempt(async () => {
      await fs.setDoc(fs.doc(db, kind, id), { deleted: fs.deleteField() }, { merge: true });
      await loadContent();
      toast(T('Вернули на сайт.'));
      renderAdmin('deleted');
    });
  }
  else if (t.id === 'delete') {
    const { kind, id } = view.querySelector('#edit-form').dataset;
    attempt(async () => {
      if (!await askDialog(T, { title: T('Удалить запись с сайта?'), ok: 'Удалить', danger: true })) return;
      await fs.setDoc(fs.doc(db, kind, id), { deleted: true }, { merge: true });
      await loadContent();
      cat = 'all';
      location.hash = 'apps';
    });
  }
  else if (t.id === 'photo-remove') attempt(() => saveProfile({ photo: '' }));
  else if (t.id === 'banner-remove') attempt(() => saveBanner(''));
  else if (t.id === 'logout') attempt(async () => {
    // Устройство больше не получает уведомления этого аккаунта; разрешение браузера остаётся для следующего входа.
    const sub = await pushSub().catch(() => null);
    if (sub) await pushApi('/subscribe', { sub: sub.toJSON(), off: true }).catch(() => {});
    await fb.signOut(auth);
  });
  else if (t.id === 'push-toggle') {
    const on = !t.dataset.on;
    // На iPhone разрешение спрашивают только прямо по нажатию, поэтому запрос — первым делом.
    const perm = on ? Notification.requestPermission() : null;
    t.disabled = true;
    setPush(on, perm)
      .then(() => drawPush(on ? T('Готово: уведомления будут приходить сюда.') : ''))
      .catch(e => drawPush(e.message === 'denied' ? '' : T('Не получилось. Попробуйте ещё раз.')))
      .finally(() => { t.disabled = false; });
  }
  else if (t.matches('[data-pick-root]')) desktop?.postMessage({ type: 'pick-root', path: t.closest('form').querySelector('[data-root]').value });
  else if (t.id === 'google' && host) {
    host.postMessage({ type: 'google' });
    toast(T('В браузере выберите аккаунт Google, и приложение войдёт само.'));
  }
  else if (t.id === 'google') attempt(() => fb.signInWithPopup(auth, googleProvider()));
  else if (t.id === 'reset') {
    const email = view.querySelector('[name=email]').value.trim();
    if (!email) return say(T('Введите почту, и мы пришлём ссылку для сброса пароля.'));
    attempt(async () => {
      await fb.sendPasswordResetEmail(auth, email);
      say(T('Если такой аккаунт есть, письмо уже в пути. Проверьте почту.'), true);
    });
  }
});

view.addEventListener('submit', e => {
  if (e.target.method === 'dialog') return; // окно вопроса закрывается само
  e.preventDefault();
  if (e.target.id === 'mic-form') return; // проверку микрофона запускает setupMicSettings
  if (e.target.id === 'root-form' || e.target.id === 'root-ask') return desktop?.postMessage({ type: 'set-root', path: e.target.querySelector('[data-root]').value });
  if (e.target.id === 'edit-form') return attempt(() => saveItem(e.target));
  if (e.target.id === 'report-form') return attempt(() => sendReport(e.target));
  if (e.target.id === 'publish-form') return attempt(() => sendSubmission(e.target));
  if (e.target.classList.contains('message-reply')) return attempt(() => sendReply(e.target));
  if (e.target.dataset.sForm) return social.onSubmit(e.target);
  if (e.target.id === 'profile-form') {
    const f = e.target.elements;
    const name = f.name.value.trim();
    return attempt(async () => {
      await social.saveIdentity({ username: f.username.value, bio: f.bio.value, name: name || myName(), photo: myPhoto(), links: social.readLinks(e.target) });
      await social.syncBirthday(f.birthday.value);
      await saveProfile({ name, birthday: f.birthday.value });
    });
  }
  const { email, password, birthday } = Object.fromEntries(new FormData(e.target));
  const reg = authMode === 'register';
  const go = reg ? fb.createUserWithEmailAndPassword : fb.signInWithEmailAndPassword;
  attempt(async () => {
    const cred = await go(auth, email.trim(), password);
    if (reg && birthday) {
      await fs.setDoc(fs.doc(db, 'users', cred.user.uid), { birthday }, { merge: true });
      profile = { ...profile, birthday };
    }
  });
});

document.getElementById('lang').addEventListener('click', () => setLang(lang === 'ru' ? 'en' : 'ru'));
document.getElementById('theme').addEventListener('click', toggleTheme);
bell.addEventListener('click', () => toggleBell(bellPanel.hidden));
bellPanel.addEventListener('click', e => { if (e.target.closest('a')) toggleBell(false); });
document.addEventListener('click', e => { if (!bellPanel.hidden && !bellWrap.contains(e.target)) toggleBell(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !bellPanel.hidden) toggleBell(false); });

// Без входа аватарка сразу ведёт на вход, после входа открывает меню.
avatar.addEventListener('click', e => {
  if (!user) return;
  e.preventDefault();
  toggleMeMenu(meMenu.hidden);
});
meMenu.addEventListener('click', e => {
  if (e.target.id === 'view-mode') setAdminView(!isAdmin);
  if (e.target.id === 'me-logout') fb.signOut(auth).catch(console.error);
  if (e.target.id === 'sound-mode') {
    try { localStorage.setItem('muted', soundOn() ? '1' : ''); } catch { /* приватный режим */ }
  }
  if (e.target.closest('a, button')) toggleMeMenu(false);
});
document.addEventListener('click', e => { if (!meMenu.hidden && !e.target.closest('#me-wrap')) toggleMeMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !meMenu.hidden) { toggleMeMenu(false); avatar.focus(); }
});

document.getElementById('cookie-ok').addEventListener('click', () => {
  try { localStorage.setItem('cookieOk', '1'); } catch { /* приватный режим */ }
  cookieBar.hidden = true;
});

view.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (e.target.id === 'icon-file' && file) {
    photoToDataUrl(file, 192, 'image/png') // PNG, чтобы не терять прозрачность
      .then(url => {
        view.querySelector('[name=icon]').value = url;
        view.querySelector('#icon-preview').src = url;
        say('');
      })
      .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
    return;
  }
  if (e.target.id === 'demo-file' && file) {
    e.target.value = '';
    demoToDataUrl(file)
      .then(url => {
        if (!url) return; // кадрирование отменили
        view.querySelector('[name=demoFile]').value = url;
        view.querySelector('#demo-preview').src = url;
        say('');
      })
      .catch(err => say(T(err.message === 'big-gif' ? 'Гифка больше 500 КБ. Уменьшите её или дайте ссылку.'
        : err.message === 'big' ? 'Файл слишком большой. Нужно до 20 МБ.' : 'Не получилось открыть этот файл. Попробуйте PNG, JPG или GIF.')));
    return;
  }
  if (e.target.id === 'selfie-file' && file) {
    e.target.value = '';
    cropImage(file, T, { ratio: 3 / 4, out: 600, limit: 280000 })
      .then(url => {
        if (!url) return;
        view.querySelector('[name=selfie]').value = url;
        view.querySelector('#selfie-preview').src = url;
        say('');
      })
      .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
    return;
  }
  if (e.target.id === 'banner' && file) {
    e.target.value = '';
    cropImage(file, T, { ratio: 3, out: 1200, limit: 190000 })
      .then(url => url && attempt(() => saveBanner(url)))
      .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
    return;
  }
  if (e.target.id !== 'photo' || !file) return;
  e.target.value = ''; // чтобы тот же файл можно было выбрать снова
  cropImage(file, T)
    .then(photo => photo && attempt(() => saveProfile({ photo })))
    .catch(() => say(T('Не получилось открыть эту картинку. Попробуйте JPG или PNG.')));
});

search.addEventListener('input', () => { if (route().name === 'apps') renderApps(); });

// Короткий fade только при смене раздела. Сортировки и вкладки внутри раздела меняются без анимации.
let enterTimer;
function animateView() {
  view.classList.remove('enter');
  void view.offsetWidth;
  view.classList.add('enter');
  clearTimeout(enterTimer);
  enterTimer = setTimeout(() => view.classList.remove('enter'), 150);
}

let shownRoute = route().name;
addEventListener('hashchange', () => {
  const { name } = route();
  if (name !== shownRoute) animateView();
  shownRoute = name;
  render();
  scrollTo(0, 0);
});

// Шапка на узком экране переносится на две строки, поэтому её высоту меряем, а не угадываем.
const topBar = document.querySelector('.top');
new ResizeObserver(() => document.documentElement.style.setProperty('--top-h', `${topBar.offsetHeight}px`)).observe(topBar);

applyStaticText();
drawCookieBar();
animateView();
render();
initFirebase();
