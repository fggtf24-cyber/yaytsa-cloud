'use strict';

/* ================= i18n ================= */
const I18N = {
  ru: {
    appName: 'Яйцетаймер', updReady: v => `Версия ${v} загружена`, updNow: 'Перезапустить',
    tabTimer: 'Таймер', tabStats: 'Статистика', tabSettings: 'Настройки',
    work: 'Работа', break: 'Перерыв', today: 'Сегодня',
    start: 'Старт', pause: 'Пауза', resume: 'Продолжить',
    reset: 'Сбросить', skip: 'Пропустить этап',
    labelPh: 'Над чем работаете?',
    session: n => `Сессия ${n}`, paused: 'пауза',
    last7: '7 дней', last30: '30 дней', goal: 'Цель на сегодня',
    byDay: 'По дням', history: 'История', exportCsv: 'Экспорт CSV', showMore: 'Показать ещё',
    noData: 'Здесь появятся ваши рабочие сессии',
    noLabel: 'Без названия', yesterday: 'Вчера',
    gTimer: 'Таймер', gNotify: 'Сигналы', gLook: 'Внешний вид', gData: 'Данные',
    workLen: 'Рабочий заход', breakLen: 'Перерыв', stepDesc: 'Шаг — 5 минут',
    autoStart: 'Автозапуск', autoStartDesc: 'Сразу начинать следующий этап',
    goalSet: 'Цель на день', goalDesc: 'Часов работы в день',
    sound: 'Звук', notifications: 'Уведомления', notifDesc: 'Системное уведомление в конце этапа',
    language: 'Язык', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', system: 'Системная',
    onTop: 'Поверх всех окон',
    dataName: 'Учёт времени', dataDesc: 'Экспорт и импорт истории в CSV или папка с данными',
    openFolder: 'Открыть папку',
    nBreakTitle: 'Время перерыва', nBreakBody: m => `Рабочий заход завершён. Отдохните ${m} мин.`,
    nWorkTitle: 'За работу', nWorkBody: m => `Перерыв окончен. Следующий заход — ${m} мин.`,
    test: 'Тест 5 сек', testIn: n => `Тест… ${n}`, testToast: 'Через 5 секунд появится напоминание',
    testTitle: 'Тест напоминания', closeToTray: 'Сворачивать в трей', closeToTrayDesc: 'Крестик прячет окно в трей, таймер продолжает идти',
    trayOpen: 'Открыть Яйцетаймер', trayQuit: 'Выйти', trayTest: 'Тест напоминания (5 сек)',
    popup: 'Окно поверх всего', popupDesc: 'Справа снизу, поверх игр и видео. Не исчезает, пока не нажмёте',
    popupA: 'Уведомление с кнопками', popupDescA: 'Всплывает поверх экрана с кнопкой «Начать перерыв». Выключено — простое уведомление',
    dataDescA: 'Экспорт и импорт истории в CSV',
    goBreak: 'Начать перерыв', goWork: 'Начать работу', later: 'Закрыть', gotIt: 'Понятно',
    aBreakBody: (w, b) => `Рабочий заход ${w}\u00a0мин завершён. Перерыв\u00a0—\u00a0${b}\u00a0мин.`,
    aWorkBody: w => `Перерыв окончен. Следующий заход\u00a0—\u00a0${w}\u00a0мин.`,
    aBreakAuto: b => `Перерыв ${b}\u00a0мин уже идёт.`,
    aWorkAuto: w => `Рабочий заход ${w}\u00a0мин уже идёт.`,
    off: 'выкл', exported: 'Файл сохранён', deleted: 'Запись удалена', undo: 'Отменить',
    min: 'мин', h: 'ч',
    days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    csvHead: 'Дата;Начало;Конец;Минуты;Задача',
    tabProjects: 'Проекты', tabApps: 'Программы',
    projLead: 'Проект — это название в поле «Над чем работаете?». Время каждого захода засчитывается в его проект.',
    projNewPh: 'Новый проект', add: 'Добавить', done: 'Готово',
    seriesN: n => `${n} ${plural(n, 'заход', 'захода', 'заходов')}`, seriesOf: (i, n) => `Заход ${i} из ${n}`,
    seriesStartsIn: (left, at) => `Старт в ${at} · через ${left}`, seriesDoneTitle: 'Серия завершена', seriesDoneBody: 'Все заходы сделаны. Отличная работа!',
    seriesCountL: 'Заходы', endless: 'Без конца', endStopQ: 'Закончить работу?', endStop: 'Закончить', seriesNow: 'Сейчас', seriesAt: at => `В ${at}`, seriesStart: 'Начало', seriesWaitTitle: 'Серия начнётся через',
    bgTitle: 'Разрешите работу в фоне', bgText: 'Иначе телефон может приглушить сигнал конца захода или серию, пока приложение закрыто.', bgGo: 'Открыть настройки', bgLater: 'Позже',
    atTitle: 'Добавить время вручную', atProjectPh: 'Проект или задача', atHow: 'Сколько', atWhen: 'Когда', atSave: 'Добавить',
    atAdded: d => `Добавлено: ${d}`, atManual: 'вручную',
    stopSeries: 'Остановить серию', stopSeriesQ: 'Остановить серию?', stopSeriesText: 'Уже сделанные заходы останутся в истории, текущий запишется как есть.',
    appsNoneA: 'Здесь появятся программы, которые отслеживает Яйцетаймер на компьютере. Нужна синхронизация.',
    adToday: 'Сегодня', ad7: 'Неделя', ad30: 'Месяц', ad90: '3 месяца', adAll: 'Всё время', appsTodayL: 'Активно сегодня', adActiveL: 'активно', adOpenL: 'открыта', adShareL: 'активность',
    seriesRow: n => `Серия · ${n} ${plural(n, 'заход', 'захода', 'заходов')}`, histAll: 'Вся история',
    alertSound: 'Звук сигнала', choose: 'Выбрать', soundDefault: 'Стандартный', soundSystem: 'Звуки телефона', soundFile: 'Свой файл',
    soundSet: n => `Звук: ${n}`, updTitle: v => `Доступна версия ${v}`, updText: 'Обновление уже скачано, установка займёт несколько секунд.', updInstall: 'Обновить', updLater: 'Позже',
    projEmpty: 'Напишите на вкладке «Таймер», над чем работаете, или добавьте проект здесь',
    pTotal: 'Всего', pWeek: '7 дней', pToday: 'Сегодня', pSessions: n => `${n} ${plural(n, 'заход', 'захода', 'заходов')}`,
    deadline: 'Дедлайн', addDeadline: '+ Дедлайн', clearDeadline: 'Убрать дедлайн',
    dlLeft: n => `через ${n} ${plural(n, 'день', 'дня', 'дней')}`, dlToday: 'сегодня', dlTomorrow: 'завтра',
    dlOver: n => `просрочен на ${n} ${plural(n, 'день', 'дня', 'дней')}`,
    workOn: 'Работать над этим', rename: 'Переименовать', hide: 'Скрыть', unhide: 'Вернуть',
    hiddenN: n => `Скрытые проекты (${n})`, hideHidden: 'Свернуть скрытые', current: 'сейчас',
    appsLead: 'Как в Steam: время идёт, пока программа открыта. «Активно» — когда её окно на переднем плане, а вы за компьютером.',
    appsAdd: '+ Добавить программу', appsPick: 'Открыты сейчас', appsNone: 'Пока ничего не отслеживается',
    appsNoCand: 'Откройте нужную программу, и она появится в этом списке', running: 'запущена',
    aToday: 'Сегодня', aWeek: '7 дней', aTotal: 'Всего', aActive: 'активно', aOf: 'из', stopTrack: 'Не отслеживать',
    gSystem: 'Система', launchAtStart: 'Запускать вместе с Windows', launchAtStartDesc: 'Стартует свёрнутой в трей',
winMin: 'Свернуть', winMax: 'Развернуть', winClose: 'Закрыть', importCsv: 'Импорт CSV', imported: n => `Добавлено ${n} ${plural(n, 'заход', 'захода', 'заходов')}`, importNone: 'В файле нет новых заходов',    importBad: 'Не удалось прочитать файл', delete: 'Удалить', cancel: 'Отмена', delProjTitle: n => `Удалить проект «${n}»?`,    delProjText: 'Время заходов останется в статистике, но без названия проекта. Это нельзя отменить.', projDeleted: 'Проект удалён',    pTodayL: 'Сегодня', pWeekL: 'За 7 дней', calClear: 'Убрать', calToday: 'Сегодня', noProjects: 'Проектов пока нет',
    monthsNom: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
scale: 'Масштаб', appsPickTitle: 'Добавить программу', appsSearchPh: 'Поиск по программам на компьютере', appsBrowse: 'Выбрать .exe вручную…', appsBrowseTitle: 'Выберите программу',    appsFound: 'Найдено', appsAll: 'Все программы', appsNothing: 'Ничего не нашлось. Попробуйте выбрать .exe вручную', appsAdded: n => `«${n}» отслеживается`,    r3m: '3 мес', r6m: '6 мес', r1y: 'Год', modeBars: 'Столбики', modeSquares: 'Квадратики',    monthsShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],    daysMon: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], noWork: 'без работы',    activeDays: n => `${n} ${plural(n, 'рабочий день', 'рабочих дня', 'рабочих дней')}`, streak: n => `серия ${n} ${plural(n, 'день', 'дня', 'дней')} подряд`,    less: 'Меньше', more: 'Больше', byHour: 'По часам за неделю',
    appsActiveL: 'Активное время', adSpan: (a, b) => `Работа в программе с ${a} до ${b}`, singleDoneTitle: 'Заход завершён', singleDoneBody: m => `${m} мин в копилке. Можно отдохнуть.`,
    longBreakL: 'Длинный перерыв', longBreakDesc: 'Каждый N-й перерыв длиннее — как в классическом помодоро. «выкл» — все перерывы одинаковые', everyN: n => `каждый ${n}-й`,
    simpleL: 'Просто таймер', simpleDesc: 'Только время, кнопка и прогресс дня. Проекты, программы и план прячутся, данные остаются',
    modeQ: 'Как будете пользоваться?', modeText: 'Просто таймер — время, кнопка и прогресс дня, ничего лишнего. Или всё сразу: проекты, программы, план, подробная статистика. Поменять можно в любой момент в настройках.',
    modeSimple: 'Просто таймер', modeFull: 'Всё и сразу', nudgeQ: 'Включить полный режим?', nudgeText: 'Похоже, вам интересна статистика. В полном режиме есть проекты, время в программах и план — всё, что вы уже записали, останется.',
    nudgeYes: 'Включить', nudgeNo: 'Не сейчас', sdGoal: (d, g) => `${d} из ${g}`, sdToday: d => `Сегодня ${d}`, sdStreak: n => `${n} ${plural(n, 'день', 'дня', 'дней')} подряд`, goalHit: 'Цель дня выполнена!',
    stopHint: 'Стоп — заход от 10 минут сохранится', goalWeek: 'Цель на неделю', goalWeekDesc: 'Часов работы за неделю (с понедельника)', goalWeekL: 'Цель на неделю',
    pWeekL7: '7 дней', editEntry: 'Изменить запись', saveL: 'Сохранить', edited: 'Запись изменена', newProjOnly: 'Такого проекта нет. Откройте список ▾ и нажмите «Создать новый проект»', newProjBtn: 'Создать новый проект', createNamed: n => `Создать «${n}»`, newProjPh: 'Название нового проекта', projCreated: n => `Проект «${n}» создан`,
    adPerHour: 'активных минут в каждые 10 минут', adPerDay: 'активных часов в день', adToHist: 'В историю', adAddQ: (d, a, b) => `Добавить ${d} работы (${a}–${b}) в историю?`, adAdded: d => `Добавлено: ${d}`,
    planSkipNext: 'Пропустить ближайший', untilShort: 'до', taQ: 'Над чем вы сейчас работаете?', taSub: tm => `Таймер идёт по плану с ${tm}. Выберите задачу — она запишется ко всем заходам этой серии.`, taNewPh: 'Или новая задача', taLater: 'Позже', quickOff: 'Убрать', schedL: 'Весь план…', taSet: n => `Задача: ${n}`, scTaskL: 'Задача', scNameQ: 'Как назвать эту серию?', scNameSub: 'Название запишется ко всем её заходам.', skipToday: 'пропустить сегодня', skipTomorrow: 'пропустить завтра', skipDay: d => `пропустить в ${d.toLowerCase()}`, skippedToday: 'сегодня пропущено · вернуть', adPerHourH: 'активных минут в каждом часе', adPickHint: 'Проведите по графику с зажатой кнопкой мыши — выделенный участок можно записать в историю как работу (удобно, если забыли включить таймер). Нажатие на участок берёт весь блок работы вокруг. Колесо мыши приближает и отдаляет, Shift + колесо листает.', adNothing: 'В этом промежутке нет активной работы',
    tabPlan: 'План', planLead: 'Таймер сам запустится в нужное время — на компьютере и на телефоне. Откроете позже — время уже будет идти с начала.',
    planAdd: '+ Добавить время', planNextL: 'Следующий старт:', planNone: 'Ничего не запланировано', planEmpty: 'Например: по будням в 7:30 — два захода',
    planOnOff: 'Включить или выключить', planNew: 'Новое время', planEditT: 'Время старта', peTimeL: 'Во сколько', peRepeatL: 'Повтор',
    peWeekly: 'По дням', peOnce: 'Один раз', planSave: 'Сохранить', planSaved: w => `Таймер запустится ${w}`, planSkipped: w => `Пропущено: ${w}`,
    planBusy: tm => `Старт по плану в ${tm} пропущен — таймер был занят`, planLate: tm => `Таймер идёт по плану с ${tm}`,
    planGoTitle: 'Пора работать', planGoBody: (n, l) => `Начался запланированный старт: ${n}${l ? ` · ${l}` : ''}.`,
    planMissedQ: 'Засчитать запланированную работу?', planMissedText: (tm, n, d) => `По плану в ${tm}: ${n}. Таймер в это время нигде не был открыт. Засчитать ${d} в историю?`,
    planMissedYes: 'Засчитать', planMissedNo: 'Нет', tomorrowL: 'завтра', atTime: tm => `в ${tm}`, endlessL: 'без конца',
    everyDay: 'Каждый день', weekdays: 'По будням', weekends: 'По выходным', planTotal: d => `всего ${d}`, untilL: tm => `до ${tm}`,
    crashTitle: 'В прошлый раз Яйцетаймер закрылся неожиданно', crashAt: at => `Это случилось около ${at}. Всё сохраняется по ходу работы, так что прогресс на месте.`,
    crashRun: (d, all) => `Заход продолжается: прошло ${d} из ${all}.`, crashPaused: (d, all) => `Заход на паузе: сохранено ${d} из ${all}.`,
    crashGoes: s => `Таймер продолжает идти: ${s}.`, crashLogged: d => `Заход закончился, пока программа была закрыта, — ${d} записано в историю.`,
    crashToday: d => `Сегодня в истории: ${d}.`, crashSaved: at => `Последнее сохранение — ${at}.`,
    stop: 'Стоп', stopQ: 'Закончить раньше?', stopKeep: 'Продолжить', stopAnyway: 'Остановить',
    stopText: (saved, left) => `До конца захода осталось ${left}. Лучше доделать до конца. Если остановиться сейчас, в историю запишется ${saved}.`,
    stopTextShort: 'Прошло меньше 10 минут — такой заход не сохранится. Лучше доделать до конца.',
    stopSeriesText2: (saved) => `Сделанные заходы останутся в истории. ${saved ? `Текущий запишется как ${saved}.` : 'Текущий заход короче 10 минут и не сохранится.'}`,
    archive: 'Архив', archiveN: n => `Архив · ${n}`, archived: 'Проект выполнен и в архиве', markDone: 'Выполнено', restore: 'Вернуть из архива',
    archEmpty: 'Здесь будут выполненные проекты', doneOn: d => `выполнен ${d}`, newProj: n => `Новый проект «${n}»`, pickProj: 'Выбрать проект',
    startAt: 'Начать позже', clearStart: 'Начать сейчас',
  },
  en: {
    appName: 'Яйцетаймер', updReady: v => `Version ${v} downloaded`, updNow: 'Restart',
    tabTimer: 'Timer', tabStats: 'Stats', tabSettings: 'Settings',
    work: 'Work', break: 'Break', today: 'Today',
    start: 'Start', pause: 'Pause', resume: 'Resume',
    reset: 'Reset', skip: 'Skip phase',
    labelPh: 'What are you working on?',
    session: n => `Session ${n}`, paused: 'paused',
    last7: 'Last 7 days', last30: 'Last 30 days', goal: 'Today’s goal',
    byDay: 'By day', history: 'History', exportCsv: 'Export CSV', showMore: 'Show more',
    noData: 'Your focus sessions will show up here',
    noLabel: 'Untitled', yesterday: 'Yesterday',
    gTimer: 'Timer', gNotify: 'Alerts', gLook: 'Appearance', gData: 'Data',
    workLen: 'Work length', breakLen: 'Break length', stepDesc: '5-minute steps',
    autoStart: 'Auto-start', autoStartDesc: 'Start the next phase automatically',
    goalSet: 'Daily goal', goalDesc: 'Hours of focus per day',
    sound: 'Sound', notifications: 'Notifications', notifDesc: 'System notification when a phase ends',
    language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', system: 'System',
    onTop: 'Always on top',
    dataName: 'Time log', dataDesc: 'Export and import history as CSV, or open the data folder',
    openFolder: 'Open folder',
    nBreakTitle: 'Break time', nBreakBody: m => `Work session done. Rest for ${m} min.`,
    nWorkTitle: 'Back to work', nWorkBody: m => `Break is over. Next session — ${m} min.`,
    test: 'Test 5 sec', testIn: n => `Test… ${n}`, testToast: 'The reminder will pop up in 5 seconds',
    testTitle: 'Reminder test', closeToTray: 'Close to tray', closeToTrayDesc: 'The close button hides the window to the tray; the timer keeps running',
    trayOpen: 'Open Яйцетаймер', trayQuit: 'Quit', trayTest: 'Test reminder (5 sec)',
    popup: 'Pop-up over everything', popupDesc: 'Bottom-right, over games and videos. Stays until you click it',
    popupA: 'Notification with buttons', popupDescA: 'Pops up over the screen with a “Start break” button. Off: a plain notification',
    dataDescA: 'Export and import history as CSV',
    goBreak: 'Start break', goWork: 'Start work', later: 'Close', gotIt: 'Got it',
    aBreakBody: (w, b) => `${w}\u2011min focus session done. Break\u00a0—\u00a0${b} min.`,
    aWorkBody: w => `Break is over. Next session\u00a0—\u00a0${w} min.`,
    aBreakAuto: b => `Your ${b}\u2011min break has started.`,
    aWorkAuto: w => `Your ${w}\u2011min focus session has started.`,
    off: 'off', exported: 'File saved', deleted: 'Entry deleted', undo: 'Undo',
    min: 'min', h: 'h',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    csvHead: 'Date,Start,End,Minutes,Task',
    tabProjects: 'Projects', tabApps: 'Apps',
    projLead: 'A project is the name in “What are you working on?”. Every focus session counts toward its project.',
    projNewPh: 'New project', add: 'Add', done: 'Done',
    seriesN: n => `${n} session${n === 1 ? '' : 's'}`, seriesOf: (i, n) => `Session ${i} of ${n}`,
    seriesStartsIn: (left, at) => `Starts at ${at} · in ${left}`, seriesDoneTitle: 'Series complete', seriesDoneBody: 'All sessions done. Great work!',
    seriesCountL: 'Sessions', endless: 'Endless', endStopQ: 'Done working?', endStop: 'Finish', seriesNow: 'Now', seriesAt: at => `At ${at}`, seriesStart: 'Start', seriesWaitTitle: 'Series starts in',
    bgTitle: 'Allow running in the background', bgText: 'Otherwise the phone may silence the end-of-session alert or a series while the app is closed.', bgGo: 'Open settings', bgLater: 'Later',
    atTitle: 'Add time by hand', atProjectPh: 'Project or task', atHow: 'How long', atWhen: 'When', atSave: 'Add',
    atAdded: d => `Added: ${d}`, atManual: 'by hand',
    stopSeries: 'Stop series', stopSeriesQ: 'Stop the series?', stopSeriesText: 'Finished sessions stay in your history; the current one is saved as it is.',
    appsNoneA: 'Programs tracked by Яйцетаймер on your PC show up here. Sync needs to be on.',
    adToday: 'Today', ad7: 'Week', ad30: 'Month', ad90: '3 months', adAll: 'All time', appsTodayL: 'Active today', adActiveL: 'active', adOpenL: 'open', adShareL: 'active share',
    seriesRow: n => `Series · ${n} session${n === 1 ? '' : 's'}`, histAll: 'All history',
    alertSound: 'Alert sound', choose: 'Choose', soundDefault: 'Default', soundSystem: 'Phone sounds', soundFile: 'Your own file',
    soundSet: n => `Sound: ${n}`, updTitle: v => `Version ${v} is available`, updText: 'The update is already downloaded, installing takes a few seconds.', updInstall: 'Update', updLater: 'Later',
    projEmpty: 'Type what you’re working on in the Timer tab, or add a project here',
    pTotal: 'Total', pWeek: '7 days', pToday: 'Today', pSessions: n => `${n} session${n === 1 ? '' : 's'}`,
    deadline: 'Deadline', addDeadline: '+ Deadline', clearDeadline: 'Remove deadline',
    dlLeft: n => `in ${n} day${n === 1 ? '' : 's'}`, dlToday: 'today', dlTomorrow: 'tomorrow',
    dlOver: n => `${n} day${n === 1 ? '' : 's'} overdue`,
    workOn: 'Work on this', rename: 'Rename', hide: 'Hide', unhide: 'Restore',
    hiddenN: n => `Hidden projects (${n})`, hideHidden: 'Collapse hidden', current: 'now',
    appsLead: 'Like Steam: time counts while the program is open. “Active” is when its window is in front and you’re at the PC.',
    appsAdd: '+ Add a program', appsPick: 'Open right now', appsNone: 'Nothing is tracked yet',
    appsNoCand: 'Open the program you want and it will show up here', running: 'running',
    aToday: 'Today', aWeek: '7 days', aTotal: 'Total', aActive: 'active', aOf: 'of', stopTrack: 'Stop tracking',
    gSystem: 'System', launchAtStart: 'Launch with Windows', launchAtStartDesc: 'Starts hidden in the tray',
winMin: 'Minimize', winMax: 'Maximize', winClose: 'Close', importCsv: 'Import CSV', imported: n => `Added ${n} session${n === 1 ? '' : 's'}`, importNone: 'No new sessions in the file',    importBad: 'Could not read the file', delete: 'Delete', cancel: 'Cancel', delProjTitle: n => `Delete project “${n}”?`,    delProjText: 'Session time stays in your stats, just without the project name. This can’t be undone.', projDeleted: 'Project deleted',    pTodayL: 'Today', pWeekL: 'Last 7 days', calClear: 'Clear', calToday: 'Today', noProjects: 'No projects yet',
    monthsNom: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
scale: 'Zoom', appsPickTitle: 'Add a program', appsSearchPh: 'Search programs on this PC', appsBrowse: 'Pick an .exe manually…', appsBrowseTitle: 'Choose a program',    appsFound: 'Found', appsAll: 'All programs', appsNothing: 'Nothing found. Try picking the .exe manually', appsAdded: n => `Tracking “${n}”`,    r3m: '3 mo', r6m: '6 mo', r1y: 'Year', modeBars: 'Bars', modeSquares: 'Squares',    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],    daysMon: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], noWork: 'no focus',    activeDays: n => `${n} active day${n === 1 ? '' : 's'}`, streak: n => `${n}-day streak`,    less: 'Less', more: 'More', byHour: 'By hour, last 7 days',
    appsActiveL: 'Active time', adSpan: (a, b) => `Worked in it from ${a} to ${b}`, singleDoneTitle: 'Session complete', singleDoneBody: m => `${m} min in the bank. Time to rest.`,
    longBreakL: 'Long break', longBreakDesc: 'Every N-th break is longer, like a classic pomodoro. “off”: all breaks are the same', everyN: n => `every ${n}th`,
    simpleL: 'Just a timer', simpleDesc: 'Only the time, the key and the day’s progress. Projects, apps and plan step aside; your data stays',
    modeQ: 'How will you use it?', modeText: 'Just a timer: the time, the key and the day’s progress, nothing else. Or everything: projects, apps, a plan and detailed stats. You can switch any time in Settings.',
    modeSimple: 'Just a timer', modeFull: 'Everything', nudgeQ: 'Turn on the full mode?', nudgeText: 'Looks like you like the stats. The full mode adds projects, time in apps and a plan; everything you have recorded stays.',
    nudgeYes: 'Turn on', nudgeNo: 'Not now', sdGoal: (d, g) => `${d} of ${g}`, sdToday: d => `Today ${d}`, sdStreak: n => `${n}-day streak`, goalHit: 'Daily goal reached!',
    stopHint: 'Stop: a session of 10 minutes or more is kept', goalWeek: 'Weekly goal', goalWeekDesc: 'Hours of work per week (from Monday)', goalWeekL: 'This week’s goal',
    pWeekL7: '7 days', editEntry: 'Edit entry', saveL: 'Save', edited: 'Entry changed', newProjOnly: 'No such project. Open the list ▾ and press “Create a new project”', newProjBtn: 'Create a new project', createNamed: n => `Create “${n}”`, newProjPh: 'New project name', projCreated: n => `Project “${n}” created`,
    adPerHour: 'active minutes in every 10 minutes', adPerDay: 'active hours per day', adToHist: 'To history', adAddQ: (d, a, b) => `Add ${d} of work (${a}–${b}) to your history?`, adAdded: d => `Added: ${d}`,
    planSkipNext: 'Skip the next one', untilShort: 'to', taQ: 'What are you working on?', taSub: tm => `The timer has been running as planned since ${tm}. Pick a task: it goes to every session of this run.`, taNewPh: 'Or a new task', taLater: 'Later', quickOff: 'Remove', schedL: 'Full plan…', taSet: n => `Task: ${n}`, scTaskL: 'Task', scNameQ: 'Name this series', scNameSub: 'The name goes to all its sessions.', skipToday: 'skip today', skipTomorrow: 'skip tomorrow', skipDay: d => `skip ${d}`, skippedToday: 'skipped today · undo', adPerHourH: 'active minutes in each hour', adPickHint: 'Drag across the chart to mark a stretch and add it to your history as work (handy if you forgot the timer). A click takes the whole block of work around it. The mouse wheel zooms, Shift + wheel moves along.', adNothing: 'No active work in this stretch',
    tabPlan: 'Plan', planLead: 'The timer starts by itself at the time you set, on the PC and on the phone. Open it later and the time is already running from the start.',
    planAdd: '+ Add a time', planNextL: 'Next start:', planNone: 'Nothing planned', planEmpty: 'For example: weekdays at 7:30, two sessions',
    planOnOff: 'Turn on or off', planNew: 'New time', planEditT: 'Start time', peTimeL: 'At', peRepeatL: 'Repeat',
    peWeekly: 'On days', peOnce: 'Once', planSave: 'Save', planSaved: w => `The timer will start ${w}`, planSkipped: w => `Skipped: ${w}`,
    planBusy: tm => `The planned start at ${tm} was skipped: the timer was busy`, planLate: tm => `The timer is running as planned since ${tm}`,
    planGoTitle: 'Time to work', planGoBody: (n, l) => `Your planned start has begun: ${n}${l ? ` · ${l}` : ''}.`,
    planMissedQ: 'Count the planned work?', planMissedText: (tm, n, d) => `Planned at ${tm}: ${n}. The timer wasn’t open anywhere then. Add ${d} to your history?`,
    planMissedYes: 'Add it', planMissedNo: 'No', tomorrowL: 'tomorrow', atTime: tm => `at ${tm}`, endlessL: 'no end',
    everyDay: 'Every day', weekdays: 'Weekdays', weekends: 'Weekends', planTotal: d => `${d} in all`, untilL: tm => `till ${tm}`,
    crashTitle: 'Яйцетаймер closed unexpectedly last time', crashAt: at => `It happened around ${at}. Everything is saved as you go, so your progress is still here.`,
    crashRun: (d, all) => `The session goes on: ${d} of ${all} done.`, crashPaused: (d, all) => `The session is paused: ${d} of ${all} saved.`,
    crashGoes: s => `The timer keeps going: ${s}.`, crashLogged: d => `The session ended while the app was closed — ${d} went into your history.`,
    crashToday: d => `In today’s history: ${d}.`, crashSaved: at => `Last saved: ${at}.`,
    stop: 'Stop', stopQ: 'Finish early?', stopKeep: 'Keep going', stopAnyway: 'Stop',
    stopText: (saved, left) => `${left} left in this session. Better to finish it. If you stop now, ${saved} goes into your history.`,
    stopTextShort: 'Less than 10 minutes have passed — a session this short isn’t saved. Better to see it through.',
    stopSeriesText2: (saved) => `Finished sessions stay in your history. ${saved ? `The current one is saved as ${saved}.` : 'The current one is under 10 minutes and won’t be saved.'}`,
    archive: 'Archive', archiveN: n => `Archive · ${n}`, archived: 'Project done and archived', markDone: 'Done', restore: 'Restore',
    archEmpty: 'Finished projects will show up here', doneOn: d => `done ${d}`, newProj: n => `New project “${n}”`, pickProj: 'Pick a project',
    startAt: 'Start later', clearStart: 'Start now',
  },
};

function plural(n, one, few, many) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

/* ================= State ================= */
const api = window.focusApi;
const ANDROID = !!api.android;
const DEFAULTS = {
  work: 25, brk: 5, autoStart: false, sound: true, notify: true,
  lang: 'ru', theme: 'dark', goal: 4, alwaysOnTop: false, popup: true, closeToTray: true,
  zoom: 1, chartMode: 'bars', heatRange: 13, seriesCount: 0, appsRange: 1, goalWeek: 0, simple: false, modeAsked: 0, longBrk: 15, longEvery: 4,
};
const MIN_SAVE_SEC = 10 * 60; // a session stopped by hand is kept only from 10 minutes on
const ZOOM = { min: 0.7, max: 1.6, step: 0.1 };
const LIMITS = {
  work: { min: 5, max: 180, step: 5 },
  brk: { min: 5, max: 60, step: 5 },
  goal: { min: 0, max: 12, step: 0.5 },
  goalWeek: { min: 0, max: 80, step: 1 },
  longBrk: { min: 0, max: 60, step: 5 },
  longEvery: { min: 2, max: 8, step: 1 },
  seriesCount: { min: 0, max: 12, step: 1 }, // 0 = endless
};

let settings = { ...DEFAULTS };
let sessions = [];       // {id, start, end, dur(sec), label}
// Project metadata keyed by projKey(name). Projects themselves come from session labels;
// this only stores what labels can't: deadline, hidden flag, projects added before any work.
let projects = {};       // {key: {name, deadline: 'YYYY-MM-DD'|'', hidden, created}}
let systemDark = true;

const timer = {
  phase: 'work',         // 'work' | 'break'
  total: 25 * 60000,
  remaining: 25 * 60000,
  running: false,
  endAt: 0,
  startedAt: 0,          // first start of the current work phase
};

let view = 'timer';
let historyLimit = 7;    // days shown in history
let chartRange = 7;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const t = k => I18N[settings.lang][k];

/* ================= Persistence ================= */
let saveTimer = null;
const snapshot = () => ({ settings, sessions, projects, current: { label: $('#label').value, series, timer: TIMER_KEYS.reduce((o, k) => (o[k] = timer[k], o), {}) }, sync: syncSnapshot() });
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    api.save(snapshot());
    syncSchedule();
  }, 250);
}
function persistNow() {
  clearTimeout(saveTimer);
  syncSchedule();
  return api.save(snapshot());
}

/* ================= Formatting ================= */
const pad = n => String(n).padStart(2, '0');
function fmtClock(ms) {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
function fmtDur(sec) {
  const m = Math.round(sec / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h === 0) return `${mm} ${t('min')}`;
  if (mm === 0) return `${h} ${t('h')}`;
  return `${h} ${t('h')} ${mm} ${t('min')}`;
}
function fmtMinutes(m) { return m >= 60 && m % 60 === 0 ? `${m / 60} ${t('h')}` : (m >= 60 ? `${Math.floor(m / 60)} ${t('h')} ${m % 60} ${t('min')}` : `${m} ${t('min')}`); }
function fmtHours(h) {
  if (h === 0) return t('off');
  const s = Number.isInteger(h) ? String(h) : String(h).replace('.', settings.lang === 'ru' ? ',' : '.');
  return `${s} ${t('h')}`;
}
const hm = ts => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dayKey = ts => { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const startOfDay = (ts = Date.now()) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
function dayTitle(ts) {
  const today = startOfDay();
  const day = startOfDay(ts);
  if (day === today) return t('today');
  if (day === today - 86400000 || Math.round((today - day) / 86400000) === 1) return t('yesterday');
  const d = new Date(ts);
  return settings.lang === 'ru'
    ? `${t('days')[d.getDay()]}, ${d.getDate()} ${t('months')[d.getMonth()]}`
    : `${t('days')[d.getDay()]}, ${t('months')[d.getMonth()]} ${d.getDate()}`;
}

/* ================= Aggregates ================= */
function secondsSince(fromTs) {
  return sessions.reduce((acc, s) => acc + (s.start >= fromTs ? s.dur : 0), 0);
}
function liveWorkSec() {
  // time of the current, not yet logged work phase
  if (timer.phase !== 'work' || !timer.startedAt) return 0;
  return Math.max(0, Math.floor((timer.total - currentRemaining()) / 1000));
}
const todaySec = () => secondsSince(startOfDay()) + liveWorkSec();
function completedToday() {
  const from = startOfDay();
  return sessions.filter(s => s.start >= from && s.full).length;
}

/* ================= Sound ================= */
let audioCtx = null;
function chime(kind) {
  if (!settings.sound) return;
  try {
    audioCtx = audioCtx || new AudioContext();
    const now = audioCtx.currentTime;
    const notes = kind === 'work' ? [659.25, 880, 1318.5] : [880, 659.25, 523.25];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      const t0 = now + i * 0.18;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
      o.connect(g).connect(audioCtx.destination);
      o.start(t0);
      o.stop(t0 + 1.2);
    });
  } catch {}
}

/* ================= Timer logic ================= */
const phaseMinutes = p => (p === 'work' ? settings.work : settings.brk);
function currentRemaining() {
  return timer.running ? Math.max(0, timer.endAt - Date.now()) : timer.remaining;
}
const isUntouched = () => !timer.running && timer.remaining === timer.total;

function setPhase(phase) {
  timer.phase = phase;
  timer.total = phaseMinutes(phase) * 60000;
  timer.remaining = timer.total;
  timer.running = false;
  timer.startedAt = 0;
  if (api.schedule) api.schedule(0);
}

function start() {
  if (timer.running) return;
  if (series) {
    const now = Date.now();
    if (series.pausedAt) { series.start += now - series.pausedAt; series.pausedAt = 0; }
    else if (seriesPos.startsWith('wait')) series.start = now; // start the planned series right away
    api.closeAlert();
    seriesPos = '';
    applySeries(true);
    persist();
    render();
    return;
  }
  if (timer.phase === 'work' && !timer.startedAt) timer.startedAt = Date.now();
  timer.endAt = Date.now() + timer.remaining;
  timer.running = true;
  api.schedule(timer.remaining);
  api.closeAlert();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  render();
}
function pause() {
  if (!timer.running) return;
  if (series) {
    // every series pauses (2.19): the whole schedule waits
    series.pausedAt = Date.now();
    seriesPos = '';
    applySeries(true);
    persist();
    render();
    return;
  }
  timer.remaining = Math.max(0, timer.endAt - Date.now());
  timer.running = false;
  api.schedule(0);
  render();
}
const toggle = () => {
  // From an untouched timer: endless (0), more than one session or a start time means a series
  // the simple mode is a plain pomodoro: work and break by turns until you stop (an endless run)
  const cnt = settings.simple ? 0 : settings.seriesCount;
  if (!series && !timer.running && isUntouched() && timer.phase === 'work' && (!(cnt > 0) || cnt > 1 || seriesStartAt)) {
    startSeries(cnt > 0 ? cnt : 0, seriesStartAt);
    return;
  }
  if (series && series.pausedAt) { start(); return; } // a pause saved by 2.9 resumes
  if (series && !seriesPos.startsWith('wait')) { pause(); return; } // any series: the big key pauses, ■ stops
  if (timer.running) pause(); else start();
};

function logWork(full, sync) {
  const elapsedMs = timer.total - currentRemaining();
  const dur = Math.round(elapsedMs / 1000);
  if (!full && dur < 60) return; // ignore accidental starts
  sessions.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    start: timer.startedAt || (Date.now() - elapsedMs),
    end: timer.running ? Math.min(Date.now(), timer.endAt) : Date.now(),
    dur,
    label: $('#label').value.trim(),
    full: !!full,
    ...(series && series.id ? { series: series.id } : {}),
  });
  if (sync) api.saveSync(snapshot());
  else persistNow();
  updateDatalist();
  renderLabelMeta();
}

// One session on its own ends with no break after it: it is logged and the timer
// goes back to the start. Breaks exist only between the sessions of a series.
function complete() {
  const finished = timer.phase;
  if (finished === 'work') {
    logWork(true);
    celebrate(timer.total);
    alertPhaseEnd('work');
    setPhase('work');
    render();
    return;
  }
  setPhase('work');
  alertPhaseEnd(finished);
  render();
}

// Stop by hand, Forest style: it is allowed, but the dialog leans towards keeping on.
// From 10 minutes on the work done is saved; a shorter one is dropped.
async function stopEarly() {
  if (!(timer.phase === 'work' && timer.startedAt)) { reset(); return; }
  const done = Math.floor((timer.total - currentRemaining()) / 1000);
  const keep = done >= MIN_SAVE_SEC;
  const text = keep ? t('stopText')(fmtDur(done), fmtDur(Math.ceil(currentRemaining() / 1000))) : t('stopTextShort');
  const ok = await confirmModal(t('stopQ'), text, t('stopAnyway'), { cancel: t('stopKeep'), keepFirst: true });
  if (!ok) return;
  api.closeAlert();
  if (keep) logWork(false);
  setPhase('work');
  persist();
  render();
}

let alertIsTest = false;
let brkMinNow = 0; // minutes of the break that just began (a long one is longer than settings.brk)
function alertTexts(finished, test, forceAuto) {
  if (finished === 'work' && !test && !forceAuto && !series) {
    return { next: 'break', auto: true, single: true, title: t('singleDoneTitle'), body: t('singleDoneBody')(settings.work), goLabel: '', okLabel: t('gotIt') };
  }
  const next = finished === 'work' ? 'break' : 'work';
  const auto = test ? false : (forceAuto || settings.autoStart);
  return {
    next, auto,
    title: test ? t('testTitle') : (next === 'break' ? t('nBreakTitle') : t('nWorkTitle')),
    body: auto
      ? (next === 'break' ? t('aBreakAuto')(brkMinNow || settings.brk) : t('aWorkAuto')(settings.work))
      : (next === 'break' ? t('aBreakBody')(settings.work, brkMinNow || settings.brk) : t('aWorkBody')(settings.work)),
    goLabel: next === 'break' ? t('goBreak') : t('goWork'),
    okLabel: auto ? t('gotIt') : t('later'),
  };
}
function alertPhaseEnd(finished, test, forceAuto) {
  alertIsTest = !!test;
  const { next, auto, title, body, goLabel, okLabel, single } = alertTexts(finished, test, forceAuto);
  if (settings.popup || test) {
    api.showAlert({
      next, title, body, goLabel, okLabel,
      hideGo: auto,
      test: !!test,
      sound: settings.sound,
      repeatSec: 15,
      theme: effectiveTheme(),
      lang: settings.lang,
    });
  } else {
    chime(next);
    if (settings.notify) {
      api.notify(title, single ? body : next === 'break' ? t('nBreakBody')(brkMinNow || settings.brk) : t('nWorkBody')(settings.work));
    }
  }
}

let testTimer = null;
function runTest() {
  if (testTimer) return;
  api.closeAlert();
  toast(t('testToast'));
  let n = 5;
  const btn = $('#btnTest');
  btn.textContent = t('testIn')(n);
  btn.disabled = true;
  testTimer = setInterval(() => {
    n -= 1;
    if (n > 0) { btn.textContent = t('testIn')(n); return; }
    clearInterval(testTimer);
    testTimer = null;
    btn.textContent = t('test');
    btn.disabled = false;
    alertPhaseEnd('work', true);
  }, 1000);
}

let lastTray = '';
function syncTray() {
  const rem = currentRemaining();
  const touched = !isUntouched();
  const phase = timer.phase === 'work' ? t('work') : t('break');
  const tooltip = touched ? `${t('appName')} — ${fmtClock(rem)} · ${phase}` : `${t('appName')} — ${phase} ${fmtClock(rem)}`;
  const state = {
    running: timer.running,
    tooltip,
    labels: { open: t('trayOpen'), start: touched ? t('resume') : t('start'), pause: t('pause'), test: t('trayTest'), quit: t('trayQuit') },
  };
  const key = JSON.stringify(state);
  if (key !== lastTray) { lastTray = key; api.updateTray(state); }
}

function skip() {
  api.closeAlert();
  if (series) {
    const now = Date.now(), at = series.pausedAt || now, p = seriesAt(series, at);
    if (p.waiting) series.start = now;
    else {
      if (p.phase === 'work' && timer.startedAt) { logWork(false); series.logged = p.idx + 1; }
      series.start -= p.end - at; // the next phase begins now
      if (series.pausedAt) series.pausedAt = now;
    }
    seriesPos = '';
    applySeries(true);
    persist();
    render();
    return;
  }
  if (timer.phase === 'work') { stopEarly(); return; } // a single session has nothing to skip to
  setPhase('work');
  render();
}

function reset() {
  api.closeAlert();
  if (series) { stopSeries(); return; }
  if (timer.phase === 'work' && timer.startedAt && (timer.total - currentRemaining()) / 1000 >= MIN_SAVE_SEC) logWork(false);
  setPhase(timer.phase);
  render();
}

/* ================= Series =================
   A run of N work sessions with breaks between them, from a chosen start time (or now).
   It is a schedule, not a chain of events: work k runs from start + k*(work+brk) for `work`
   ms, then its break. So any device, at any moment — even after being closed for an hour —
   knows exactly where the series is, logs the sessions that passed, and carries on.
   Pause moves the whole schedule later; skip moves it earlier. No break after the last one. */
let series = null; // {start, count, work, brk, logged, pausedAt}
let seriesPos = '';
let seriesStartAt = 0; // start time picked in the setup (0 = now)

// a series of N sessions, or (count 0) an endless run: work and break by turns until stopped
const validSeries = s => !!s && typeof s === 'object' && s.work > 0 && Number(s.count) >= 0;
const isEndless = () => !!series && !(series.count > 0);
// Long break: every `every`-th break lasts `lbrk` instead of `brk` (0 = no long breaks), like a
// classic pomodoro (25-5, 25-5, 25-5, 25-15). The schedule stays pure arithmetic, so any device
// still knows where a series is. The same maths is in Host.java.
// the long break as set now (both 0 when it is off)
const longOf = () => ({ every: settings.longBrk > 0 ? settings.longEvery : 0, lbrk: (settings.longBrk || 0) * 60000 });
const seriesLong = s => (s.every > 1 && s.lbrk > 0 ? { n: s.every, L: s.lbrk } : null);
function seriesWorkStart(s, k) {
  const lg = seriesLong(s), c = s.work + s.brk;
  if (!lg) return s.start + k * c;
  const block = lg.n * s.work + (lg.n - 1) * s.brk + lg.L;
  return s.start + Math.floor(k / lg.n) * block + (k % lg.n) * c;
}
const seriesBreakLen = (s, k) => { const lg = seriesLong(s); return lg && k % lg.n === lg.n - 1 ? lg.L : s.brk; };
function seriesAt(s, at) {
  if (at < s.start) return { waiting: true, idx: 0, phase: 'work', start: s.start, end: s.start + s.work };
  const lg = seriesLong(s), c = s.work + s.brk;
  let k;
  if (!lg) k = Math.floor((at - s.start) / c);
  else {
    const block = lg.n * s.work + (lg.n - 1) * s.brk + lg.L;
    const b = Math.floor((at - s.start) / block), rem = at - s.start - b * block;
    k = b * lg.n + Math.min(lg.n - 1, Math.floor(rem / c));
  }
  const base = seriesWorkStart(s, k), within = at - base;
  if (s.count > 0 && (k >= s.count || (k === s.count - 1 && within >= s.work))) return { done: true, idx: s.count }; // count 0: endless
  const bl = seriesBreakLen(s, k);
  return within < s.work
    ? { idx: k, phase: 'work', start: base, end: base + s.work }
    : { idx: k, phase: 'break', start: base + s.work, end: base + s.work + bl, long: bl !== s.brk };
}
const seriesWorksDone = (s, at) => {
  const p = seriesAt(s, at);
  return p.done ? s.count : p.waiting ? 0 : p.idx + (p.phase === 'break' ? 1 : 0);
};

// Brings the timer in line with the schedule; logs work sessions that ended meanwhile.
// Returns true when the phase changed since the last call.
function applySeries(quiet) {
  const s = series;
  if (!s) return false;
  const now = Date.now(), at = s.pausedAt || now;
  const finished = seriesWorksDone(s, at);
  const label = s.label || $('#label').value.trim(); // the series' own task name, the same on every device
  let logged = false;
  for (let w = s.logged; w < finished; w++) {
    const start = seriesWorkStart(s, w);
    const one = { start, end: start + s.work, dur: Math.round(s.work / 1000), label, full: true, ...(s.id ? { series: s.id } : {}) };
    if (!sessions.some(x => sessionKey(x) === sessionKey(one))) { sessions.push({ id: newId(), ...one }); logged = true; }
  }
  if (finished > s.logged) { s.logged = finished; if (logged) { persistNow(); renderLabelMeta(); } }
  const p = seriesAt(s, at);
  const key = p.done ? 'done' : `${p.waiting ? 'wait' : p.phase}${p.idx}`;
  const changed = key !== seriesPos;
  const prev = seriesPos;
  seriesPos = key;
  if (p.done) {
    series = null;
    seriesPos = '';
    setPhase('work');
    persist();
    // only a boundary that just happened rings here; older ones already rang (phone host) or are stale
    const lastEnd = seriesWorkStart(s, s.count - 1) + s.work;
    if (!quiet && prev && now - lastEnd < 4000) alertSeriesDone();
    render();
    return true;
  }
  timer.phase = p.phase;
  timer.total = p.phase === 'work' ? s.work : p.end - p.start; // a long break is longer
  timer.startedAt = p.phase === 'work' && !p.waiting ? p.start : 0;
  timer.running = !p.waiting && !s.pausedAt;
  timer.endAt = timer.running ? p.end : 0;
  timer.remaining = p.waiting ? timer.total : Math.max(0, p.end - at);
  if (changed && !quiet && prev && now - p.start < 4000) {
    // a new phase began while we watched: the same alert as a normal phase end, already running
    if (p.phase === 'break') celebrate(s.work);
    brkMinNow = p.phase === 'break' ? Math.round((p.end - p.start) / 60000) : 0; // a long break says how long it is
    alertPhaseEnd(p.phase === 'work' ? 'break' : 'work', false, true);
  }
  if (changed) api.schedule(timer.running ? Math.max(0, p.end - now) : p.waiting ? Math.max(0, p.start - now) : 0);
  return changed;
}

function startSeries(count, at) {
  const now = Date.now();
  series = {
    id: newId(), start: at && at > now ? at : now, count,
    work: settings.work * 60000, brk: settings.brk * 60000, ...longOf(), logged: 0, pausedAt: 0,
    label: $('#label').value.trim(),
  };
  seriesPos = '';
  seriesStartAt = 0;
  api.closeAlert();
  applySeries(true);
  persist();
  render();
}
function stopSeries() {
  if (!series) return;
  const s = series;
  // the work in progress is kept from 10 minutes on (still part of the series)
  if (timer.phase === 'work' && timer.startedAt && (timer.total - currentRemaining()) / 1000 >= MIN_SAVE_SEC) logWork(false);
  series = null;
  seriesPos = '';
  setPhase('work');
  persist();
  render();
  void s;
}
function alertSeriesDone() {
  api.showAlert({
    next: 'break', title: t('seriesDoneTitle'), body: t('seriesDoneBody'),
    goLabel: '', okLabel: t('gotIt'), hideGo: true, sound: settings.sound, repeatSec: 15,
    theme: effectiveTheme(), lang: settings.lang,
  });
}
// "In 12 min · 14:00" for a series that has not started yet
function seriesWaitText() {
  if (!series || !seriesPos.startsWith('wait')) return '';
  const left = Math.max(0, series.start - Date.now());
  return t('seriesStartsIn')(fmtClock(left), hm(series.start));
}

// Light on resources: while the window is hidden in the tray only the title, tray tooltip and
// taskbar progress update, once a second; a paused timer redraws once a second too.
let winVisible = true;
let tickN = 0;
let lastTick = 0;
function tick() {
  planTick();
  if (series && !(tickN++ % 8)) maybeAskTask(); // about every 2 s: a planned run without a task asks once
  if (series) applySeries();
  if (timer.running && Date.now() >= timer.endAt) {
    timer.remaining = 0;
    complete();
    return;
  }
  const now = Date.now();
  if (winVisible && timer.running) renderTimer();
  else if (now - lastTick >= 1000) {
    lastTick = now;
    if (winVisible) renderTimer(); else renderOuter();
  }
}

/* ================= Rendering ================= */
let lastTitle = '';
let lastProg = '';
let lastStatus = '';
const TIMER_KEYS = ['phase', 'total', 'remaining', 'running', 'endAt', 'startedAt'];
let lastHostState = '';
function syncHost() {
  if (!api.timerState) return;
  const a = alertTexts(timer.phase);
  const state = {
    phase: timer.phase, total: timer.total, running: timer.running,
    remaining: timer.running ? 0 : timer.remaining, endAt: timer.running ? timer.endAt : 0,
    startedAt: timer.startedAt,
    label: $('#label').value.trim(),
    sound: settings.sound, popup: settings.popup,
    series,
    plan: hostPlan(), // the phone arms an alarm for the next planned start
    text: {
      phase: timer.phase === 'work' ? t('work') : t('break'), paused: t('paused'),
      pause: t('pause'), resume: t('resume'), reset: t('reset'),
      doneTitle: a.title, doneBody: a.body, go: a.auto ? '' : a.goLabel, ok: a.okLabel,
      // texts the host uses when it moves a series on by itself
      toBreakTitle: t('nBreakTitle'), toBreakBody: t('aBreakAuto')(settings.brk),
      toWorkTitle: t('nWorkTitle'), toWorkBody: t('aWorkAuto')(settings.work),
      seriesDoneTitle: t('seriesDoneTitle'), seriesDoneBody: t('seriesDoneBody'), gotIt: t('gotIt'), waitTitle: t('seriesWaitTitle'),
      work: t('work'), brk: t('break'),
    },
  };
  const key = JSON.stringify(state);
  if (key !== lastHostState) { lastHostState = key; api.timerState(state); }
}
function applyHostTimer(s) {
  if (!s || (s.phase !== 'work' && s.phase !== 'break') || !(s.total > 0)) return false;
  if (validSeries(s.series)) { series = { logged: 0, pausedAt: 0, ...(series || {}), ...s.series }; seriesPos = ''; applySeries(true); return true; }
  if (series && !s.series) { series = null; seriesPos = ''; }
  TIMER_KEYS.forEach(k => { if (k in s) timer[k] = s[k]; });
  timer.running = !!timer.running;
  if (!timer.running && !(timer.remaining >= 0)) timer.remaining = timer.total;
  return true;
}

let lastSavedTimer = '';
function renderOuter() {
  syncHost();
  syncTimer();
  // keep the running timer on disk too, so quitting or updating the app does not stop it
  const tk = `${timer.phase}|${timer.total}|${timer.running}|${timer.running ? timer.endAt : timer.remaining}|${timer.startedAt}`;
  if (tk !== lastSavedTimer) { if (lastSavedTimer) persist(); lastSavedTimer = tk; }
  const rem = currentRemaining();
  const isWork = timer.phase === 'work';
  const touched = !isUntouched();
  const ratio = timer.total ? 1 - rem / timer.total : 0;
  const title = touched ? `${fmtClock(rem)} · ${isWork ? t('work') : t('break')} — ${t('appName')}` : t('appName');
  if (title !== lastTitle) { api.title(title); lastTitle = title; }
  const prog = touched ? Math.min(1, Math.max(0.001, ratio)).toFixed(3) : '-1';
  const progKey = `${prog}|${touched && !timer.running}`;
  if (progKey !== lastProg) { lastProg = progKey; api.progress(Number(prog), touched && !timer.running); }
  syncTray();
}

function renderTimer() {
  const rem = currentRemaining();
  const isWork = timer.phase === 'work';
  const touched = !isUntouched();

  $('#time').textContent = fmtClock(rem);
  $('#time').classList.toggle('paused', touched && !timer.running);

  const tag = $('#phaseTag');
  const longNow = !isWork && !!series && !seriesPos.startsWith('wait') && !!seriesAt(series, series.pausedAt || Date.now()).long;
  tag.textContent = isWork ? t('work') : longNow ? t('longBreakL') : t('break');
  tag.classList.toggle('break', !isWork);

  const endless = isEndless();
  let info = series
    ? (seriesPos.startsWith('wait') ? seriesWaitText()
      : endless ? t('session')(seriesAt(series, series.pausedAt || Date.now()).idx + 1)
      : t('seriesOf')(Math.min(series.count, seriesAt(series, series.pausedAt || Date.now()).idx + 1), series.count))
    : t('session')(completedToday() + (isWork ? 1 : 0));
  if (touched && !timer.running) info += ` · ${t('paused')}`;
  $('#cycleInfo').textContent = info;

  const ratio = timer.total ? 1 - rem / timer.total : 0;
  const fill = $('#barFill');
  fill.style.width = `${(ratio * 100).toFixed(2)}%`;
  fill.classList.toggle('break', !isWork);
  const ring = $('#ringFill');
  ring.style.strokeDashoffset = String(289.03 * (1 - ratio));
  ring.classList.toggle('break', !isWork);
  ring.classList.toggle('empty', ratio <= 0);
  $('#face').classList.toggle('break', !isWork);
  $('#face').classList.toggle('running', timer.running);

  const btn = $('#btnStart');
  // an endless run behaves like a plain timer on the keys: pause / resume, ■ to finish
  const run = !!series && !seriesPos.startsWith('wait'); // every running series pauses like a plain timer (2.19)
  const seriesOn = false;
  const btnText = timer.running ? t('pause') : (touched || run ? t('resume') : t('start'));
  // Single session: stop (left) only once it has started, skip only for a leftover break.
  // In a series: no skip, no stop key; while it waits for its start time, the left key cancels it.
  // Endless: ■ always, skip during a break.
  const idleNow = !series && isUntouched() && timer.phase === 'work';
  $('#btnSkip').hidden = run ? timer.phase !== 'break' : (!!series || timer.phase !== 'break');
  $('#btnReset').hidden = run ? false : (seriesOn || (!series && !(timer.phase === 'work' && touched)));
  $('#btnReset').title = run ? t('endStop') : series ? t('reset') : t('stopHint');
  if (ANDROID) {
    // phone: a triangle that flows into two bars, or into a stop square
    // and the word next to it, as on the PC: one key, one look
    if (!btn.dataset.ico) { btn.dataset.ico = '1'; btn.innerHTML = PLAY_PAUSE_SVG + '<span class="bs-l"></span>'; }
    btn.classList.toggle('is-running', timer.running && !seriesOn);
    btn.classList.toggle('is-stop', seriesOn);
    const bl = btn.querySelector('.bs-l');
    if (bl && bl.textContent !== btnText) bl.textContent = btnText;
    btn.setAttribute('aria-label', btnText);
  } else btn.textContent = btnText; // PC: the word, as before
  btn.classList.toggle('secondary', timer.running);

  const goalH = settings.goal;
  const tSec = todaySec();
  $('#todayVal').textContent = goalH > 0 ? `${fmtDur(tSec)} / ${fmtHours(goalH)}` : fmtDur(tSec);
  if (ANDROID) $('#faceToday').textContent = series ? info : $('#todayVal').textContent;
  // idle (nothing started): the phone shows the setup wheels instead of the ring
  const idle = !series && isUntouched() && timer.phase === 'work';
  const wasIdle = $('#view-timer').classList.contains('idle');
  $('#view-timer').classList.toggle('idle', idle);
  if (ANDROID && wasIdle !== idle && lastTick) kick(idle ? $('.dials') : $('#face'), 'appear');
  $('#view-timer').classList.toggle('in-series', !!series);
  $('#view-timer').classList.toggle('no-brk', !series && !settings.simple && settings.seriesCount === 1);
  renderWhen();
  renderSimpleDay();
  renderChips();

  // Running time in the title bar while another tab is open
  const status = touched && view !== 'timer' ? `${isWork ? 'w' : 'b'}${timer.running ? '' : 'p'}|${fmtClock(rem)}` : '';
  if (status !== lastStatus) {
    lastStatus = status;
    const el = $('#tbStatus');
    el.hidden = !status;
    if (status) {
      el.textContent = fmtClock(rem);
      el.className = `brand-status${isWork ? '' : ' break'}${timer.running ? '' : ' paused'}`;
    }
  }
  renderOuter();
}


/* ---------- PC timer page: the settings of a run as a row of chips ----------
   "💼 25 min · ☕ 5 min · ↻ ∞ · 🕗" instead of a column of steppers; a chip opens its own small
   control (the start time opens the quick start). Shown only before a run starts. */
function renderChips() {
  const box = $('#tChips');
  if (!box || ANDROID) return;
  const set = (k, txt) => { const s = box.querySelector(`[data-chip="${k}"] span`); if (s && s.textContent !== txt) s.textContent = txt; };
  set('work', fmtMinutes(settings.work));
  set('brk', fmtMinutes(settings.brk));
  set('seriesCount', settings.seriesCount > 0 ? t('seriesN')(settings.seriesCount) : '∞');
  const n = nextPlan();
  set('when', n ? (startOfDay(n.at) === startOfDay() ? hm(n.at) : `${hm(n.at)} +1`) : t('startAt'));
  box.querySelector('[data-chip="when"]').classList.toggle('set', !!n);
  box.querySelector('[data-chip="brk"]').hidden = !settings.simple && settings.seriesCount === 1; // one session has no break
}
let chipKey = '';
function openChip(btn) {
  const key = btn.dataset.chip, pop = $('#chipPop');
  if (key === 'when') { closeChip(); quickStart(btn); return; }
  if (chipKey === key) { closeChip(); return; }
  chipKey = key;
  const title = { work: t('work'), brk: t('break'), seriesCount: t('seriesCountL') }[key];
  pop.innerHTML = `<div class="cp-title">${esc(title)}</div><div class="stepper" data-key="${key}"></div>`;
  pop.hidden = false;
  renderSteppers();
  const r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
  pop.style.left = `${Math.min(Math.max(10, r.left + r.width / 2 - w / 2), innerWidth - w - 10)}px`;
  pop.style.top = `${r.bottom + 8 + h > innerHeight - 10 ? r.top - h - 8 : r.bottom + 8}px`;
  $$('#tChips .tchip').forEach(b => b.classList.toggle('open', b === btn));
}
function closeChip() {
  chipKey = '';
  $('#chipPop').hidden = true;
  $$('#tChips .tchip').forEach(b => b.classList.remove('open'));
}
function bindChips() {
  if (ANDROID) return;
  $('#tChips').addEventListener('click', e => { const b = e.target.closest('.tchip'); if (b) openChip(b); });
  document.addEventListener('mousedown', e => { if (chipKey && !e.target.closest('#chipPop') && !e.target.closest('.tchip')) closeChip(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && chipKey) closeChip(); });
  addEventListener('resize', () => { if (chipKey) closeChip(); });
}
function renderSteppers() {
  if (ANDROID) renderDials();
  $$('.stepper[data-key]').forEach(el => {
    const key = el.dataset.key;
    const lim = LIMITS[key];
    const v = settings[key];
    const label = key === 'goal' || key === 'goalWeek' ? fmtHours(v) : key === 'seriesCount' ? (v > 0 ? t('seriesN')(v) : '∞')
      : key === 'longBrk' ? (v > 0 ? fmtMinutes(v) : t('off')) : key === 'longEvery' ? t('everyN')(v) : fmtMinutes(v);
    if (!el.firstChild) {
      el.innerHTML = '<button class="dec" aria-label="−">−</button><span class="val"></span><button class="inc" aria-label="+">+</button>';
      el.querySelector('.dec').addEventListener('click', () => changeSetting(key, -1));
      el.querySelector('.inc').addEventListener('click', () => changeSetting(key, +1));
    }
    const val = el.querySelector('.val');
    const prev = Number(el.dataset.v);
    el.dataset.v = v;
    val.textContent = label;
    if (!Number.isNaN(prev) && el.dataset.v !== '' && prev !== v) roll(val, v > prev); // the number rolls to its new value
    el.querySelector('.dec').disabled = v <= lim.min;
    el.querySelector('.inc').disabled = v >= lim.max;
  });
}

function renderControls() {
  $$('.toggle[data-key]').forEach(el => el.classList.toggle('on', !!settings[el.dataset.key]));
  $$('.seg[data-key]').forEach(seg => {
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.val === settings[seg.dataset.key]));
  });
  $$('#chartRange button').forEach(b => b.classList.toggle('on', Number(b.dataset.range) === chartRange));
  $$('#heatRange button').forEach(b => b.classList.toggle('on', Number(b.dataset.range) === settings.heatRange));
  $$('#chartMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === settings.chartMode));
}

/* ---------- A small "i" next to a heading: the longer explanation lives there, not on the page ---------- */
function initInfo() {
  $$('[data-info]').forEach(h => {
    if (h.parentElement.classList.contains('head-i')) return;
    const w = document.createElement('div');
    w.className = 'head-i';
    h.parentNode.insertBefore(w, h);
    w.appendChild(h);
    w.insertAdjacentHTML('beforeend', `<button type="button" class="info-i" data-k="${h.dataset.info}" aria-label="i">i</button>`);
  });
  const tip = document.createElement('div');
  tip.className = 'info-tip';
  tip.hidden = true;
  document.body.appendChild(tip);
  let open = null;
  const close = () => { tip.hidden = true; if (open) open.classList.remove('on'); open = null; };
  document.addEventListener('click', e => {
    const b = e.target.closest('.info-i');
    if (!b) { if (open && !e.target.closest('.info-tip')) close(); return; }
    e.preventDefault();
    e.stopPropagation();
    if (open === b) { close(); return; }
    close();
    open = b;
    b.classList.add('on');
    tip.textContent = t(b.dataset.k);
    tip.hidden = false;
    const r = b.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = `${Math.min(Math.max(10, r.left + r.width / 2 - w / 2), innerWidth - w - 10)}px`;
    tip.style.top = `${r.bottom + h + 8 > innerHeight - 10 ? Math.max(10, r.top - h - 8) : r.bottom + 8}px`;
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) close(); });
  addEventListener('resize', close);
  $('main').addEventListener('scroll', close, { passive: true });
}

/* ---------- "Just a timer": the same app, folded down to the essentials ----------
   Three tabs (timer, stats, settings); on the timer page the time, the key and the day at a glance
   (today towards the goal, the streak). Nothing is lost: everything comes back with the switch.
   One class on <html> hides the rest, so it costs nothing in memory. */
const SIMPLE_HIDDEN = ['projects', 'apps', 'plan'];
function applyMode() {
  document.documentElement.classList.toggle('simple', !!settings.simple);
  if (settings.simple && SIMPLE_HIDDEN.includes(view)) $('.tab[data-view="timer"]').click();
  fitTabs();
  if (ANDROID && typeof setPager === 'function') setPager(false);
}
// First start of a new user: which way to use it (old users keep everything, without a question)
function maybeAskMode() {
  if (settings.modeAsked) return;
  settings.modeAsked = 1;
  persist();
  if (sessions.length) return;
  setTimeout(() => confirmModal(t('modeQ'), t('modeText'), t('modeSimple'), { safe: true, cancel: t('modeFull') })
    .then(ok => setValue('simple', !!ok)), 900);
}
// Someone in the simple mode who keeps coming back to the stats may want the rest: offer it once,
// only when it is a habit (8 visits on at least 3 different days of the last week), never at once
function nudgeFull() {
  if (!settings.simple || settings.nudged) return;
  const today = dayKey(Date.now()), weekAgo = dayKey(addDays(startOfDay(), -6));
  settings.simpleStats = (settings.simpleStats || 0) + 1;
  settings.statsDays = [...new Set([...(settings.statsDays || []).filter(d => d >= weekAgo), today])];
  persist();
  if (settings.simpleStats < 8 || settings.statsDays.length < 3) return;
  settings.nudged = 1;
  confirmModal(t('nudgeQ'), t('nudgeText'), t('nudgeYes'), { safe: true, cancel: t('nudgeNo') })
    .then(ok => { if (ok) setValue('simple', false); });
}
let streakKey = '', streakVal = 0;
function dayStreak() {
  const key = `${sessions.length}|${dayKey(Date.now())}|${liveWorkSec() >= 60}`;
  if (key === streakKey) return streakVal;
  streakKey = key;
  const byDay = workByDay(), today0 = startOfDay();
  let n = 0;
  for (let ts = (byDay.get(dayKey(today0)) || 0) >= 60 ? today0 : addDays(today0, -1); (byDay.get(dayKey(ts)) || 0) >= 60; ts = addDays(ts, -1)) n++;
  streakVal = n;
  return n;
}
function renderSimpleDay() {
  const done = todaySec(), goal = settings.goal * 3600;
  const txt = goal > 0 ? t('sdGoal')(fmtDur(done), fmtHours(settings.goal)) : t('sdToday')(fmtDur(done));
  if ($('#sdDone').textContent !== txt) $('#sdDone').textContent = txt;
  const st = ''; // no streak here: the day is enough (2.19.2)
  if ($('#sdStreak').textContent !== st) $('#sdStreak').textContent = st;
  $('#simpleDay').classList.toggle('no-goal', !(goal > 0));
  $('#sdFill').style.width = `${goal > 0 ? Math.min(100, (done / goal) * 100).toFixed(1) : 0}%`;
  // the goal reached: once a day, a flash and a word (in either mode)
  const today = dayKey(Date.now());
  if (goal > 0 && done >= goal && settings.goalHit !== today) {
    settings.goalHit = today;
    persist();
    kick($('#simpleDay'), 'win');
    toast(t('goalHit'));
  }
}
// PC tab bar: six tabs must fit any window and language — tighter spacing first, then icons only
function fitTabs() {
  if (ANDROID) return;
  const bar = $('.tabs');
  if (!bar) return;
  const steps = ['tight', 'tighter', 'icons'];
  bar.classList.remove(...steps);
  for (const s of steps) {
    if (bar.scrollWidth <= bar.clientWidth + 1) break;
    bar.classList.add(s);
  }
}
function applyI18n() {
  document.documentElement.lang = settings.lang;
  $$('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (el.dataset.i18n === 'hint') el.innerHTML = v; else el.textContent = v;
  });
  $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  fitTabs();
}

function effectiveTheme() {
  return settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme;
}
function applyTheme() {
  document.documentElement.dataset.theme = effectiveTheme();
  api.theme(settings.theme);
}

function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderStats() {
  const today0 = startOfDay();
  const live = liveWorkSec();
  swapText($('#stToday'), fmtDur(todaySec()));
  swapText($('#stWeek'), fmtDur(secondsSince(today0 - 6 * 86400000) + live));
  swapText($('#stMonth'), fmtDur(secondsSince(today0 - 29 * 86400000) + live));

  // goal
  const goalSec = settings.goal * 3600;
  $('#goalBlock').style.display = goalSec > 0 ? '' : 'none';
  if (goalSec > 0) {
    const done = todaySec();
    const pct = Math.min(100, (done / goalSec) * 100);
    $('#goalFill').style.width = `${pct}%`;
    swapText($('#goalText'), `${fmtDur(done)} / ${fmtHours(settings.goal)} · ${Math.round((done / goalSec) * 100)}%`);
  }
  // the week's goal (from Monday): an uneven week still adds up
  const wkSec = (settings.goalWeek || 0) * 3600;
  $('#goalWeekBlock').style.display = wkSec > 0 ? '' : 'none';
  if (wkSec > 0) {
    const mon = addDays(today0, -((new Date(today0).getDay() + 6) % 7));
    const done = secondsSince(mon) + liveWorkSec();
    $('#goalWeekFill').style.width = `${Math.min(100, (done / wkSec) * 100)}%`;
    swapText($('#goalWeekText'), `${fmtDur(done)} / ${fmtHours(settings.goalWeek)} · ${Math.round((done / wkSec) * 100)}%`);
  }

  const squares = settings.chartMode === 'squares';
  $('#chart').hidden = squares;
  $('#heat').hidden = !squares;
  $('#chartRange').hidden = squares;
  $('#heatRange').hidden = !squares;
  if (squares) renderHeat(); else renderBars(today0, goalSec, live);
  renderHistory();
}

/* ---------- Activity heatmap (GitHub-style squares) ---------- */
function addDays(ts, n) { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); }

function workByDay() {
  const m = new Map();
  sessions.forEach(s => { const k = dayKey(s.start); m.set(k, (m.get(k) || 0) + s.dur); });
  const live = liveWorkSec();
  if (live) { const k = dayKey(Date.now()); m.set(k, (m.get(k) || 0) + live); }
  return m;
}

// 0 = no work (neutral, never red), 1..4 = more and more green.
function dayLevel(sec, maxSec) {
  if (sec < 60) return 0;
  const goal = settings.goal * 3600;
  const r = goal > 0 ? sec / goal : sec / Math.max(maxSec, 1);
  const steps = goal > 0 ? [0.25, 0.5, 1] : [0.25, 0.5, 0.75];
  return r < steps[0] ? 1 : r < steps[1] ? 2 : r < steps[2] ? 3 : 4;
}

function renderHeat() {
  const el = $('#heat');
  const weeks = settings.heatRange;
  const today0 = startOfDay();
  const dow = (new Date(today0).getDay() + 6) % 7; // Monday = 0
  const monday0 = addDays(today0, -dow);
  const byDay = workByDay();
  const maxSec = Math.max(0, ...byDay.values());

  // The squares always fill the width: columns are whole weeks (a multiple of 7, so weekdays line
  // up), as many as fit at a comfortable size. Rows go down in time, newest on top, so a longer
  // range only adds rows at the bottom and the page grows downwards.
  const gap = ANDROID ? 3 : 4;
  const labelW = 0; // just squares: no weekday or month labels
  // width only decides how many weeks share a row; the columns themselves stretch to fit (a scrollbar
  // appearing later can never push the last one out)
  const avail = Math.max(140, (el.clientWidth || el.parentElement.clientWidth || 600) - labelW - 14);
  const perWeek = k => 7 * k;
  let k = Math.max(1, Math.floor((avail + gap) / (perWeek(1) * (15 + gap))));
  k = Math.min(k, Math.ceil(weeks / 2)); // keep at least two rows
  const cols = perWeek(k);
  const cell = (avail - (cols - 1) * gap) / cols;
  const rows = Math.ceil(weeks / k);

  const dayNames = t('daysMon');
  let head = '<span></span>';
  for (let c = 0; c < cols; c++) head += `<span>${c < 7 ? dayNames[c].slice(0, 2) : ''}</span>`;
  let cells = '';
  let activeDays = 0;
  let lastMonth = -1;
  // calendar order: oldest week first, so every row is full and only the last one (ending today) may be short
  const firstMonday = addDays(monday0, -(rows * k - 1) * 7);
  for (let r = 0; r < rows; r++) {
    const rowStart = addDays(firstMonday, r * k * 7);
    const m = new Date(rowStart).getMonth();
    void m;
    lastMonth = m;
    for (let c = 0; c < cols; c++) {
      const ts = addDays(rowStart, c);
      const pos = `grid-row:${r + 1};grid-column:${c + 1}`;
      if (ts > today0) break; // the days still to come are simply not drawn
      const sec = byDay.get(dayKey(ts)) || 0;
      if (sec >= 60) activeDays++;
      const lv = dayLevel(sec, maxSec);
      const tip = `${dayTitle(ts)} · ${sec >= 60 ? fmtDur(sec) : t('noWork')}`;
      cells += `<i class="hc l${lv}${ts === today0 ? ' today' : ''}" data-tip="${esc(tip)}" style="${pos};--r:${r};--c:${c}"></i>`;
    }
  }

  // current streak of days with work (today may still be empty)
  let streak = 0;
  for (let ts = (byDay.get(dayKey(today0)) || 0) >= 60 ? today0 : addDays(today0, -1); (byDay.get(dayKey(ts)) || 0) >= 60; ts = addDays(ts, -1)) streak++;

  const legend = [0, 1, 2, 3, 4].map(l => `<i class="hc l${l}"></i>`).join('');
  const old = el.querySelector('.heat-wrap');
  const fromH = old ? old.getBoundingClientRect().height : 0;
  el.style.setProperty('--cols', cols);
  el.style.setProperty('--cell', `${cell.toFixed(2)}px`);
  el.style.setProperty('--gap', `${gap}px`);
  el.style.setProperty('--lw', `${labelW}px`);
  el.classList.remove('dense');
  el.innerHTML = `
    <div class="heat-wrap"><div class="heat-grid">${cells}</div></div>
    <div class="heat-foot">
      <span class="muted">${t('activeDays')(activeDays)}${streak > 1 ? ` · ${t('streak')(streak)}` : ''}</span>
      <span class="heat-legend">${t('less')}${legend}${t('more')}</span>
    </div>`;
  // a longer range opens downwards smoothly: one element changes height, new rows unfold in
  const wrap = el.querySelector('.heat-wrap');
  const toH = wrap.getBoundingClientRect().height; // the grid sizes itself (fluid columns)
  const sig = `${weeks}|${!!fromH}`;
  if (heatSig && sig !== heatSig && fromH) {
    wrap.style.height = `${fromH}px`;
    void wrap.offsetHeight;
    wrap.style.height = `${toH}px`;
    kick(el, 'unfold');
    clearTimeout(heatT);
    heatT = setTimeout(() => { el.classList.remove('unfold'); wrap.style.height = ''; }, 1200);
  }
  heatSig = sig;
}
let heatSig = '', heatT = null;

// one floating tooltip for all squares
function initHeatTip() {
  const tip = document.createElement('div');
  tip.className = 'heat-tip';
  document.body.appendChild(tip);
  $('#heat').addEventListener('mouseover', e => {
    const c = e.target.closest('[data-tip]');
    if (!c) { tip.classList.remove('show'); return; }
    tip.textContent = c.dataset.tip;
    const r = c.getBoundingClientRect();
    tip.classList.add('show');
    const w = tip.offsetWidth;
    tip.style.left = `${Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8)}px`;
    tip.style.top = `${r.top - tip.offsetHeight - 8}px`;
  });
  $('#heat').addEventListener('mouseleave', () => tip.classList.remove('show'));
}

function renderBars(today0, goalSec, live) {
  const days = [];
  for (let i = chartRange - 1; i >= 0; i--) {
    const d0 = new Date(today0); d0.setDate(d0.getDate() - i);
    days.push({ ts: d0.getTime(), key: dayKey(d0.getTime()), sec: 0 });
  }
  const byKey = Object.fromEntries(days.map(d => [d.key, d]));
  sessions.forEach(s => { const d = byKey[dayKey(s.start)]; if (d) d.sec += s.dur; });
  days[days.length - 1].sec += live;
  const maxSec = Math.max(goalSec, ...days.map(d => d.sec), 3600);
  const chart = $('#chart');
  const labelEvery = chartRange <= 7 ? 1 : chartRange <= 14 ? 2 : 5;
  chart.innerHTML = days.map((d, i) => {
    const h = (d.sec / maxSec) * 100;
    const dt = new Date(d.ts);
    const isToday = d.ts === today0;
    const lbl = chartRange <= 7 ? t('days')[dt.getDay()] : String(dt.getDate());
    const showLbl = (days.length - 1 - i) % labelEvery === 0;
    return `<div class="col${isToday ? ' today' : ''}">
      <div class="tip">${esc(dayTitle(d.ts))} · ${fmtDur(d.sec)}</div>
      <div class="b${d.sec < 30 ? ' zero' : ''}" style="height:${h.toFixed(1)}%"></div>
      ${showLbl ? `<div class="lbl">${lbl}</div>` : ''}
    </div>`;
  }).join('') + (goalSec > 0 ? '<div class="goal-line"></div>' : '');
  // place goal line precisely
  const gl = chart.querySelector('.goal-line');
  if (gl) {
    const inner = chart.clientHeight - 20;
    gl.style.bottom = `${20 + (goalSec / maxSec) * inner}px`;
  }
}

function renderHistory() {
  renderHistoryShort();
  if ($('#histAll').hidden) return; // the full list is built only while its card is open
  const hist = $('#historyFull');
  if (!sessions.length) {
    hist.innerHTML = `<div class="empty-state">${t('noData')}</div>`;
    $('#btnMore').style.display = 'none';
    return;
  }
  const groups = new Map();
  [...sessions].sort((a, b) => b.start - a.start).forEach(s => {
    const k = dayKey(s.start);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(s);
  });
  const keys = [...groups.keys()];
  const shown = keys.slice(0, historyLimit);
  hist.innerHTML = shown.map(k => {
    const list = groups.get(k);
    const total = list.reduce((a, s) => a + s.dur, 0);
    return `<div class="day-head"><span>${esc(dayTitle(list[0].start))}</span><span>${fmtDur(total)}</span></div>` +
      list.map(s => `<div class="row" data-id="${s.id}" title="${esc(t('editEntry'))}">
        <span class="r-time">${s.manual ? t('atManual') : `${hm(s.start)}–${hm(s.end)}`}</span>
        <span class="r-label${s.label ? '' : ' empty'}">${esc(s.label || t('noLabel'))}</span>
        <span class="r-dur">${fmtDur(s.dur)}</span>
        <button class="del" data-id="${s.id}" title="×"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
      </div>`).join('');
  }).join('');
  $('#btnMore').style.display = keys.length > historyLimit ? '' : 'none';
}

function render() {
  renderTimer();
  renderSteppers();
  renderControls();
  if (view === 'stats') renderStats();
}

/* ================= Projects ================= */
const projKey = s => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
const cleanName = s => String(s || '').trim().replace(/\s+/g, ' ');
let showHidden = false;

function projectList() {
  const map = new Map();
  const get = name => {
    const k = projKey(name);
    if (!map.has(k)) map.set(k, { key: k, name: cleanName(name), total: 0, week: 0, today: 0, count: 0, last: 0, deadline: '', hidden: false, created: 0, current: false });
    return map.get(k);
  };
  for (const m of Object.values(projects)) {
    const p = get(m.name);
    p.name = m.name; p.deadline = m.deadline || ''; p.hidden = !!m.hidden; p.created = m.created || 0;
  }
  const today0 = startOfDay();
  const week0 = today0 - 6 * 86400000;
  const add = (p, start, dur) => {
    p.total += dur;
    if (start >= week0) p.week += dur;
    if (start >= today0) p.today += dur;
  };
  [...sessions].sort((a, b) => a.start - b.start).forEach(s => {
    if (!projKey(s.label)) return;
    const p = get(s.label);
    if (!projects[p.key]) p.name = cleanName(s.label); // latest spelling wins
    add(p, s.start, s.dur);
    p.count += 1;
    p.last = Math.max(p.last, s.end || s.start);
  });
  const cur = projKey($('#label').value);
  if (cur) {
    const p = map.get(cur);
    if (p) {
      p.current = true;
      const live = liveWorkSec();
      if (live) { add(p, Date.now(), live); p.last = Date.now(); }
    }
  }
  return [...map.values()].sort((a, b) => (b.current - a.current) || (Math.max(b.last, b.created) - Math.max(a.last, a.created)));
}

function parseDay(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : 0;
}
function fmtDate(s) {
  const d = new Date(parseDay(s));
  const thisYear = d.getFullYear() === new Date().getFullYear();
  const y = thisYear ? '' : ` ${d.getFullYear()}`;
  return settings.lang === 'ru'
    ? `${d.getDate()} ${t('months')[d.getMonth()]}${y}`
    : `${t('months')[d.getMonth()]} ${d.getDate()}${y}`;
}
function deadlineInfo(s) {
  const ts = parseDay(s);
  if (!ts) return null;
  const days = Math.round((ts - startOfDay()) / 86400000);
  const when = days < 0 ? t('dlOver')(-days) : days === 0 ? t('dlToday') : days === 1 ? t('dlTomorrow') : t('dlLeft')(days);
  const cls = days < 0 ? 'over' : days <= 2 ? 'soon' : '';
  return { days, when, cls, text: `${fmtDate(s)} · ${when}` };
}

function meta(key, name) {
  if (!projects[key]) projects[key] = { name: cleanName(name), deadline: '', hidden: false, created: Date.now() };
  return projects[key];
}

// The custom suggestion list reads projects on demand; nothing to precompute.
function updateDatalist() {}

function renderLabelMeta() {
  // nothing under the project name on the timer page: no total, no deadline
  $('#labelMeta').innerHTML = '';
  fitTimer();
}

const ICONS = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 5.2v13.6a.8.8 0 0 0 1.2.7l10.4-6.8a.8.8 0 0 0 0-1.4L8.2 4.5A.8.8 0 0 0 7 5.2z" fill="currentColor"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M15.5 4.5l4 4L9 19H5v-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  hide: '<svg viewBox="0 0 24 24"><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 19.5l15-15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  show: '<svg viewBox="0 0 24 24"><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4.5 7h15M10 4h4M6.5 7l.9 12a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cal: '<svg viewBox="0 0 20 20"><rect x="3.5" y="4.5" width="13" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.5h13M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  clockPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 11.5A8 8 0 1 0 12.5 20"/><path d="M12 7.5V12l2.5 1.5M18 15v6M15 18h6"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11a7 7 0 0 1 12-4.9L19 8M19 4v4h-4M19 13a7 7 0 0 1-12 4.9L5 16M5 20v-4h4"/></svg>',
  dot: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  prev: '<svg viewBox="0 0 20 20"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 20 20"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function projRow(p) {
  const dl = deadlineInfo(p.deadline);
  const chip = dl
    ? `<span class="chip ${dl.cls}"><button class="chip-main" data-act="deadline">${ICONS.cal}<span>${esc(dl.text)}</span></button><button class="chip-x" data-act="cleardl" title="${esc(t('clearDeadline'))}">${ICONS.x}</button></span>`
    : (p.hidden ? '' : `<button class="chip add" data-act="deadline">${ICONS.cal}<span>${esc(t('addDeadline').replace('+ ', ''))}</span></button>`);
  const stat = (label, val) => `<span class="ps"><span class="ps-l">${esc(label)}</span> ${val}</span>`;
  const stats = [stat(t('pTodayL'), fmtDur(p.today)), stat(t('pWeekL7'), fmtDur(p.week)), `<span class="ps">${t('pSessions')(p.count)}</span>`].join('');
  const btn = (act, icon, title, cls = '') => `<button class="icon-btn sm${cls}" data-act="${act}" title="${esc(title)}">${icon}</button>`;
  const acts = btn('work', ICONS.play, t('workOn')) + btn('addtime', ICONS.clockPlus, t('atTitle')) + btn('rename', ICONS.edit, t('rename'));
  return `<div class="proj${p.current ? ' current' : ''}" data-key="${esc(p.key)}">
    <div class="proj-top">
      <button class="pcheck" data-act="done" title="${esc(t('markDone'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M6.5 12.5l3.6 3.6 7.4-7.6"/></svg></button>
      <div class="proj-name"><span class="pn">${esc(p.name)}</span>${p.current ? `<span class="tag mini">${esc(t('current'))}</span>` : ''}</div>
      <div class="proj-acts">${acts}</div>
      <div class="proj-total" title="${esc(t('pTotal'))}">${fmtDur(p.total)}</div>
    </div>
    <div class="proj-stats">${stats}${chip}</div>
  </div>`;
}

// Projects: active ones in the list; a ticked one goes to the archive (the old "hidden" flag).
function renderProjects() {
  if (document.querySelector('.proj .inline') || document.querySelector('.proj.checking')) return; // renaming or ticking
  const all = projectList();
  const vis = all.filter(p => !p.hidden);
  const arch = all.filter(p => p.hidden);
  setHTML($('#projList'), vis.length ? vis.map(projRow).join('') : `<div class="empty-state">${t('projEmpty')}</div>`);
  $('#btnArchive').parentElement.hidden = !arch.length;
  $('#btnArchive span').textContent = t('archiveN')(arch.length);
  if (!$('#archive').hidden) renderArchive();
}

/* ---------- Archive of finished projects ---------- */
function renderArchive() {
  const arch = projectList().filter(p => p.hidden).sort((a, b) => ((projects[b.key] || {}).doneAt || b.last) - ((projects[a.key] || {}).doneAt || a.last));
  const btn = (act, icon, title, cls = '') => `<button class="icon-btn sm${cls}" data-act="${act}" title="${esc(title)}">${icon}</button>`;
  setHTML($('#archList'), arch.length ? arch.map(p => {
    const at = (projects[p.key] || {}).doneAt;
    return `<div class="arch-item" data-key="${esc(p.key)}">
      <span class="arch-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12.5l3.6 3.6 7.4-7.6"/></svg></span>
      <span class="hs-main"><span class="hs-title pn">${esc(p.name)}</span><span class="hs-sub">${fmtDur(p.total)}${at ? ` · ${t('doneOn')(fmtDate(dayKey(at)))}` : ''}</span></span>
      <span class="arch-acts">${btn('unhide', ICONS.show, t('restore'))}${btn('delete', ICONS.trash, t('delete'), ' danger')}</span>
    </div>`;
  }).join('') : `<div class="empty-state">${t('archEmpty')}</div>`);
}
function bindArchive() {
  $('#btnArchive').addEventListener('click', () => { renderArchive(); $('#archive').hidden = false; });
  $('#archive').addEventListener('click', async e => {
    if (e.target.id === 'archive' || e.target.closest('#archClose')) { $('#archive').hidden = true; return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const row = b.closest('.arch-item');
    const key = row.dataset.key, name = row.querySelector('.pn').textContent;
    if (b.dataset.act === 'unhide') { const m = meta(key, name); m.hidden = false; delete m.doneAt; }
    else if (b.dataset.act === 'delete') {
      $('#archive').hidden = true;
      if (!(await confirmModal(t('delProjTitle')(name), t('delProjText'), t('delete')))) { $('#archive').hidden = false; return; }
      deleteProject(key);
      $('#archive').hidden = false;
    }
    persist();
    renderProjects();
    renderArchive();
  });
}

function renameProject(key, name) {
  name = cleanName(name);
  const nk = projKey(name);
  if (!nk) return;
  sessions.forEach(s => { if (projKey(s.label) === key) s.label = name; });
  const old = projects[key];
  if (old) {
    delete projects[key];
    const target = projects[nk];
    projects[nk] = { ...old, ...(target || {}), name, deadline: (target && target.deadline) || old.deadline };
  } else if (projects[nk]) {
    projects[nk].name = name;
  }
  if (projKey($('#label').value) === key) $('#label').value = name;
  persistNow();
}

// Deleting keeps the time (stats stay right) but drops the project name from its sessions.
function deleteProject(key) {
  sessions.forEach(s => { if (projKey(s.label) === key) s.label = ''; });
  delete projects[key];
  if (projKey($('#label').value) === key) $('#label').value = '';
  persistNow();
  toast(t('projDeleted'));
}

function startRename(row) {
  const key = row.dataset.key;
  const span = row.querySelector('.pn');
  const input = document.createElement('input');
  input.className = 'text-input inline';
  input.value = span.textContent;
  input.maxLength = 120;
  span.replaceWith(input);
  input.focus();
  input.select();
  let done = false;
  const finish = ok => {
    if (done) return;
    done = true;
    const val = input.value;
    input.replaceWith(span);
    if (ok && cleanName(val) && cleanName(val) !== span.textContent) renameProject(key, val);
    renderProjects();
    renderLabelMeta();
  };
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finish(true);
    else if (e.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
}

async function onProjectClick(e) {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const row = btn.closest('.proj');
  const key = row.dataset.key;
  const name = row.querySelector('.pn') ? row.querySelector('.pn').textContent : key;
  switch (btn.dataset.act) {
    case 'done': {
      // the tick draws itself, the card folds away, and the project lands in the archive
      if (row.classList.contains('checking')) return;
      row.style.height = `${row.offsetHeight}px`;
      row.classList.add('checking');
      setTimeout(() => {
        const m = meta(key, name);
        m.hidden = true;
        m.doneAt = Date.now();
        if (projKey($('#label').value) === key) $('#label').value = '';
        persist();
        row.classList.remove('checking');
        renderProjects();
        renderLabelMeta();
        toast(t('archived'));
      }, 720);
      return;
    }
    case 'work':
      $('#label').value = name;
      persist();
      $$('.tab')[0].click();
      break;
    case 'rename':
      startRename(row);
      return;
    case 'addtime':
      openAddTime(name);
      return;
    case 'hide':
      meta(key, name).hidden = true;
      break;
    case 'unhide':
      meta(key, name).hidden = false;
      break;
    case 'delete':
      if (!(await confirmModal(t('delProjTitle')(name), t('delProjText'), t('delete')))) return;
      deleteProject(key);
      break;
    case 'deadline':
      openCalendar(btn, (projects[key] && projects[key].deadline) || '', v => {
        meta(key, name).deadline = v;
        persist();
        renderProjects();
        renderLabelMeta();
      });
      return;
    case 'cleardl':
      meta(key, name).deadline = '';
      break;
  }
  persist();
  renderProjects();
  renderLabelMeta();
}

function onDeadlineChange() {}

/* ---------- Calendar popover (deadline picker) ---------- */
let calState = null; // {month: Date(1st of month), value: 'YYYY-MM-DD', onPick, anchor}

function isoDay(ts) { return dayKey(ts); }

function renderCalendar() {
  const { month, value } = calState;
  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const today = isoDay(Date.now());
  const title = settings.lang === 'ru'
    ? `${t('monthsNom')[m]} ${y}`
    : `${t('monthsNom')[m]} ${y}`;
  let days = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m, 1 - lead + i);
    const iso = isoDay(d.getTime());
    const cls = ['cd'];
    if (d.getMonth() !== m) cls.push('out');
    if (iso === today) cls.push('today');
    if (iso === value) cls.push('sel');
    if (d.getDay() === 0 || d.getDay() === 6) cls.push('we');
    days += `<button class="${cls.join(' ')}" data-d="${iso}">${d.getDate()}</button>`;
  }
  $('#cal').innerHTML = `
    <div class="cal-head">
      <span class="cal-title">${esc(title)}</span>
      <button class="icon-btn sm" data-nav="-1">${ICONS.prev}</button>
      <button class="icon-btn sm" data-nav="1">${ICONS.next}</button>
    </div>
    <div class="cal-wd">${t('daysMon').map(n => `<span>${esc(n)}</span>`).join('')}</div>
    <div class="cal-grid">${days}</div>
    <div class="cal-foot">
      <button class="ghost" data-act="clear">${esc(t('calClear'))}</button>
      <button class="ghost" data-act="today">${esc(t('calToday'))}</button>
    </div>`;
}

function openCalendar(anchor, value, onPick) {
  const base = value ? new Date(parseDay(value)) : new Date();
  calState = { month: new Date(base.getFullYear(), base.getMonth(), 1), value, onPick, anchor };
  renderCalendar();
  const cal = $('#cal');
  cal.hidden = false;
  const r = anchor.getBoundingClientRect();
  const w = cal.offsetWidth, h = cal.offsetHeight;
  let x = Math.min(Math.max(10, r.right - w), window.innerWidth - w - 10);
  let y = r.bottom + 8;
  if (y + h > window.innerHeight - 10) y = Math.max(10, r.top - h - 8);
  cal.style.left = `${x}px`;
  cal.style.top = `${y}px`;
}

function closeCalendar() {
  $('#cal').hidden = true;
  calState = null;
}

function bindCalendar() {
  $('#cal').addEventListener('click', e => {
    if (!calState) return;
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      calState.month = new Date(calState.month.getFullYear(), calState.month.getMonth() + Number(nav.dataset.nav), 1);
      renderCalendar();
      return;
    }
    const day = e.target.closest('[data-d]');
    const act = e.target.closest('[data-act]');
    let v = null;
    if (day) v = day.dataset.d;
    else if (act && act.dataset.act === 'today') v = isoDay(Date.now());
    else if (act && act.dataset.act === 'clear') v = '';
    if (v === null) return;
    const pick = calState.onPick;
    closeCalendar();
    pick(v);
  });
  document.addEventListener('mousedown', e => {
    if (calState && !e.target.closest('#cal') && !e.target.closest('[data-act="deadline"]')) closeCalendar();
  });
  window.addEventListener('resize', () => { if (calState) closeCalendar(); });
  $('main').addEventListener('scroll', () => { if (calState) closeCalendar(); }, { passive: true });
}

/* ---------- Project suggestions under the task field ---------- */
let sugIndex = -1;
let sugItems = [];

// The task field picks a project. The list opens from the chevron (or ↓) and as you type, when it
// shows the projects that match. At its foot, in quiet grey: "Create a new project", or, once you
// have typed a name that is not a project yet, "Create “that name”". A name becomes a project only
// from there (or Enter on it); leaving the field with an unknown name puts back what was there.
let sugOpen = false;
let sugBefore = '';
function renderSuggest() {
  const box = $('#labelSuggest'), wrap = box.parentElement;
  const raw = cleanName($('#label').value), key = projKey(raw);
  const all = projectList().filter(p => !p.hidden);
  const exact = all.some(p => p.key === key);
  const typed = raw && raw !== cleanName(sugBefore) && !exact; // a new name being typed
  sugItems = !sugOpen ? [] : (typed ? all.filter(p => p.name.toLowerCase().includes(raw.toLowerCase())) : all).slice(0, 12);
  wrap.classList.toggle('open', sugOpen);
  if (!sugOpen) { box.hidden = true; return; }
  if (sugIndex >= sugItems.length + (typed ? 1 : 0)) sugIndex = sugItems.length - 1;
  const rows = sugItems.map((p, i) => {
    const dl = deadlineInfo(p.deadline);
    return `<button class="sug${i === sugIndex ? ' on' : ''}${p.key === key ? ' cur' : ''}" data-i="${i}" tabindex="-1">
      <span class="sug-dot"></span>
      <span class="sug-name">${esc(p.name)}</span>
      <span class="sug-meta">${dl ? `<span class="dl-text ${dl.cls}">${esc(dl.when)}</span> · ` : ''}${fmtDur(p.total)}</span>
      <span class="sug-tick">${p.key === key ? '<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</span>
    </button>`;
  }).join('');
  const ico = '<span class="sug-plus-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5v13M5.5 12h13"/></svg></span>';
  const foot = typed
    ? `<button class="sug-create typed${sugIndex === sugItems.length ? ' on' : ''}" data-act="create" tabindex="-1">${ico}<span>${esc(t('createNamed')(raw))}</span></button>`
    : `<button class="sug-create" data-act="new" tabindex="-1">${ico}<span>${esc(t('newProjBtn'))}</span></button>`;
  box.innerHTML = (rows || (typed ? '' : `<div class="sug-empty">${esc(t('noData'))}</div>`)) + `<div class="sug-foot${rows ? '' : ' alone'}">${foot}</div>`;
  box.hidden = false;
}
function setSuggest(open) {
  sugOpen = open;
  sugIndex = -1;
  renderSuggest();
}

// A typed name becomes a project only when you mean it (the "Create" line in the list)
function commitLabel(create) {
  const name = cleanName($('#label').value);
  if (series) series.label = name;
  if (!name) return;
  const key = projKey(name);
  if (projects[key]) { if (projects[key].hidden) { projects[key].hidden = false; delete projects[key].doneAt; } }
  else if (create && !projectList().some(p => p.key === key)) meta(key, name);
  persist();
}
function createTyped() {
  const name = cleanName($('#label').value);
  if (!name) return;
  commitLabel(true);
  sugBefore = name;
  setSuggest(false);
  renderLabelMeta();
  toast(t('projCreated')(name));
  $('#label').blur();
}

function pickSuggest(i) {
  const p = sugItems[i];
  if (!p) return;
  $('#label').value = p.name;
  sugBefore = p.name;
  setSuggest(false);
  commitLabel(true);
  persist();
  renderLabelMeta();
  $('#label').blur();
}

function bindLabelSuggest() {
  const input = $('#label');
  sugBefore = input.value;
  input.addEventListener('focus', () => { sugBefore = input.value; });
  // typing opens the list with the matching projects and the offer to create
  input.addEventListener('input', () => { sugOpen = true; sugIndex = -1; renderSuggest(); });
  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement === input) return;
      setSuggest(false);
      const name = cleanName(input.value), key = projKey(name);
      if (name && !projectList().some(p => p.key === key && !p.hidden)) input.value = sugBefore; // not created: put back
      commitLabel(false);
      persist();
      renderLabelMeta();
    }, 150);
  });
  input.addEventListener('keydown', e => {
    if (!sugOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSuggest(true); }
      else if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      return;
    }
    const typed = !!$('#labelSuggest .sug-create.typed');
    const n = sugItems.length + (typed ? 1 : 0);
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); sugIndex = (sugIndex + 1) % n; renderSuggest(); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); sugIndex = (sugIndex - 1 + n) % n; renderSuggest(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (sugIndex >= 0 && sugIndex < sugItems.length) pickSuggest(sugIndex);
      else if (typed) createTyped(); // the offer is right there: Enter takes it
      else { setSuggest(false); input.blur(); }
    } else if (e.key === 'Escape') { e.preventDefault(); input.value = sugBefore; setSuggest(false); }
  });
  // the chevron opens the whole list
  $('#labelChev').addEventListener('mousedown', e => {
    e.preventDefault();
    if (sugOpen) { setSuggest(false); return; }
    if (document.activeElement !== input && !document.documentElement.classList.contains('android')) input.focus();
    setSuggest(true);
  });
  // (composedPath: the pressed row may already be gone from the page when this runs)
  document.addEventListener('mousedown', e => { if (sugOpen && !e.composedPath().some(n => n.classList && n.classList.contains('label-wrap'))) setSuggest(false); });
  $('#labelSuggest').addEventListener('mousedown', e => {
    e.preventDefault(); // the field keeps the focus
    const c = e.target.closest('.sug-create');
    if (c) {
      if (c.dataset.act === 'create') createTyped();
      else { input.value = ''; input.placeholder = t('newProjPh'); input.focus(); sugOpen = true; renderSuggest(); }
      return;
    }
    const b = e.target.closest('.sug');
    if (b) pickSuggest(Number(b.dataset.i));
  });
  input.addEventListener('blur', () => { input.placeholder = t('labelPh'); });
}

/* ---------- Confirm dialog ---------- */
let modalResolve = null;
function confirmModal(title, text, okLabel, opts = {}) {
  $('#modalTitle').textContent = title;
  $('#modalText').textContent = text;
  $('#modalOk').textContent = okLabel;
  $('#modalOk').classList.toggle('safe', !!opts.safe);
  // "keep going" is the big, inviting button; giving up stays small and quiet
  $('#modalOk').classList.toggle('quiet', !!opts.keepFirst);
  $('#modalCancel').classList.toggle('keep', !!opts.keepFirst);
  $('#modalCancel').textContent = opts.cancel || t('cancel');
  $('#modalCancel').hidden = !!opts.noCancel;
  $('#modal').hidden = false;
  setTimeout(() => (opts.noCancel ? $('#modalOk') : $('#modalCancel')).focus(), 30);
  return new Promise(res => { modalResolve = res; });
}
function closeModal(ok) {
  $('#modal').hidden = true;
  if (modalResolve) { const r = modalResolve; modalResolve = null; r(ok); }
}

/* ---------- Phone: action sheet, alert sound, swipes between tabs ---------- */
let sheetResolve = null;
function actionSheet(title, items) {
  $('#sheetTitle').textContent = title;
  $('#sheetItems').innerHTML = items.map(i =>
    `<button class="sheet-item${i.on ? ' on' : ''}" data-key="${esc(i.key)}">${i.icon || ''}<span>${esc(i.label)}</span></button>`).join('');
  $('#sheet').hidden = false;
  return new Promise(res => { sheetResolve = res; });
}
function closeSheet(key) {
  $('#sheet').hidden = true;
  if (sheetResolve) { const r = sheetResolve; sheetResolve = null; r(key); }
}

const SHEET_ICONS = {
  bell: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  phone: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  file: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17.5V6.2l10-2.2v11.3"/><circle cx="6.6" cy="17.5" r="2.4"/><circle cx="16.6" cy="15.3" r="2.4"/></svg>',
};
async function pickSound() {
  const k = await actionSheet(t('alertSound'), [
    { key: 'default', label: t('soundDefault'), icon: SHEET_ICONS.bell },
    { key: 'system', label: t('soundSystem'), icon: SHEET_ICONS.phone },
    { key: 'file', label: t('soundFile'), icon: SHEET_ICONS.file },
  ]);
  if (!k) return;
  const r = await api.pickSound(k);
  if (!r) return;
  const name = r.name || t('soundDefault');
  $('#soundName').textContent = name;
  toast(t('soundSet')(name));
}

// Phone: the tabs are pages side by side in <main>; the strip follows the finger and settles
// on a page with one transform, so nothing is hidden, redrawn or re-animated on the way.
function pagerTabs() { return $$('.tab').filter(b => b.offsetParent !== null); }
function pagerIndex() { return Math.max(0, pagerTabs().findIndex(b => b.dataset.view === view)); }
function setPager(animate, offset = 0) {
  const main = $('main');
  main.style.transition = animate ? 'transform .4s cubic-bezier(.22, .9, .3, 1)' : 'none';
  main.style.transform = `translate3d(calc(${-pagerIndex() * 100}% + ${offset}px), 0, 0)`;
  drawBlob(pagerIndex() - offset / (main.clientWidth || innerWidth || 1));
}

/* Bouncy tab highlight. The two edges are springs chasing the tab under the finger: the edge
   in front is stiff and overshoots a little, the one behind is soft and catches up late, so
   the drop stretches, squashes and wobbles into place. */
const blob = { l: 0, r: 0, vl: 0, vr: 0, tl: 0, tr: 0, raf: 0, last: 0, ready: false, w0: 80 };
function blobRects() {
  const list = pagerTabs();
  const bar = $('.tabs').getBoundingClientRect();
  return list.map(b => { const r = b.getBoundingClientRect(); return [r.left - bar.left + 4, r.right - bar.left - 4]; });
}
function drawBlob(f) {
  if (!Number.isFinite(f)) f = pagerIndex();
  const el = $('.tab-blob');
  if (!el) return;
  const rects = blobRects(), n = rects.length;
  if (!n) return;
  const fc = Math.max(0, Math.min(n - 1, f));
  const a = Math.min(n - 1, Math.floor(fc)), b = Math.min(n - 1, a + 1), t = fc - a;
  blob.w0 = rects[0][1] - rects[0][0];
  const over = (f - fc) * blob.w0 * 0.3; // pulled past the ends: lean that way
  blob.tl = rects[a][0] + (rects[b][0] - rects[a][0]) * t + over;
  blob.tr = rects[a][1] + (rects[b][1] - rects[a][1]) * t + over;
  if (!blob.ready) { blob.ready = true; blob.l = blob.tl; blob.r = blob.tr; }
  if (!blob.raf) { blob.last = performance.now(); blob.raf = requestAnimationFrame(blobStep); }
}
function animateBlob(to) { drawBlob(to); }
function blobStep(now) {
  const dt = Math.min(0.032, (now - blob.last) / 1000);
  blob.last = now;
  const right = (blob.tl + blob.tr) > (blob.l + blob.r); // moving right: the right edge leads
  const spring = (x, v, target, lead) => {
    const k = lead ? 520 : 210, c = lead ? 24 : 19;
    const acc = k * (target - x) - c * v;
    v += acc * dt;
    return [x + v * dt, v];
  };
  [blob.l, blob.vl] = spring(blob.l, blob.vl, blob.tl, !right);
  [blob.r, blob.vr] = spring(blob.r, blob.vr, blob.tr, right);
  if (blob.r - blob.l < 30) blob.r = blob.l + 30;
  const width = blob.r - blob.l;
  const stretch = width / blob.w0;
  const squash = Math.max(-0.06, Math.min(0.18, (stretch - 1) * 0.16));
  const el = $('.tab-blob');
  el.style.transform = `translate3d(${blob.l.toFixed(2)}px, 0, 0) scale(1, ${(1 - squash).toFixed(3)})`;
  el.style.width = `${width.toFixed(2)}px`;
  // Icons and labels light up as the drop reaches them
  const rects = blobRects(), mid = (blob.l + blob.r) / 2;
  pagerTabs().forEach((tab, k) => {
    const c = (rects[k][0] + rects[k][1]) / 2, w = rects[k][1] - rects[k][0] + 8;
    tab.style.setProperty('--lit', (0.42 + 0.58 * Math.max(0, 1 - Math.abs(mid - c) / w)).toFixed(3));
  });
  const done = Math.abs(blob.tl - blob.l) < 0.3 && Math.abs(blob.tr - blob.r) < 0.3 && Math.abs(blob.vl) < 4 && Math.abs(blob.vr) < 4;
  blob.raf = done ? 0 : requestAnimationFrame(blobStep);
}

function bindSwipe() {
  const main = $('main');
  const el = document.createElement('div');
  el.className = 'tab-blob';
  $('.tabs').prepend(el);
  // Only things that move with the finger themselves keep the gesture
  const noSwipe = '.popover, .suggest, .inline, .modal, .sheet-wrap';
  let x0 = 0, y0 = 0, lastX = 0, lastT = 0, vx = 0, dx = 0, lock = '';
  main.addEventListener('touchstart', e => {
    lock = e.touches.length !== 1 || e.target.closest(noSwipe) ? 'no' : '';
    x0 = lastX = e.touches[0].clientX; y0 = e.touches[0].clientY;
    lastT = performance.now(); vx = 0; dx = 0;
  }, { passive: true });
  main.addEventListener('touchmove', e => {
    if (lock === 'no' || lock === 'y') return;
    const x = e.touches[0].clientX, mx = x - x0, my = e.touches[0].clientY - y0;
    if (!lock) {
      if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (lock === 'y') return;
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    }
    if (e.cancelable) e.preventDefault();
    const now = performance.now();
    vx = (x - lastX) / Math.max(1, now - lastT) * 0.6 + vx * 0.4; // px per ms, smoothed
    lastX = x; lastT = now;
    const i = pagerIndex(), n = pagerTabs().length;
    dx = mx;
    if ((dx > 0 && i === 0) || (dx < 0 && i === n - 1)) dx = mx / 3; // rubber band at the ends
    setPager(false, dx);
  }, { passive: false });
  const end = () => {
    if (lock !== 'x') { lock = ''; return; }
    lock = '';
    const list = pagerTabs(), i = pagerIndex();
    const w = main.clientWidth || innerWidth;
    let target = i;
    if (dx < -w * 0.2 || vx < -0.35) target = i + 1;
    else if (dx > w * 0.2 || vx > 0.35) target = i - 1;
    target = Math.min(list.length - 1, Math.max(0, target));
    if (target !== i) list[target].click(); // the tab handler moves the strip
    else setPager(true);
  };
  main.addEventListener('touchend', end);
  main.addEventListener('touchcancel', end);
  addEventListener('resize', () => { blob.ready = false; setPager(false); });
}

/* Phase lengths: a small wheel. Pull it down to go up (bigger numbers sit above), like
   scrolling a list; it snaps to a step with a little bounce. */
const WHEEL_ROW = 60;
// The window works like a lens: a number grows and brightens as it rolls into the middle.
// Five numbers per wheel, so this is a handful of style writes per frame.
function wheelPlace(d, dy) {
  d._dy = dy;
  const col = d.querySelector('.wheel-col');
  col.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;
  col.querySelectorAll('.wr').forEach((r, i) => {
    const dist = Math.abs((i - 2) * WHEEL_ROW + dy) / WHEEL_ROW; // 0 = in the middle of the lens
    const k = Math.max(0, 1 - dist);
    const lens = k * k * (3 - 2 * k); // smooth bulge
    r.style.transform = `scale(${(0.6 + 0.4 * lens).toFixed(3)})`;
    r.style.opacity = (0.22 + 0.78 * lens).toFixed(3);
  });
}
// Let go: the drum springs back to the step with a small bounce.
// A ratchet click per step, like a fishing reel: a very short burst of noise through a narrow
// band, then the pawl's softer second click. Every click is a little different. Silent when
// sounds are off. One shared noise buffer, two tiny nodes per click.
let tickNoise = null;
function tickSound(dir) {
  if (!settings.sound) return;
  try {
    audioCtx = audioCtx || new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!tickNoise) {
      const n = Math.floor(audioCtx.sampleRate * 0.03);
      tickNoise = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
      const ch = tickNoise.getChannelData(0);
      for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
    }
    const click = (at, freq, level, len) => {
      const src = audioCtx.createBufferSource();
      src.buffer = tickNoise;
      src.playbackRate.value = 0.9 + Math.random() * 0.2;
      const bp = audioCtx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = 2.2;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(level, at + 0.0008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len);
      src.connect(bp).connect(g).connect(audioCtx.destination);
      src.start(at, Math.random() * 0.01, len + 0.005);
    };
    const t0 = audioCtx.currentTime + 0.002;
    const base = (dir > 0 ? 1700 : 1500) * (0.95 + Math.random() * 0.1);
    click(t0, base, 0.42, 0.016);               // a soft, muted tok
    click(t0 + 0.004, base * 0.32, 0.22, 0.024); // and its body
  } catch {}
}
// Let go: a flick keeps the drum turning and slowing down (each step clicks), then it
// springs onto the nearest value with a small bounce.
function wheelSettle(d) {
  cancelAnimationFrame(d._raf);
  const key = d.dataset.key, lim = LIMITS[key];
  let x = d._dy || 0, v = d._v || 0, last = performance.now(), gliding = Math.abs(v) > 220;
  const atEnd = dir => (dir > 0 && settings[key] >= lim.max) || (dir < 0 && settings[key] <= lim.min);
  const step = now => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    if (gliding) {
      x += v * dt;
      v *= Math.exp(-dt * 3.2); // friction
      while (Math.abs(x) > WHEEL_ROW / 2) {
        const dir = x > 0 ? 1 : -1; // pulled down = bigger
        if (atEnd(dir)) { v = 0; break; }
        changeSetting(key, dir);
        tickSound(dir);
        x -= dir * WHEEL_ROW;
      }
      if (Math.abs(v) < 160 || atEnd(v > 0 ? 1 : -1)) { gliding = false; v *= 0.4; }
    } else {
      v += (-340 * x - 15 * v) * dt;
      x += v * dt;
      if (Math.abs(x) < 0.15 && Math.abs(v) < 3) { wheelPlace(d, 0); d._raf = 0; return; }
    }
    wheelPlace(d, x);
    d._raf = requestAnimationFrame(step);
  };
  d._raf = requestAnimationFrame(step);
}
function bindDials() {
  $$('.dial').forEach(d => {
    const key = d.dataset.key;
    let x0 = 0, y0 = 0, base = 0, id = null, lock = '', lastY = 0, lastT = 0;
    d.addEventListener('pointerdown', e => {
      id = e.pointerId; x0 = e.clientX; y0 = lastY = e.clientY; lastT = performance.now(); base = 0; lock = '';
      cancelAnimationFrame(d._raf);
      base = -(d._dy || 0);
    });
    d.addEventListener('pointermove', e => {
      if (e.pointerId !== id) return;
      const mx = e.clientX - x0, my = e.clientY - y0;
      if (!lock) {
        if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
        lock = Math.abs(my) > Math.abs(mx) ? 'y' : 'x';
        if (lock === 'y') { try { d.setPointerCapture(id); } catch {} d.classList.add('drag'); }
      }
      if (lock !== 'y') return; // sideways: that is a page swipe
      const now = performance.now();
      d._v = (e.clientY - lastY) / Math.max(1, now - lastT) * 1000;
      lastY = e.clientY; lastT = now;
      let dy = my - base;
      const lim = LIMITS[key];
      while (Math.abs(dy) > WHEEL_ROW / 2) {
        const dir = dy > 0 ? 1 : -1; // finger down = bigger
        if ((dir > 0 && settings[key] >= lim.max) || (dir < 0 && settings[key] <= lim.min)) break;
        changeSetting(key, dir);
        tickSound(dir);
        base += dir * WHEEL_ROW;
        dy -= dir * WHEEL_ROW;
      }
      const atEnd = (dy > 0 && settings[key] >= lim.max) || (dy < 0 && settings[key] <= lim.min);
      wheelPlace(d, atEnd ? dy / 3 : dy);
    });
    const up = e => {
      if (e.pointerId !== id) return;
      id = null; lock = '';
      d.classList.remove('drag');
      d._v = Math.max(-3200, Math.min(3200, d._v || 0));
      wheelSettle(d);
    };
    d.addEventListener('pointerup', up);
    d.addEventListener('pointercancel', up);
  });
}
function renderDials() {
  $$('.dial').forEach(d => {
    const key = d.dataset.key, lim = LIMITS[key], v = settings[key];
    const col = d.querySelector('.wheel-col');
    if (col.dataset.v !== String(v)) {
      col.dataset.v = v;
      col.innerHTML = [2, 1, 0, -1, -2].map(k => {
        const x = v + k * lim.step;
        return `<span class="wr">${x >= lim.min && x <= lim.max ? (key === 'seriesCount' && x === 0 ? '∞' : x) : ''}</span>`;
      }).join('');
      wheelPlace(d, d._dy || 0);
    }
    d.querySelector('.dial-unit').textContent = key === 'work' ? t('work') : key === 'brk' ? t('break') : t('seriesCountL');
  });
}

// Play and pause drawn as two halves with the same points, so CSS can morph one into the other.
const PLAY_PAUSE_SVG = '<svg class="pp" viewBox="0 0 24 24"><defs><linearGradient id="ppG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8bff"/><stop offset="1" stop-color="#8a5cff"/></linearGradient></defs><path class="pp-a"/><path class="pp-b"/></svg>';

/* ---------- Time picker (PC popover, phone wheels) — one for every place that asks for a time ----------
   askTime(anchor, {h, m}, onPick, {now}) calls onPick({h, m}), or onPick(null) for "Now" when offered. */
let tpState = null;
function askTime(anchor, init, onPick, opts = {}) {
  if (ANDROID) { openTimeSheet(init, onPick, opts); return; }
  if (tpState) { closeTimePicker(); return; }
  openTimePicker(anchor, init, onPick, opts);
}
const roundInit = init => {
  const d = new Date(Date.now() + 15 * 60000);
  return init || { h: d.getHours(), m: (Math.ceil(d.getMinutes() / 5) * 5) % 60 };
};
function openTimePicker(anchor, init, onPick, opts = {}) {
  const i = roundInit(init);
  tpState = { h: i.h, m: i.m - (i.m % 5), onPick, now: !!opts.now, nowLabel: opts.nowLabel, extra: opts.extra, anchor };
  const tp = $('#tp');
  renderTimePicker();
  tp.hidden = false;
  const r = anchor.getBoundingClientRect();
  const w = tp.offsetWidth, h = tp.offsetHeight;
  const x = Math.min(Math.max(10, r.left + r.width / 2 - w / 2), window.innerWidth - w - 10);
  let y = r.bottom + 8;
  if (y + h > window.innerHeight - 10) y = Math.max(10, r.top - h - 8);
  tp.style.left = `${x}px`;
  tp.style.top = `${y}px`;
  tp.querySelectorAll('.tp-c.sel').forEach(b => b.parentElement.scrollTop = b.offsetTop - b.parentElement.clientHeight / 2 + b.offsetHeight / 2);
}
function renderTimePicker() {
  const tp = $('#tp');
  const keep = Array.from(tp.querySelectorAll('.tp-col'), c => c.scrollTop);
  const col = (vals, key, sel) => `<div class="tp-col">${vals.map(v =>
    `<button class="tp-c${v === sel ? ' sel' : ''}" data-${key}="${v}">${pad(v)}</button>`).join('')}</div>`;
  tp.innerHTML = `
    <div class="tp-head">${esc(t('seriesStart'))}</div>
    <div class="tp-cols">${col(Array.from({ length: 24 }, (_, i) => i), 'h', tpState.h)}<span class="tp-sep">:</span>${col(Array.from({ length: 12 }, (_, i) => i * 5), 'm', tpState.m)}</div>
    <div class="cal-foot"><span class="tp-left">${tpState.now ? `<button class="ghost" data-act="now">${esc(tpState.nowLabel || t('seriesNow'))}</button>` : ''}${tpState.extra ? `<button class="ghost tp-extra" data-act="extra">${esc(tpState.extra.label)}</button>` : ''}</span><button class="ghost tp-ok" data-act="ok">${esc(t('done'))}</button></div>`;
  tp.querySelectorAll('.tp-col').forEach((c, i) => { if (keep[i] != null) c.scrollTop = keep[i]; });
}
function closeTimePicker() {
  $('#tp').hidden = true;
  tpState = null;
}
function bindTimePicker() {
  $('#tp').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || !tpState) return;
    if (b.dataset.h != null) { tpState.h = Number(b.dataset.h); renderTimePicker(); return; }
    if (b.dataset.m != null) { tpState.m = Number(b.dataset.m); renderTimePicker(); return; }
    const { onPick, h, m, extra } = tpState;
    closeTimePicker();
    if (b.dataset.act === 'extra' && extra) extra.fn();
    else if (b.dataset.act === 'now') onPick(null);
    else if (b.dataset.act === 'ok') onPick({ h, m });
  });
  document.addEventListener('mousedown', e => {
    if (tpState && !e.target.closest('#tp') && !(tpState.anchor && tpState.anchor.contains(e.target))) closeTimePicker();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tpState) closeTimePicker(); });
}

/* ---------- Phone: the time on two number wheels (hours, minutes) in a bottom sheet ----------
   Native scrolling with snap does the flick and the inertia; we only add the lens and the click. */
const TS_ROW = 52;
let tsOpen = false, tsPick = null, tsExtra = null;
function tsFill(col, values, sel) {
  col.innerHTML = '<div class="ts-pad"></div>' + values.map(v => `<div class="ts-item" data-v="${v}">${pad(v)}</div>`).join('') + '<div class="ts-pad"></div>';
  col.scrollTop = Math.max(0, values.indexOf(sel)) * TS_ROW;
  tsLens(col);
}
function tsValue(col) {
  const items = col.querySelectorAll('.ts-item');
  const i = Math.max(0, Math.min(items.length - 1, Math.round(col.scrollTop / TS_ROW)));
  return Number(items[i].dataset.v);
}
function tsLens(col) {
  const mid = col.scrollTop + col.clientHeight / 2;
  col.querySelectorAll('.ts-item').forEach(it => {
    const c = it.offsetTop + TS_ROW / 2;
    const k = Math.max(0, 1 - Math.abs(c - mid) / (TS_ROW * 1.6));
    it.style.transform = `scale(${(0.66 + 0.34 * k).toFixed(3)})`;
    it.style.opacity = (0.25 + 0.75 * k).toFixed(3);
  });
}
function openTimeSheet(init, onPick, opts = {}) {
  const i = roundInit(init);
  tsPick = onPick;
  tsExtra = opts.extra || null;
  $('#tsNow').hidden = !opts.now;
  $('#tsNow').textContent = opts.nowLabel || t('seriesNow');
  $('#tsExtra').hidden = !tsExtra;
  if (tsExtra) $('#tsExtra').textContent = tsExtra.label;
  $('#timeSheet').hidden = false;
  tsOpen = true;
  tsFill($('#tsH'), Array.from({ length: 24 }, (_, k) => k), i.h);
  tsFill($('#tsM'), Array.from({ length: 12 }, (_, k) => k * 5), i.m - (i.m % 5));
}
function closeTimeSheet() {
  $('#timeSheet').hidden = true;
  tsOpen = false;
}
function bindTimeSheet() {
  ['#tsH', '#tsM'].forEach(sel => {
    const col = $(sel);
    let raf = 0, last = null;
    col.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tsLens(col);
        const v = tsValue(col);
        if (last !== null && v !== last) tickSound(v > last ? 1 : -1);
        last = v;
      });
    }, { passive: true });
  });
  $('#tsOk').addEventListener('click', () => {
    const v = { h: tsValue($('#tsH')), m: tsValue($('#tsM')) };
    closeTimeSheet();
    if (tsPick) tsPick(v);
  });
  $('#tsNow').addEventListener('click', () => { closeTimeSheet(); if (tsPick) tsPick(null); });
  $('#tsExtra').addEventListener('click', () => { closeTimeSheet(); if (tsExtra) tsExtra.fn(); });
  $('#timeSheet').addEventListener('click', e => { if (e.target.id === 'timeSheet') closeTimeSheet(); });
}
/* ---------- One program in detail: open vs active time for a period, day by day ---------- */
let adExe = null, adRange = 7;
function openAppDetail(exe) {
  if (!appStats.some(a => a.exe === exe)) return;
  adExe = exe;
  adRange = APP_RANGES.includes(settings.appsRange) ? settings.appsRange : 1; // opens on the period of the list
  renderAppDetail();
  $('#appDetail').hidden = false;
}
function closeAppDetail() { $('#appDetail').hidden = true; adExe = null; }
function renderAppDetail() {
  const a = appStats.find(x => x.exe === adExe);
  if (!a) { closeAppDetail(); return; }
  $('#adIco').innerHTML = avatar(a.name, a.exe, a.icon);
  $('#adName').textContent = a.name;
  $$('#adRange button').forEach(b => b.classList.toggle('on', Number(b.dataset.r) === adRange));
  const tt = appTimes(a, adRange);
  swapText($('#adActive'), fmtLong(tt.active || 0));
  swapText($('#adOpen'), fmtLong(tt.run || 0));
  let pts, span = '';
  if (adRange === 1) {
    // today in detail: every 10 minutes (fixed scale 0–10 min, so a slot can never look longer than it is);
    // days recorded before 2.19 have hours only (scale 0–60 min)
    const sa = Array.isArray(a.slotsActive) ? a.slotsActive : [], sr = Array.isArray(a.slotsRun) ? a.slotsRun : [];
    const fine = sa.some(v => v > 0);
    const per = fine ? 600 : 3600, n = fine ? 144 : 24;
    const act = fine ? sa : (Array.isArray(a.hoursActive) ? a.hoursActive : []), run = fine ? sr : (Array.isArray(a.hoursRun) ? a.hoursRun : []);
    const now = new Date(), cur = fine ? now.getHours() * 6 + Math.floor(now.getMinutes() / 10) : now.getHours();
    const lab = i => { const m = (i * per) / 60; return `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`; };
    // the axis covers the working part of the day (from an hour before the first activity to now),
    // so ten-minute steps are wide enough to read; at least six hours are shown
    const perH = fine ? 6 : 1;
    const first = act.findIndex((v, i) => i <= cur && ((v || 0) > 0 || (run[i] || 0) > 0));
    let s0 = first < 0 ? 0 : Math.max(0, (Math.floor(first / perH) - 1) * perH);
    if (cur + 1 - s0 < 6 * perH) s0 = Math.max(0, cur + 1 - 6 * perH);
    const total = fine ? Math.max(cur + 1 - s0, 6 * perH) : 24 - s0;
    pts = Array.from({ length: cur + 1 - s0 }, (_, k) => {
      const i = s0 + k;
      return {
        v: Math.min(per, act[i] || 0), w: Math.min(per, run[i] || 0), a: lab(i), b: lab(i + 1),
        tip: `${lab(i)}–${lab(i + 1)} · ${fmtDur(act[i] || 0)}${(run[i] || 0) >= 60 ? ` · ${t('adOpenL')} ${fmtDur(run[i])}` : ''}`,
      };
    });
    const on = pts.map((p, k) => (p.v >= (fine ? 30 : 60) ? k : -1)).filter(k => k >= 0);
    if (on.length) span = t('adSpan')(pts[on[0]].a, pts[on[on.length - 1]].b);
    // time ticks for whatever part is in view: every 10 / 20 / 30 min … 6 h, about six of them
    const labels = (v0, v1) => {
      const m0 = (s0 + v0) * per / 60, m1 = (s0 + v1) * per / 60;
      const step = [10, 20, 30, 60, 120, 180, 240, 360].find(x => (m1 - m0) / x <= 6) || 360;
      const out = [];
      for (let m = Math.ceil(m0 / step) * step; m <= m1; m += step) out.push([m * 60 / per - s0 - 0.5, `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`]);
      return out;
    };
    lineChart($('#adChart'), pts, {
      slots: total, yMax: per, caption: fine ? t('adPerHour') : t('adPerHourH'), labels, key: `${a.exe}|1`, minSpan: fine ? 6 : 2,
      smooth: fine ? 1.1 : 0.6, bands: true, // steady work reads as a plateau; open time as bands and a strip
      // a click takes the whole block of work around it, a drag takes the stretch you marked
      pick: i => addAppBlock(a, pts, i, fine ? 30 : 60),
      pickRange: (i, j) => addAppRange(a, pts, i, j),
    });
  } else {
    // day by day for the period (the last 90 days for "all time")
    const recent = Array.isArray(a.recent) ? a.recent : [];
    const days = recent.slice(adRange === 7 ? -7 : adRange === 30 ? -30 : -90);
    pts = days.map(d => ({ v: d.active || 0, w: d.run || 0, tip: `${dayTitle(parseDay(d.day))} · ${fmtDur(d.active || 0)}${(d.run || 0) >= 60 ? ` · ${t('adOpenL')} ${fmtDur(d.run)}` : ''}` }));
    const n = days.length, labels = [];
    days.forEach((d, i) => {
      const dt = new Date(parseDay(d.day));
      if (n <= 7) labels.push([(i + 0.5) / n, t('daysMon')[(dt.getDay() + 6) % 7].slice(0, 2)]);
      else if (n <= 31 ? (n - 1 - i) % 7 === 0 : dt.getDate() === 1) labels.push([(i + 0.5) / n, n <= 31 ? String(dt.getDate()) : t('monthsShort')[dt.getMonth()]]);
    });
    lineChart($('#adChart'), pts, { slots: n, labels, caption: t('adPerDay'), key: `${a.exe}|${adRange}` });
  }
  $('#adSpan').textContent = span;
}

function niceMax(sec) {
  const m = sec / 60;
  const steps = [15, 30, 60, 120, 180, 240, 360, 480, 600, 720, 960, 1200, 1440, 2400, 3600, 6000];
  return (steps.find(s => s >= m) || Math.ceil(m / 600) * 600) * 60;
}
function smoothPath(xy) {
  // monotone cubic: smooth, but never dips below zero or overshoots a peak
  const n = xy.length;
  if (n === 1) return `M${xy[0][0]} ${xy[0][1]}`;
  const d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((xy[i + 1][1] - xy[i][1]) / (xy[i + 1][0] - xy[i][0]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  let p = `M${xy[0][0].toFixed(2)} ${xy[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = (xy[i + 1][0] - xy[i][0]) / 3;
    p += `C${(xy[i][0] + h).toFixed(2)} ${(xy[i][1] + m[i] * h).toFixed(2)} ${(xy[i + 1][0] - h).toFixed(2)} ${(xy[i + 1][1] - m[i + 1] * h).toFixed(2)} ${xy[i + 1][0].toFixed(2)} ${xy[i + 1][1].toFixed(2)}`;
  }
  return p;
}
// A line chart made to read "when did I work": the active time as a smoothed area (steady work is a
// plateau, not a picket fence), the time the program was open as soft bands behind it, and under it
// a strip — grey where the program was open, coloured where you worked.
//   wheel: a smooth zoom around the pointer · wheel held down (or Shift+wheel, or the slider) moves along
//   hover / touch: the slot · drag: mark a stretch (pickRange) · click: the block around (pick)
// The view survives the refresh every few seconds while the same chart is shown (key). Light: one
// SVG and a few divs, redrawn only when something moves.
function lineChart(el, pts, { slots, labels, yMax, caption, pick, pickRange, key = '', minSpan = 3, smooth = 0, bands = false }) {
  if (el._busy) return; // a drag is going on: the refresh waits
  const W = 300, H = 120;
  // smoothing: a small Gaussian over the neighbours, so ten-minute jitter does not read as spikes
  const sv = smooth > 0 ? pts.map((_, i) => {
    let s = 0, w = 0;
    for (let d = -3; d <= 3; d++) {
      const j = i + d;
      if (j < 0 || j >= pts.length) continue;
      const k = Math.exp(-(d * d) / (2 * smooth * smooth));
      s += pts[j].v * k; w += k;
    }
    return s / w;
  }) : pts.map(p => p.v);
  const max = yMax || niceMax(Math.max(60, ...pts.map(p => Math.max(p.v, p.w))));
  if (el._key !== key || !el._vp) { el._vp = [0, slots]; el._goal = null; }
  el._key = key;
  const clamp = (a, b) => {
    const w = Math.min(slots, Math.max(minSpan, b - a));
    a = Math.max(0, Math.min(slots - w, a));
    return [a, a + w];
  };
  el._vp = clamp(el._vp[0], el._vp[1]);
  el.innerHTML = `
    <div class="lc-zoom"><button class="lc-b" data-z="out" title="−">−</button><button class="lc-b" data-z="in" title="+">+</button><button class="lc-b" data-z="all" title="⟲" hidden>⟲</button></div>
    <div class="lc-plot">
      <span class="lc-y" style="top:0">${fmtMinutes(max / 60)}</span><span class="lc-y" style="top:50%">${fmtMinutes(max / 120)}</span>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lcFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f6bff" stop-opacity=".5"/><stop offset="1" stop-color="#6f6bff" stop-opacity=".04"/></linearGradient>
          <linearGradient id="lcLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f8bff"/><stop offset="1" stop-color="#8a5cff"/></linearGradient>
        </defs>
        <g class="lc-bands"></g>
        <path class="lc-grid" d="M0 0H${W}M0 ${H / 2}H${W}M0 ${H}H${W}"/>
        <path class="lc-run"/><path class="lc-area"/><path class="lc-line"/>
      </svg>
      <i class="lc-sel" hidden></i><i class="lc-guide" hidden></i><i class="lc-dot" hidden></i><div class="lc-tip" hidden></div>
    </div>
    ${bands ? '<div class="lc-strip"></div>' : ''}
    <div class="lc-x"></div>
    <div class="lc-scroll" hidden><i class="lc-thumb"></i></div>
    ${caption ? `<div class="lc-cap">${esc(caption)}${pickRange ? ' <button type="button" class="info-i sm" data-k="adPickHint" aria-label="i">i</button>' : ''}</div>` : ''}`;
  const plot = el.querySelector('.lc-plot'), svg = el.querySelector('svg');
  const guide = el.querySelector('.lc-guide'), dot = el.querySelector('.lc-dot'), tip = el.querySelector('.lc-tip'), sel = el.querySelector('.lc-sel');
  const strip = el.querySelector('.lc-strip'), scroll = el.querySelector('.lc-scroll'), thumb = el.querySelector('.lc-thumb');
  const Y = v => H - (Math.min(v, max) / max) * H;
  const X = i => ((i + 0.5 - el._vp[0]) / (el._vp[1] - el._vp[0])) * W;
  const XL = i => ((i - el._vp[0]) / (el._vp[1] - el._vp[0])) * W; // the left edge of slot i
  // runs of slots where cond holds: [from, to) pairs, for the bands and the strip
  const runs = cond => { const out = []; let a = -1; pts.forEach((p, i) => { if (cond(p, i)) { if (a < 0) a = i; } else if (a >= 0) { out.push([a, i]); a = -1; } }); if (a >= 0) out.push([a, pts.length]); return out; };
  const openRuns = bands ? runs(p => p.w > 0) : [];
  const workRuns = bands ? runs(p => p.v >= Math.max(60, (yMax || max) * 0.25)) : [];
  const draw = () => {
    const [v0, v1] = el._vp;
    const a = Math.max(0, Math.floor(v0) - 4), b = Math.min(pts.length, Math.ceil(v1) + 4);
    const qa = [], qr = [];
    for (let i = a; i < b; i++) { qa.push([X(i), Y(sv[i])]); qr.push([X(i), Y(pts[i].w)]); }
    const area = (line, q) => (q.length ? `${line}L${q[q.length - 1][0].toFixed(2)} ${H}L${q[0][0].toFixed(2)} ${H}Z` : '');
    const la = qa.length ? smoothPath(qa) : '';
    svg.querySelector('.lc-run').setAttribute('d', bands || !qr.length ? '' : area(smoothPath(qr), qr));
    svg.querySelector('.lc-area').setAttribute('d', area(la, qa));
    svg.querySelector('.lc-line').setAttribute('d', la);
    if (bands) {
      svg.querySelector('.lc-bands').innerHTML = openRuns.map(([s, e]) => `<rect x="${XL(s).toFixed(2)}" y="0" width="${(XL(e) - XL(s)).toFixed(2)}" height="${H}"/>`).join('');
      const pct = i => ((i - v0) / (v1 - v0)) * 100;
      strip.innerHTML = openRuns.map(([s, e]) => `<i class="o" style="left:${pct(s).toFixed(2)}%;width:${(pct(e) - pct(s)).toFixed(2)}%"></i>`).join('')
        + workRuns.map(([s, e]) => `<i class="w" style="left:${pct(s).toFixed(2)}%;width:${(pct(e) - pct(s)).toFixed(2)}%"></i>`).join('');
    }
    const lab = typeof labels === 'function' ? labels(v0, v1) : labels.map(([f, s]) => [f * slots - 0.5, s]);
    el.querySelector('.lc-x').innerHTML = lab.filter(([s]) => s + 0.5 >= v0 && s + 0.5 <= v1)
      .map(([s, txt]) => `<span style="left:${(((s + 0.5 - v0) / (v1 - v0)) * 100).toFixed(2)}%">${esc(txt)}</span>`).join('');
    const zoomed = v1 - v0 < slots - 0.01;
    scroll.hidden = !zoomed;
    thumb.style.left = `${(v0 / slots) * 100}%`;
    thumb.style.width = `${((v1 - v0) / slots) * 100}%`;
    el.querySelector('[data-z="all"]').hidden = !zoomed;
    el.querySelector('[data-z="in"]').disabled = v1 - v0 <= minSpan + 0.01;
    el.querySelector('[data-z="out"]').disabled = !zoomed;
  };
  // the view glides to where it is asked to go (a few frames, then it stops: nothing runs at rest)
  const goTo = (vp, now) => {
    el._goal = clamp(vp[0], vp[1]);
    if (now) { el._vp = el._goal; el._goal = null; draw(); return; }
    if (el._anim) return;
    const step = () => {
      const g = el._goal;
      if (!g) { el._anim = 0; return; }
      const [a, b] = el._vp, k = 0.28;
      const na = a + (g[0] - a) * k, nb = b + (g[1] - b) * k;
      if (Math.abs(na - g[0]) < 0.01 && Math.abs(nb - g[1]) < 0.01) { el._vp = g; el._goal = null; el._anim = 0; draw(); return; }
      el._vp = [na, nb];
      draw();
      el._anim = requestAnimationFrame(step);
    };
    el._anim = requestAnimationFrame(step);
  };
  const cur = () => el._goal || el._vp;
  const zoom = (k, at) => {
    const [v0, v1] = cur(), w = v1 - v0, c = at == null ? v0 + w / 2 : at;
    const nw = Math.min(slots, Math.max(minSpan, w * k));
    const n0 = c - (c - v0) * (nw / w);
    goTo([n0, n0 + nw]);
  };
  const panBy = d => { const [v0, v1] = cur(); goTo([v0 + d, v1 + d]); };
  const slotAt = e => { const r = plot.getBoundingClientRect(); return el._vp[0] + ((e.clientX - r.left) / r.width) * (el._vp[1] - el._vp[0]); };
  const idx = e => Math.max(0, Math.min(pts.length - 1, Math.floor(slotAt(e))));
  const pctOf = i => ((i - el._vp[0]) / (el._vp[1] - el._vp[0])) * 100;
  const show = e => {
    if (!pts.length) return;
    const i = idx(e), r = plot.getBoundingClientRect();
    const x = (X(i) / W) * 100, y = (Y(sv[i]) / H) * 100;
    guide.hidden = dot.hidden = tip.hidden = false;
    guide.style.left = dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    tip.textContent = pts[i].tip;
    const tw = tip.offsetWidth, px = (x / 100) * r.width;
    tip.style.left = `${Math.min(Math.max(0, px - tw / 2), r.width - tw)}px`;
  };
  const hide = () => { guide.hidden = dot.hidden = tip.hidden = true; };
  let drag = null, pan = null;
  plot.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); }); // no autoscroll on the middle button
  plot.addEventListener('pointerdown', e => {
    if (!pts.length) return;
    if (e.button === 1) { // the wheel held down: move along
      pan = { x: e.clientX, vp: [...el._vp], id: e.pointerId, w: plot.getBoundingClientRect().width };
      try { plot.setPointerCapture(e.pointerId); } catch {}
      plot.classList.add('panning');
      el._busy = true;
      return;
    }
    if (e.button !== 0) return;
    drag = { x: e.clientX, i: idx(e), moved: false, id: e.pointerId };
    el._busy = true;
    show(e);
  });
  plot.addEventListener('pointermove', e => {
    if (pan && e.pointerId === pan.id) {
      const span = pan.vp[1] - pan.vp[0], d = -((e.clientX - pan.x) / pan.w) * span;
      goTo([pan.vp[0] + d, pan.vp[1] + d], true);
      return;
    }
    show(e);
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x) < 5) return;
    if (!drag.moved) { drag.moved = true; try { plot.setPointerCapture(drag.id); } catch {} }
    const i = idx(e), a = Math.min(drag.i, i), b = Math.max(drag.i, i);
    sel.hidden = false;
    sel.style.left = `${Math.max(0, pctOf(a))}%`;
    sel.style.width = `${Math.min(100, pctOf(b + 1)) - Math.max(0, pctOf(a))}%`;
  });
  const up = e => {
    if (pan && e.pointerId === pan.id) { pan = null; el._busy = false; plot.classList.remove('panning'); return; }
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    el._busy = false;
    const i = idx(e);
    if (d.moved && pickRange) pickRange(Math.min(d.i, i), Math.max(d.i, i)).finally(() => { sel.hidden = true; });
    else { sel.hidden = true; if (!d.moved && pick) pick(i); }
  };
  plot.addEventListener('pointerup', up);
  plot.addEventListener('pointercancel', e => { drag = null; pan = null; el._busy = false; sel.hidden = true; plot.classList.remove('panning'); void e; });
  plot.addEventListener('pointerleave', () => { if (!drag && !pan) hide(); });
  plot.addEventListener('wheel', e => {
    e.preventDefault();
    const [v0, v1] = cur();
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) panBy(((e.shiftKey ? e.deltaY : e.deltaX) > 0 ? 1 : -1) * (v1 - v0) * 0.2);
    else zoom(Math.pow(1.0015, e.deltaY), slotAt(e)); // follows the wheel (or a touchpad) in small steps
    show(e);
  }, { passive: false });
  // the slider under a zoomed chart: drag the thumb, or click the track to jump there
  let sdrag = null;
  thumb.addEventListener('pointerdown', e => { e.stopPropagation(); sdrag = { x: e.clientX, vp: [...el._vp], w: scroll.getBoundingClientRect().width, id: e.pointerId }; try { thumb.setPointerCapture(e.pointerId); } catch {} el._busy = true; });
  thumb.addEventListener('pointermove', e => { if (!sdrag || e.pointerId !== sdrag.id) return; const d = ((e.clientX - sdrag.x) / sdrag.w) * slots; goTo([sdrag.vp[0] + d, sdrag.vp[1] + d], true); });
  const sup = e => { if (sdrag && e.pointerId === sdrag.id) { sdrag = null; el._busy = false; } };
  thumb.addEventListener('pointerup', sup);
  thumb.addEventListener('pointercancel', sup);
  scroll.addEventListener('pointerdown', e => {
    if (e.target === thumb) return;
    const r = scroll.getBoundingClientRect(), c = ((e.clientX - r.left) / r.width) * slots, [v0, v1] = cur(), w = v1 - v0;
    goTo([c - w / 2, c + w / 2]);
  });
  el.querySelectorAll('.lc-b').forEach(b => b.addEventListener('click', () => {
    const z = b.dataset.z;
    if (z === 'in') zoom(0.6); else if (z === 'out') zoom(1 / 0.6); else goTo([0, slots]);
  }));
  draw();
}
// A stretch marked on today's chart: its active time goes into the history if you agree
async function addAppRange(a, pts, i, j) {
  const part = pts.slice(i, j + 1);
  const dur = part.reduce((x, p) => x + p.v, 0);
  if (dur < 60) { toast(t('adNothing')); return; }
  const ok = await confirmModal(a.name, t('adAddQ')(fmtDur(dur), pts[i].a, pts[j].b), t('adToHist'), { safe: true });
  if (!ok) return;
  const [h0, m0] = pts[i].a.split(':').map(Number);
  const d = new Date(); d.setHours(h0, m0, 0, 0);
  const start = d.getTime();
  sessions.push({ id: newId(), start, end: start + dur * 1000, dur, label: cleanName($('#label').value), full: false, manual: true });
  sessions.sort((x, y) => x.start - y.start);
  persistNow();
  render();
  toast(t('adAdded')(fmtDur(dur)));
}
// Forgot the timer? A click on today's chart takes the block of work around that point (neighbouring
// slots with activity) and, if you agree, adds it to the history under the current task.
async function addAppBlock(a, pts, i, minSec) {
  if (!pts[i] || pts[i].v < minSec) return;
  let s = i, e = i;
  while (s > 0 && pts[s - 1].v >= minSec) s--;
  while (e < pts.length - 1 && pts[e + 1].v >= minSec) e++;
  const dur = pts.slice(s, e + 1).reduce((x, p) => x + p.v, 0);
  if (dur < 60) return;
  const ok = await confirmModal(a.name, t('adAddQ')(fmtDur(dur), pts[s].a, pts[e].b), t('adToHist'), { safe: true });
  if (!ok) return;
  const [h0, m0] = pts[s].a.split(':').map(Number);
  const d = new Date(); d.setHours(h0, m0, 0, 0);
  const start = d.getTime();
  sessions.push({ id: newId(), start, end: start + dur * 1000, dur, label: cleanName($('#label').value), full: false, manual: true });
  sessions.sort((x, y) => x.start - y.start);
  persistNow();
  render();
  toast(t('adAdded')(fmtDur(dur)));
}
function bindAppDetail() {
  $('#appDetail').addEventListener('click', e => {
    if (e.target.id === 'appDetail' || e.target.closest('#adClose')) { closeAppDetail(); return; }
    if (e.target.closest('#adUntrack') && adExe) {
      const exe = adExe;
      closeAppDetail();
      api.appsUntrack(exe).then(list => { appStats = list || appStats; renderApps(); });
      return;
    }
    const r = e.target.closest('#adRange button');
    if (r) { adRange = Number(r.dataset.r); renderAppDetail(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && adExe) closeAppDetail(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && scId) closeSeriesCard(); });
}

/* ---------- History: the last few things done (a series counts as one), full list in a card ---------- */
// Sessions newest first; the sessions of one series fold into a single entry.
function historyItems(list) {
  const out = [];
  for (const s of list) {
    const last = out[out.length - 1];
    if (s.series && last && last.series === s.series) {
      last.n++;
      last.start = Math.min(last.start, s.start);
      last.dur += s.dur;
      last.ids.push(s.id);
      if (!last.label && s.label) last.label = s.label;
    } else out.push({ ids: [s.id], series: s.series || '', n: 1, start: s.start, end: s.end, dur: s.dur, label: s.label || '', manual: !!s.manual });
  }
  return out;
}
function renderHistoryShort() {
  const box = $('#history');
  const items = historyItems([...sessions].sort((a, b) => b.start - a.start)).slice(0, 3);
  $('#btnHistAll').style.display = sessions.length ? '' : 'none';
  if (!items.length) { setHTML(box, `<div class="empty-state">${t('noData')}</div>`); renderSeriesCard(); return; }
  // rows keep their elements when the list refreshes (no replayed entrance), a quiet × at the side.
  // The task name gets the whole title line; a series says how many sessions in the line below
  // and opens as a card.
  setHTML(box, items.map(g => {
    const day = startOfDay(g.start) === startOfDay() ? '' : `${dayTitle(g.start)} · `;
    const title = g.label ? esc(g.label) : `<span class="muted">${t('noLabel')}</span>`;
    const n = g.n > 1 ? `<span class="hs-n">${esc(t('seriesN')(g.n))}</span>` : '';
    return `<div class="hs${g.n > 1 ? ' series' : ''}" data-id="${esc(g.ids.join(','))}"${g.n > 1 ? ` data-series="${esc(g.series)}"` : ''}>
      <span class="hs-ico">${g.n > 1 ? ICONS.repeat : ICONS.dot}</span>
      <span class="hs-main"><span class="hs-title">${title}</span><span class="hs-sub">${n}${g.manual ? `${day}${t('atManual')}` : `${day}${hm(g.start)}–${hm(g.end)}`}</span></span>
      <span class="hs-dur">${fmtDur(g.dur)}</span>
      <button class="hs-del" title="${esc(t('delete'))}">${ICONS.x}</button>
    </div>`;
  }).join(''));
  renderSeriesCard();
}

/* A series opens as a card: every session on its own line, each with its own × */
let scId = null;
function openSeriesCard(id) {
  scId = id;
  $('#seriesCard').hidden = false;
  renderSeriesCard();
}
function closeSeriesCard() { $('#seriesCard').hidden = true; scId = null; }
function renderSeriesCard() {
  if (!scId || $('#seriesCard').hidden) return;
  const parts = sessions.filter(s => s.series === scId).sort((a, b) => a.start - b.start);
  if (!parts.length) { closeSeriesCard(); return; }
  const first = parts[0], last = parts[parts.length - 1];
  const label = (parts.find(s => s.label) || {}).label || '';
  const total = parts.reduce((a, s) => a + s.dur, 0);
  $('#scName').innerHTML = label ? esc(label) : `<span class="muted">${esc(t('noLabel'))}</span>`;
  $('#scTask').innerHTML = `<span>${esc(t('scTaskL'))}:</span> <b>${esc(label || t('noLabel'))}</b> <svg viewBox="0 0 24 24"><path d="M15.5 4.5l4 4L9 19H5v-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  $('#scSub').textContent = `${dayTitle(first.start)} · ${hm(first.start)}–${hm(last.end)}`;
  $('#scTotal').textContent = fmtDur(total);
  $('#scCount').textContent = t('seriesN')(parts.length);
  setHTML($('#scList'), parts.map((s, i) => `<div class="sc-row" data-id="${esc(s.id)}">
      <span class="hs-num">${i + 1}</span>
      <span class="sc-time">${hm(s.start)}–${hm(s.end)}</span>
      <span class="sc-dur">${fmtDur(s.dur)}</span>
      <button class="hs-del" title="${esc(t('delete'))}">${ICONS.x}</button>
    </div>`).join(''));
}
// Deleting from the short list: gone at once, with an Undo in the toast
function deleteEntries(ids) {
  const set = new Set(ids);
  const removed = sessions.filter(s => set.has(s.id));
  if (!removed.length) return;
  sessions = sessions.filter(s => !set.has(s.id));
  persistNow();
  renderStats();
  renderTimer();
  toast(t('deleted'), t('undo'), () => {
    sessions = [...sessions, ...removed].sort((a, b) => a.start - b.start);
    persistNow();
    renderStats();
    renderTimer();
  });
}
function openHistory() {
  historyLimit = 7;
  $('#histAll').hidden = false;
  renderHistory();
}
function closeHistory() { $('#histAll').hidden = true; }

/* ================= Plan: the timer starts by itself at the times you set =================
   A plan is a start time with a number of sessions, either for one date or for days of the week.
   Plans live in the synced settings (settings.plans, a map by id; "v" keeps it from ever being
   empty in the cloud), so every device knows them.
   Starting is a matter of arithmetic, not of an event: a series is a schedule, so whichever device
   is awake at (or after) the planned time starts the series *from the planned time*. Opened twenty
   minutes late, twenty minutes have already passed. Every device builds the same series id for a
   plan's day, so two devices never make two series. A whole block that went by while every device
   was off is not counted silently: the app asks. The PC wakes itself for the start (phase-due), the
   phone gets an alarm through the host (state.plan). */
const PLAN_ENDLESS_MS = 3 * 3600000; // an endless plan opened later than this is not started backwards
const planList = () => Object.values(settings.plans || {}).filter(p => p && typeof p === 'object' && p.id && /^\d\d:\d\d$/.test(p.time || ''))
  .sort((a, b) => a.time.localeCompare(b.time));
const planDow = key => new Date(parseDay(key)).getDay(); // 0 = Sunday
// a day can be skipped once (p.skip), without touching the mark of what was already handled (p.last)
const planOn = (p, key) => (p.date ? p.date === key : Array.isArray(p.days) && p.days.includes(planDow(key)));
const planOccurs = (p, key) => p.on !== false && planOn(p, key) && !(p.skip || []).includes(key);
function skipDay(p, key, on) {
  const today = dayKey(Date.now());
  const s = (p.skip || []).filter(k => k >= today && k !== key);
  p.skip = on ? [...s, key] : s;
}
function planStart(p, key) {
  const [h, m] = p.time.split(':').map(Number);
  const d = new Date(parseDay(key));
  d.setHours(h, m, 0, 0);
  return d.getTime();
}
const planWork = p => (p.work || settings.work) * 60000, planBrk = p => (p.brk || settings.brk) * 60000;
const planCount = p => (Number(p.count) >= 0 ? Number(p.count) : 2);
const planBlock = p => (planCount(p) > 0 ? seriesWorkStart({ start: 0, work: planWork(p), brk: planBrk(p), ...longOf() }, planCount(p) - 1) + planWork(p) : PLAN_ENDLESS_MS);
const planSeriesId = (p, key) => `plan-${p.id}-${key}`;
// when a plan ends (0 = no end): the app works it out, so the plan reads "07:30–09:20"
const planEndAt = (p, at) => (planCount(p) > 0 ? at + planBlock(p) : 0);
function planRange(p, at = planStart(p, dayKey(Date.now()))) {
  const end = planEndAt(p, at);
  return end ? `${hm(at)}–${hm(end)}` : `${hm(at)} →`;
}
function savePlans() {
  settings.plans = settings.plans || {};
  settings.plans.v = 1;
  persist();
}
function putPlan(p) {
  settings.plans = { v: 1, ...(settings.plans || {}), [p.id]: p };
  persist();
  renderPlans();
  render();
}
function dropPlan(id) {
  if (!settings.plans) return;
  delete settings.plans[id];
  savePlans();
  renderPlans();
  render();
}
// The next start still ahead, over the coming week
function nextPlan(now = Date.now()) {
  let best = null;
  for (let d = 0; d < 8; d++) {
    const key = dayKey(addDays(startOfDay(now), d));
    for (const p of planList()) {
      if (!planOccurs(p, key) || p.last === key) continue;
      const at = planStart(p, key);
      if (at > now && (!best || at < best.at)) best = { p, key, at };
    }
  }
  return best;
}
function planWhenText(n) {
  const day = startOfDay(n.at) === startOfDay() ? '' : startOfDay(n.at) === addDays(startOfDay(), 1) ? `${t('tomorrowL')} ` : `${dayTitle(n.at)}, `;
  return `${day}${t('atTime')(hm(n.at))}`;
}
const planCountText = p => (planCount(p) > 0 ? t('seriesN')(planCount(p)) : t('endlessL'));

// Called from tick (about every 2 s), at start and after sync: starts what is due
let planChecked = 0, planArmed = 0, planArmedSent = 0, planAsked = false;
function planTick(force) {
  const now = Date.now();
  if (!force && now - planChecked < 2000) return;
  planChecked = now;
  const today = dayKey(now);
  let changed = false;
  const missed = [];
  for (const p of planList()) {
    if (!planOccurs(p, today) || p.last === today) continue;
    const at = planStart(p, today);
    if (at > now) continue;
    const id = planSeriesId(p, today);
    p.last = today;
    changed = true;
    if (series && series.id === id) continue; // another device started it already
    if (now < at + planBlock(p)) {
      const idle = !series && isUntouched() && timer.phase === 'work';
      if (!idle) { toast(t('planBusy')(p.time)); continue; } // the timer is in use: never cut into it
      startPlan(p, at, id, now - at < 90000);
    } else if (planCount(p) > 0) missed.push({ p, at, id });
    if (p.date) delete settings.plans[p.id]; // a one-off plan has done its job
  }
  if (changed) { savePlans(); renderPlans(); }
  if (missed.length && !planAsked) askMissed(missed);
  armPlan();
}
function startPlan(p, at, id, fresh) {
  // the plan's task, or none yet: yesterday's text in the field is not a guess worth keeping (the app will ask)
  $('#label').value = p.label || '';
  if (p.label) commitLabel(true);
  series = { id, start: at, count: planCount(p), work: planWork(p), brk: planBrk(p), ...longOf(), logged: 0, pausedAt: 0, label: p.label || '' };
  seriesPos = '';
  api.closeAlert();
  applySeries(true);
  persist();
  render();
  if (fresh) {
    api.showAlert({
      next: 'work', title: t('planGoTitle'), body: t('planGoBody')(planCountText(p), p.label || ''),
      goLabel: '', okLabel: t('gotIt'), hideGo: true, sound: settings.sound, repeatSec: 15,
      theme: effectiveTheme(), lang: settings.lang,
    });
  } else toast(t('planLate')(p.time));
}
// A planned block passed while no device was on: count it only if you say so
async function askMissed(list) {
  planAsked = true;
  for (const { p, at, id } of list) {
    const n = planCount(p);
    const ok = await confirmModal(t('planMissedQ'), t('planMissedText')(p.time, planCountText(p), fmtDur(n * planWork(p) / 1000)), t('planMissedYes'), { safe: true, cancel: t('planMissedNo') });
    if (!ok) continue;
    for (let k = 0; k < n; k++) {
      const start = seriesWorkStart({ start: at, work: planWork(p), brk: planBrk(p), ...longOf() }, k);
      const one = { start, end: start + planWork(p), dur: Math.round(planWork(p) / 1000), label: p.label || '', full: true, series: id };
      if (!sessions.some(x => sessionKey(x) === sessionKey(one))) sessions.push({ id: newId(), ...one });
    }
    sessions.sort((a, b) => a.start - b.start);
    persistNow();
    render();
  }
  planAsked = false;
}
// Wake-ups for the next start while the timer is idle: the PC host (phase-due) and the phone alarm
function armPlan() {
  if (ANDROID) return; // the phone gets it with the timer state (syncHost → state.plan)
  const idle = !series && !timer.running;
  const n = idle ? nextPlan() : null;
  const at = n ? n.at : 0;
  if (at === planArmed && Date.now() - planArmedSent < 60000) return; // re-sent each minute: a timer may have reset the wake-up
  planArmed = at;
  planArmedSent = Date.now();
  if (idle && api.schedule) api.schedule(at ? Math.max(0, at - Date.now()) : 0);
}
function hostPlan() {
  if (series || timer.running) return null;
  const n = nextPlan();
  if (!n) return null;
  const p = n.p;
  return {
    at: n.at, title: t('planGoTitle'), body: t('planGoBody')(planCountText(p), p.label || ''),
    series: { id: planSeriesId(p, n.key), start: n.at, count: planCount(p), work: planWork(p), brk: planBrk(p), ...longOf(), logged: 0, pausedAt: 0, label: p.label || '' },
  };
}

/* ---------- The Plan tab ---------- */
const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
function daysText(p) {
  if (p.date) return p.date === dayKey(Date.now()) ? t('today') : p.date === dayKey(addDays(startOfDay(), 1)) ? t('tomorrowL') : fmtDate(p.date);
  const d = (p.days || []).slice().sort((a, b) => DOW_ORDER.indexOf(a) - DOW_ORDER.indexOf(b));
  if (d.length === 7) return t('everyDay');
  if (d.length === 5 && !d.includes(0) && !d.includes(6)) return t('weekdays');
  if (d.length === 2 && d.includes(0) && d.includes(6)) return t('weekends');
  // runs of days in a row read as a range, like an alarm clock: "Mon–Thu", "Mon–Wed, Sat"
  const pos = d.map(x => DOW_ORDER.indexOf(x)), name = i => t('daysMon')[i];
  const parts = [];
  for (let i = 0; i < pos.length;) {
    let j = i;
    while (j + 1 < pos.length && pos[j + 1] === pos[j] + 1) j++;
    parts.push(j - i >= 2 ? `${name(pos[i])}–${name(pos[j])}` : pos.slice(i, j + 1).map(name).join(', '));
    i = j + 1;
  }
  return parts.join(', ');
}
// the next start of one plan (null when there is none in the coming week)
function nextOf(p, now = Date.now()) {
  for (let d = 0; d < 8; d++) {
    const key = dayKey(addDays(startOfDay(now), d));
    if (!planOccurs(p, key) || p.last === key) continue;
    const at = planStart(p, key);
    if (at > now) return { p, key, at };
  }
  return null;
}
function skipWord(key) {
  const d = startOfDay(parseDay(key));
  return d === startOfDay() ? t('skipToday') : d === addDays(startOfDay(), 1) ? t('skipTomorrow') : t('skipDay')(t('daysMon')[(new Date(d).getDay() + 6) % 7]);
}
function renderPlans() {
  const box = $('#planList');
  if (!box) return;
  const list = planList();
  const n = nextPlan();
  const today = dayKey(Date.now());
  $('#planNext').innerHTML = n ? `${esc(t('planNextL'))} <b>${esc(planWhenText(n))}–${planEndAt(n.p, n.at) ? hm(planEndAt(n.p, n.at)) : '…'}</b>` : esc(t('planNone'));
  // a card: "07:21 —— 09:11", the days (and task) under it, and one quiet "skip today"
  setHTML(box, list.length ? list.map(p => {
    const st = planStart(p, today), end = planEndAt(p, st);
    const nx = p.on === false ? null : nextOf(p);
    const skippedToday = p.on !== false && !p.date && (p.skip || []).includes(today) && planOn(p, today) && planStart(p, today) > Date.now();
    const act = skippedToday ? `<button class="plan-skip" data-act="unskip">${esc(t('skippedToday'))}</button>`
      : nx ? `<button class="plan-skip" data-act="skip" data-k="${nx.key}">${esc(skipWord(nx.key))}</button>` : '';
    return `<div class="plan${p.on === false ? ' off' : ''}" data-key="${esc(p.id)}">
      <div class="plan-span"><span class="pt">${esc(p.time)}</span><i class="plan-line"></i><span class="pt${end ? '' : ' inf'}">${end ? hm(end) : '∞'}</span></div>
      <button class="toggle${p.on === false ? '' : ' on'}" data-act="onoff" title="${esc(t('planOnOff'))}"></button>
      <div class="plan-info"><span class="plan-days">${esc(daysText(p))}</span>${p.label ? ` · ${esc(p.label)}` : ''}</div>
      <div class="plan-act">${act}</div>
    </div>`;
  }).join('') : `<div class="empty-state">${t('planEmpty')}</div>`);
}

let peState = null; // the plan being edited
function openPlanEdit(p) {
  const d = new Date(Date.now() + 3600000);
  peState = p ? JSON.parse(JSON.stringify(p)) : {
    id: newId(), time: `${pad(d.getHours())}:00`, days: [1, 2, 3, 4, 5], date: '', count: settings.seriesCount > 0 ? settings.seriesCount : 2,
    work: settings.work, brk: settings.brk, label: $('#label').value.trim(), on: true,
  };
  peState.isNew = !p;
  peState.mode = peState.date ? 'once' : (Array.isArray(peState.days) && peState.days.length === 7 ? 'daily' : 'days');
  if (!peState.date) peState.date = dayKey(addDays(startOfDay(), 1));
  if (!Array.isArray(peState.days) || !peState.days.length) peState.days = [1, 2, 3, 4, 5];
  $('#peProject').value = peState.label || '';
  renderPlanEdit();
  $('#planEdit').hidden = false;
}
function closePlanEdit() { $('#planEdit').hidden = true; peState = null; closeCalendar(); closeTimePicker(); }
function renderPlanEdit() {
  const s = peState;
  $('#peTitle').textContent = s.isNew ? t('planNew') : t('planEditT');
  $('#peTime').textContent = s.time;
  const st = planStart({ time: s.time }, dayKey(Date.now()));
  $('#peSpan').textContent = planEndAt(s, st) ? `${planRange(s, st)} · ${t('planTotal')(fmtDur(planBlock(s) / 1000))}` : `${planRange(s, st)} ${t('endlessL')}`;
  $$('#peRepeat button').forEach(b => b.classList.toggle('on', b.dataset.v === s.mode));
  $('#peDaysRow').hidden = s.mode !== 'days';
  $('#peDateRow').hidden = s.mode !== 'once';
  $('#peDays').innerHTML = DOW_ORDER.map(x => `<button type="button" class="pe-day${s.days.includes(x) ? ' on' : ''}" data-d="${x}">${esc(t('daysMon')[(x + 6) % 7])}</button>`).join('');
  $('#peDate span').textContent = s.date === dayKey(Date.now()) ? t('today') : s.date === dayKey(addDays(startOfDay(), 1)) ? t('tomorrowL') : fmtDate(s.date);
  $('#peCount').textContent = planCountText(s);
  $('#peWork').textContent = `${s.work} ${t('min')}`;
  $('#peBrk').textContent = `${s.brk} ${t('min')}`;
  $('#peBrkRow').hidden = planCount(s) === 1;
  $('#peDelete').hidden = s.isNew;
  const recent = projectList().filter(p => !p.hidden).slice(0, 6);
  const cur = projKey($('#peProject').value);
  $('#peChips').innerHTML = recent.map(p => `<button type="button" class="at-chip${p.key === cur ? ' on' : ''}" data-name="${esc(p.name)}">${esc(p.name)}</button>`).join('');
  $('#peSave').disabled = s.mode === 'days' && !s.days.length;
}
function savePlanEdit() {
  const s = peState;
  const p = { id: s.id, time: s.time, count: planCount(s), work: s.work, brk: s.brk, label: cleanName($('#peProject').value), on: s.on !== false };
  if (s.mode === 'once') { p.date = s.date; p.days = []; } else { p.days = s.mode === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : s.days.slice().sort(); p.date = ''; }
  // a time that has already passed today does not start backwards right after saving
  const today = dayKey(Date.now());
  if (planOccurs(p, today) && planStart(p, today) <= Date.now()) p.last = today;
  else if (s.last && s.last !== today) p.last = s.last;
  closePlanEdit();
  putPlan(p);
  const n = nextPlan();
  if (n && n.p.id === p.id) toast(t('planSaved')(planWhenText(n)));
}
function bindPlans() {
  $('#btnPlanAdd').addEventListener('click', () => openPlanEdit(null));
  $('#planList').addEventListener('click', e => {
    const row = e.target.closest('.plan');
    if (!row) return;
    const p = (settings.plans || {})[row.dataset.key];
    if (!p) return;
    if (e.target.closest('[data-act="onoff"]')) { p.on = p.on === false; savePlans(); renderPlans(); render(); return; }
    const sk = e.target.closest('[data-act="skip"]');
    if (sk) { if (p.date) dropPlan(p.id); else { skipDay(p, sk.dataset.k, true); savePlans(); renderPlans(); render(); } return; }
    if (e.target.closest('[data-act="unskip"]')) { skipDay(p, dayKey(Date.now()), false); savePlans(); renderPlans(); render(); return; }
    openPlanEdit(p);
  });
  const step = (k, d) => {
    const s = peState;
    if (k === 'count') { const v = planCount(s) + d; s.count = v < 0 ? 12 : v > 12 ? 0 : v; }
    if (k === 'work') s.work = Math.min(180, Math.max(5, s.work + d * 5));
    if (k === 'brk') s.brk = Math.min(60, Math.max(5, s.brk + d * 5));
    renderPlanEdit();
  };
  $('#planEdit').addEventListener('click', e => {
    if (e.target.id === 'planEdit') { closePlanEdit(); return; }
    const b = e.target.closest('button');
    if (!b || !peState) return;
    if (b.dataset.step) step(b.dataset.step, Number(b.dataset.d));
    else if (b.closest('#peRepeat')) { peState.mode = b.dataset.v; if (peState.mode === 'days' && peState.days.length === 7) peState.days = [1, 2, 3, 4, 5]; renderPlanEdit(); }
    else if (b.dataset.d != null && b.classList.contains('pe-day')) {
      const x = Number(b.dataset.d);
      peState.days = peState.days.includes(x) ? peState.days.filter(y => y !== x) : [...peState.days, x];
      renderPlanEdit();
    } else if (b.id === 'peTime') {
      const [h, m] = peState.time.split(':').map(Number);
      askTime(b, { h, m }, v => { if (v && peState) { peState.time = `${pad(v.h)}:${pad(v.m)}`; renderPlanEdit(); } });
    } else if (b.id === 'peDate') {
      openCalendar(b, peState.date, v => {
        const today = dayKey(Date.now());
        if (peState) { peState.date = v && v >= today ? v : today; renderPlanEdit(); }
      });
    } else if (b.classList.contains('at-chip')) { $('#peProject').value = b.dataset.name; renderPlanEdit(); }
    else if (b.id === 'peCancel') closePlanEdit();
    else if (b.id === 'peDelete') { const id = peState.id; closePlanEdit(); dropPlan(id); }
  });
  $('#peProject').addEventListener('input', () => { if (peState) renderPlanEdit(); });
  $('#peForm').addEventListener('submit', e => { e.preventDefault(); if (peState) savePlanEdit(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && peState && $('#cal').hidden && !tpState) closePlanEdit(); });
}

/* ---------- "What are you working on?" ----------
   A plan knows when you work, not always on what. When a planned start begins without a task,
   the app asks once (on the device you are looking at, when you look), and the answer goes to
   the whole run, including sessions already logged. The same card names a series afterwards. */
let taResolve = null;
function askTask({ title, sub = '', current = '', laterLabel }) {
  $('#taTitle').textContent = title;
  $('#taSub').textContent = sub;
  $('#taSub').hidden = !sub;
  $('#taInput').value = '';
  $('#taLater').textContent = laterLabel || t('cancel');
  const list = projectList().filter(p => !p.hidden).slice(0, 8);
  const cur = projKey(current);
  $('#taChips').innerHTML = list.map(p => `<button type="button" class="at-chip${p.key === cur ? ' on' : ''}" data-name="${esc(p.name)}">${esc(p.name)}</button>`).join('');
  $('#taskAsk').hidden = false;
  if (!ANDROID) setTimeout(() => $('#taInput').focus(), 40);
  return new Promise(res => { taResolve = res; });
}
function closeTask(v) {
  $('#taskAsk').hidden = true;
  if (taResolve) { const r = taResolve; taResolve = null; r(v); }
}
function bindTask() {
  $('#taskAsk').addEventListener('click', e => {
    if (e.target.id === 'taskAsk' || e.target.closest('#taLater')) { closeTask(null); return; }
    const c = e.target.closest('.at-chip');
    if (c) closeTask(c.dataset.name);
  });
  $('#taForm').addEventListener('submit', e => { e.preventDefault(); const v = cleanName($('#taInput').value); closeTask(v || null); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && taResolve) closeTask(null); });
}
// Gives a whole series one task name: its logged sessions, and the run itself if it is the current one
function nameSeries(id, name) {
  name = cleanName(name);
  if (!name) return;
  const key = projKey(name);
  if (!projectList().some(p => p.key === key)) meta(key, name);
  sessions.forEach(s => { if (s.series === id) s.label = name; });
  if (series && series.id === id) { series.label = name; $('#label').value = name; }
  persistNow();
  render();
  renderLabelMeta();
  if (view === 'stats') renderStats();
}
// Asked once per run and device; "Later" also counts (the run can still be named from the history)
const taskAsked = new Set();
let taskAsking = false;
function maybeAskTask() {
  if (taskAsking || !winVisible || document.hidden || !series || !String(series.id || '').startsWith('plan-')) return;
  if (series.label || $('#label').value.trim() || taskAsked.has(series.id)) return;
  if (!$('#modal').hidden || peState || atState) return;
  const id = series.id;
  taskAsked.add(id);
  taskAsking = true;
  askTask({ title: t('taQ'), sub: t('taSub')(hm(series.start)), laterLabel: t('taLater') }).then(name => {
    taskAsking = false;
    if (name) { nameSeries(id, name); toast(t('taSet')(name)); }
  });
}
/* ---------- "Start later" on the timer page: a one-off plan ---------- */
// Picking a time is all it takes now: it is saved, synced, and starts by itself.
function renderWhen() {
  const el = $('#seriesWhenText');
  if (!el) return;
  const n = nextPlan();
  const txt = n ? hm(n.at) : '';
  $('#seriesWhen').title = n ? `${planWhenText(n)} · ${planCountText(n.p)}` : t('startAt');
  if (el.textContent !== txt) el.textContent = txt;
  $('#seriesWhenX').hidden = true; // skipping lives in the plan panel now
  $('#seriesWhen').classList.toggle('set', !!n);
  // another day: a small mark after the time, "+1" for tomorrow or the weekday
  const later = !!n && startOfDay(n.at) !== startOfDay();
  $('#seriesWhen').classList.toggle('later', later);
  $('#seriesWhen').dataset.day = !later ? '' : startOfDay(n.at) === addDays(startOfDay(), 1) ? '+1' : t('daysMon')[(new Date(n.at).getDay() + 6) % 7];
}
function bindWhen() {
  // The clock is the quick way, as before: pick a time and the timer starts then, once (nothing to
  // edit). The plan (schedules) is a tab of its own, on the PC and on the phone alike.
  $('#seriesWhen').addEventListener('click', e => { e.preventDefault(); quickStart($('#seriesWhen')); });
  $('#view-plan').appendChild($('#planBox'));
  $('#seriesWhenX').addEventListener('click', cancelNext);
  $('#planPanel').addEventListener('click', e => { if (e.target.closest('#planSkip')) { cancelNext(); return; } if (e.target.id === 'planPanel' || e.target.closest('#planClose')) closePlanPanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && planOpen && !peState && $('#modal').hidden) closePlanPanel(); });
}
function quickStart(anchor) {
  const quick = planList().find(p => p.quick);
  const init = quick ? { h: Number(quick.time.slice(0, 2)), m: Number(quick.time.slice(3)) } : null;
  askTime(anchor, init, v => {
    if (!v) { if (quick) dropPlan(quick.id); return; }
    const d = new Date();
    d.setHours(v.h, v.m, 0, 0);
    if (d.getTime() <= Date.now() + 30000) d.setDate(d.getDate() + 1);
    if (quick) delete settings.plans[quick.id]; // one quick start at a time: the new time replaces it
    putPlan({
      id: newId(), quick: true, time: `${pad(v.h)}:${pad(v.m)}`, date: dayKey(d.getTime()), days: [],
      count: settings.simple ? 0 : settings.seriesCount > 0 ? settings.seriesCount : 0, work: settings.work, brk: settings.brk,
      label: $('#label').value.trim(), on: true,
    });
    toast(t('planSaved')(planWhenText({ at: d.getTime() })));
  }, { now: !!quick, nowLabel: t('quickOff'), extra: { label: t('schedL'), fn: openSchedule } });
}
let planOpen = false;
// The full schedule: its own tab, on the PC and on the phone
function openSchedule() { $('.tab[data-view="plan"]').click(); }
function openPlanPanel() {
  planOpen = true;
  renderPlans();
  $('#planPanel').hidden = false;
}
function closePlanPanel() { planOpen = false; $('#planPanel').hidden = true; }
// × next to the time: a one-off plan goes away, a weekly one skips just this time
function cancelNext() {
  const n = nextPlan();
  if (!n) return;
  if (n.p.date) dropPlan(n.p.id);
  else { skipDay(n.p, n.key, true); savePlans(); renderPlans(); render(); toast(t('planSkipped')(planWhenText(n))); }
}
// Little reactions to presses (phone): restart a CSS animation on the pressed thing.
// Theme change: the new theme spreads from the pressed button as a growing circle
function setThemeAnimated(val, e) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce || val === settings.theme) { setValue('theme', val); return; }
  const r0 = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
  const x = r0 ? r0.left + r0.width / 2 : innerWidth / 2, y = r0 ? r0.top + r0.height / 2 : innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const tr = document.startViewTransition(() => setValue('theme', val));
  tr.ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 560, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' }
  )).catch(() => {});
}
// A finished work session, like a planted tree: "+50 min" rises from the ring and the ring glows once
function celebrate(ms) {
  if (!winVisible) return;
  // phone: over the ring; PC in the simple mode: over the day bar, which then fills
  const face = ANDROID ? $('#face') : $('#simpleDay');
  const chip = document.createElement('span');
  chip.className = 'plus-chip';
  chip.textContent = '+' + fmtDur(Math.round(ms / 1000));
  face.appendChild(chip);
  setTimeout(() => chip.remove(), 1900);
  kick(face, 'done-pulse');
}
// Text that changes softly: the old value fades out and the new one rises in
function swapText(el, txt) {
  if (!el || el.textContent === txt) return;
  const first = !el.textContent;
  el.textContent = txt;
  if (!first) kick(el, 'swap');
}
function roll(el, up) {
  if (!el) return;
  el.classList.remove('roll-up', 'roll-down');
  void el.offsetWidth;
  el.classList.add(up ? 'roll-up' : 'roll-down');
}
// Puts new markup into a list without rebuilding what did not change: same elements stay, only
// changed text and attributes are touched. Rebuilding replayed hover fades and entrance animations
// every time a list refreshed itself under the cursor.
function setHTML(el, html) {
  if (!el) return;
  if (el._html === html) return;
  el._html = html;
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  morphChildren(el, tpl.content);
}
function morphChildren(to, from) {
  const a = Array.from(to.childNodes), b = Array.from(from.childNodes);
  for (let i = 0; i < b.length; i++) {
    const nb = b[i], na = a[i];
    if (!na) { to.appendChild(nb); continue; }
    const key = n => (n.nodeType === 1 ? n.tagName + '|' + (n.dataset.key || n.dataset.exe || n.dataset.id || '') : '#' + n.nodeType);
    if (key(na) !== key(nb)) { to.replaceChild(nb, na); continue; }
    if (na.nodeType === 3 || na.nodeType === 8) { if (na.nodeValue !== nb.nodeValue) na.nodeValue = nb.nodeValue; continue; }
    if (na.nodeType !== 1) continue;
    for (const at of Array.from(na.attributes)) if (!nb.hasAttribute(at.name)) na.removeAttribute(at.name);
    for (const at of Array.from(nb.attributes)) if (na.getAttribute(at.name) !== at.value) na.setAttribute(at.name, at.value);
    if (na.tagName === 'INPUT' || na.tagName === 'svg' || na.tagName === 'SVG') { if (na.outerHTML !== nb.outerHTML) to.replaceChild(nb, na); continue; }
    morphChildren(na, nb);
  }
  for (let i = a.length - 1; i >= b.length; i--) if (a[i].parentNode === to) to.removeChild(a[i]);
}
function kick(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

/* ---------- Add time by hand: work done without the timer, from memory ---------- */
let atState = null;
// The same card adds time by hand and edits an entry of the history (its name, length and day).
function openAddTime(label, editId) {
  const ed = editId ? sessions.find(x => x.id === editId) : null;
  const m = ed ? Math.round(ed.dur / 60) : 60;
  atState = { h: Math.floor(m / 60), m: m % 60, day: dayKey(ed ? ed.start : Date.now()), edit: ed ? ed.id : '' };
  $('#atProject').value = ed ? (ed.label || '') : label != null ? label : $('#label').value.trim();
  $('#atForm h3').textContent = ed ? t('editEntry') : t('atTitle');
  $('#atSave').textContent = ed ? t('saveL') : t('atSave');
  renderAddTime();
  $('#addTime').hidden = false;
  if (!ANDROID && label == null) setTimeout(() => $('#atProject').focus(), 30);
}
function closeAddTime() {
  $('#addTime').hidden = true;
  closeCalendar();
  atState = null;
}
function renderAddTime() {
  const s = atState;
  $('#atH').textContent = `${s.h} ${t('h')}`;
  $('#atM').textContent = `${s.m} ${t('min')}`;
  $('#atDay').querySelector('span').textContent = s.day === dayKey(Date.now()) ? t('today') : fmtDate(s.day);
  const recent = projectList().filter(p => !p.hidden).sort((a, b) => (b.last || 0) - (a.last || 0)).slice(0, 6);
  const cur = projKey($('#atProject').value);
  $('#atChips').innerHTML = recent.map(p =>
    `<button type="button" class="at-chip${p.key === cur ? ' on' : ''}" data-name="${esc(p.name)}">${esc(p.name)}</button>`).join('');
  $$('#atQuick button').forEach(b => {
    const v = Number(b.dataset.min);
    b.textContent = v < 60 ? `${v} ${t('min')}` : `${v / 60} ${t('h')}`;
    b.classList.toggle('on', v === s.h * 60 + s.m);
  });
  $('#atSave').disabled = s.h * 60 + s.m < 1;
}
function saveAddTime() {
  const s = atState;
  const dur = (s.h * 60 + s.m) * 60;
  if (dur < 60) return;
  const now = Date.now();
  // Today: it just ended. Another day: it ends at 20:00 that day (never in the future).
  const end = s.day === dayKey(now) ? now : Math.min(now, parseDay(s.day) + 20 * 3600000);
  const label = cleanName($('#atProject').value);
  if (s.edit) {
    const x = sessions.find(y => y.id === s.edit);
    closeAddTime();
    if (!x) return;
    // same time of day, on the chosen day; the length and the name as set
    x.start = parseDay(s.day) + (x.start - startOfDay(x.start));
    x.dur = dur;
    x.end = x.start + dur * 1000;
    x.label = label;
    sessions.sort((a, b) => a.start - b.start);
    persistNow();
    render();
    if (view === 'stats') renderStats();
    if (view === 'projects') renderProjects();
    toast(t('edited'));
    return;
  }
  sessions.push({ id: newId(), start: end - dur * 1000, end, dur, label, full: false, manual: true });
  sessions.sort((a, b) => a.start - b.start);
  closeAddTime();
  persistNow();
  render();
  renderLabelMeta();
  if (view === 'stats') renderStats();
  if (view === 'projects') renderProjects();
  toast(t('atAdded')(fmtDur(dur)));
}
function bindAddTime() {
  const step = (k, d) => {
    if (k === 'h') atState.h = Math.min(16, Math.max(0, atState.h + d));
    else {
      atState.m += d * 5;
      if (atState.m >= 60) { atState.m = 0; atState.h = Math.min(16, atState.h + 1); }
      if (atState.m < 0) { atState.m = atState.h > 0 ? 55 : 0; if (atState.h > 0) atState.h--; }
    }
    renderAddTime();
  };
  $('#addTime').addEventListener('click', e => {
    if (e.target.id === 'addTime') { closeAddTime(); return; }
    const b = e.target.closest('button');
    if (!b || !atState) return;
    if (b.dataset.step) step(b.dataset.step, Number(b.dataset.d));
    else if (b.dataset.min) { const v = Number(b.dataset.min); atState.h = Math.floor(v / 60); atState.m = v % 60; renderAddTime(); }
    else if (b.dataset.name != null && b.classList.contains('at-chip')) { $('#atProject').value = b.dataset.name; renderAddTime(); }
    else if (b.id === 'atDay') {
      openCalendar(b, atState.day, v => {
        const today = dayKey(Date.now());
        atState.day = v && v <= today ? v : today; // no future days
        renderAddTime();
      });
    } else if (b.id === 'atCancel') closeAddTime();
  });
  $('#atProject').addEventListener('input', () => { if (atState) renderAddTime(); });
  $('#atForm').addEventListener('submit', e => { e.preventDefault(); if (atState) saveAddTime(); });
  $('#btnAddTime').addEventListener('click', () => openAddTime());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && atState && $('#cal').hidden) closeAddTime(); });
}

/* ---------- CSV import (our own export format, RU ";" or EN ",") ---------- */
function parseCsvLine(line, sep) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === sep) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
// Same start minute and same task = the same session (lengths may differ by CSV rounding).
// The same work = the same key. A series session is identified by its series and start alone:
// two devices running one series may have different task names typed in (that logged it twice).
const sessionKey = s => (s.series ? `${s.series}|${Math.round(s.start / 60000)}` : `${Math.round(s.start / 60000)}|${projKey(s.label)}`);
// Drops twins already in the history; the earliest logged (smaller id) stays, as in sync.
function dedupeSessions() {
  const best = new Map();
  for (const s of sessions) { const k = sessionKey(s), b = best.get(k); if (!b || String(s.id) < String(b.id)) best.set(k, s); }
  if (best.size === sessions.length) return false;
  const keep = new Set(best.values());
  sessions = sessions.filter(s => keep.has(s));
  return true;
}

// Our own CSV export (RU ";" or EN ","): Date, Start, End, Minutes, Task.
function sessionsFromCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return null;
  const sep = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
  const out = [];
  for (const line of lines) {
    const [date, from, to, mins, task] = parseCsvLine(line, sep);
    const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec((date || '').trim());
    const fm = /^(\d{1,2}):(\d{2})$/.exec((from || '').trim());
    const tm = /^(\d{1,2}):(\d{2})$/.exec((to || '').trim());
    const minutes = parseFloat(String(mins || '').replace(',', '.'));
    if (!dm || !fm || !(minutes > 0)) continue; // header or junk
    const start = new Date(+dm[1], +dm[2] - 1, +dm[3], +fm[1], +fm[2]).getTime();
    const dur = Math.round(minutes * 60);
    let end = start + dur * 1000;
    if (tm) {
      let e2 = new Date(+dm[1], +dm[2] - 1, +dm[3], +tm[1], +tm[2]).getTime();
      if (e2 < start) e2 += 86400000; // crossed midnight
      end = e2;
    }
    out.push({ start, end, dur, label: cleanName(task || '') });
  }
  return out;
}

// CSV import; duplicates (same start minute and task) are skipped, so re-importing never doubles.
async function importFile(file) {
  let text;
  try { text = (await file.text()).replace(/^﻿/, ''); } catch { toast(t('importBad')); return; }
  const found = sessionsFromCsv(text);
  if (!found) { toast(t('importBad')); return; }
  const seen = new Set(sessions.map(sessionKey));
  let added = 0;
  for (const s of found) {
    const k = sessionKey(s);
    if (seen.has(k)) continue;
    seen.add(k);
    sessions.push({ id: newId(), ...s, full: s.dur >= settings.work * 60 });
    added++;
  }
  if (!added) { toast(t('importNone')); return; }
  sessions.sort((a, b) => a.start - b.start);
  await persistNow();
  render();
  renderLabelMeta();
  if (view === 'stats') renderStats();
  if (view === 'projects') renderProjects();
  toast(t('imported')(added));
}

/* ---------- Responsive timer view ----------
   When the window is too short, parts disappear in a fixed order (least important first).
   Each step is decided from the full layout, so shrinking never brings a hidden part back;
   only growing the window can. Works at any zoom: WebView2 zoom changes CSS px itself. */
const FIT_STEPS = ['test', 'meta', 'when', 'series', 'today', 't-md', 'brk', 'work', 'label', 't-sm', 'phase'];
let fitLevel = -1;

function fitTimer() {
  if (ANDROID) return;
  const v = $('#view-timer');
  if (!v.classList.contains('active')) return;
  const main = $('main');
  let level = 0;
  const apply = n => {
    FIT_STEPS.forEach((s, i) => v.classList.toggle(`fit-${s}`, i < n));
  };
  apply(0);
  while (level < FIT_STEPS.length && v.offsetHeight > main.clientHeight + 1) {
    level++;
    apply(level);
  }
  if (level !== fitLevel) fitLevel = level;
}

/* ================= Apps (time in programs) ================= */
let appStats = [];
let appCands = [];

function fmtLong(sec) {
  const h = sec / 3600;
  if (h >= 10) {
    const s = (Math.round(h * 10) / 10).toString();
    return `${settings.lang === 'ru' ? s.replace('.', ',') : s} ${t('h')}`;
  }
  return fmtDur(sec);
}
// The program's own icon when Windows gives one, otherwise a coloured letter.
function avatar(name, exe, icon) {
  if (icon && icon.startsWith('data:image/png;base64,')) return `<div class="app-ico has-img"><img src="${icon}" alt="" draggable="false"></div>`;
  let hsh = 0;
  for (const c of exe) hsh = (hsh * 31 + c.charCodeAt(0)) >>> 0;
  const letter = (name.trim()[0] || '?').toUpperCase();
  return `<div class="app-ico" style="--h:${hsh % 360}">${esc(letter)}</div>`;
}

async function loadApps() {
  // the phone does not track programs: it shows what the PC sent through sync
  if (ANDROID || api.web) { appStats = appsRemote || []; renderApps(); return; }
  appStats = (await api.appsStats()) || [];
  renderApps();
  syncApps(appStats);
}

// Period shown in the programs list: 1 = today, 7, 30, 90 days, 0 = all time (same codes as the card)
const APP_RANGES = [1, 7, 30, 90, 0];
const rangeLabel = r => t({ 1: 'adToday', 7: 'ad7', 30: 'ad30', 90: 'ad90', 0: 'adAll' }[r]);
const appTimes = (a, r) => ({ 1: a.today, 7: a.week, 30: a.month, 90: a.quarter || a.month, 0: a.total }[r] || a.today || {});
function renderApps() {
  const r = APP_RANGES.includes(settings.appsRange) ? settings.appsRange : 1;
  const act = a => (appTimes(a, r).active || 0);
  const list = [...appStats].sort((a, b) => (act(b) - act(a)) || (b.total.active - a.total.active));
  const btn = $('#appsRange span');
  if (btn) btn.textContent = rangeLabel(r);
  $('.apps-cap').hidden = !list.length;
  setHTML($('#appList'), list.length ? list.map(a => `<div class="app" data-exe="${esc(a.exe)}">
      ${avatar(a.name, a.exe, a.icon)}
      <div class="app-main">
        <div class="app-name"><span>${esc(a.name)}</span>${a.running ? `<span class="dot" title="${esc(t('running'))}"></span>` : ''}</div>
      </div>
      <div class="app-total${act(a) >= 60 ? '' : ' none'}">${act(a) >= 60 ? fmtLong(act(a)) : '—'}</div>
    </div>`).join('') : `<div class="empty-state">${t(ANDROID || api.web ? 'appsNoneA' : 'appsNone')}</div>`);
  if (adExe) renderAppDetail();
}

/* ---------- Small quiet menu (period of the programs list) ---------- */
let menuState = null;
function openMenu(anchor, items, onPick) {
  const m = $('#menu');
  m.innerHTML = items.map(i => `<button class="menu-i${i.on ? ' on' : ''}" data-v="${esc(String(i.value))}">${esc(i.label)}${i.on ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : ''}</button>`).join('');
  m.hidden = false;
  menuState = { onPick, anchor };
  anchor.classList.add('open');
  const r = anchor.getBoundingClientRect();
  const w = m.offsetWidth, h = m.offsetHeight;
  const x = Math.min(Math.max(10, r.right - w), innerWidth - w - 10);
  let y = r.bottom + 6;
  if (y + h > innerHeight - 10) y = Math.max(10, r.top - h - 6);
  m.style.left = `${x}px`;
  m.style.top = `${y}px`;
}
function closeMenu() {
  if (!menuState) return;
  menuState.anchor.classList.remove('open');
  $('#menu').hidden = true;
  menuState = null;
}
function bindMenu() {
  $('#menu').addEventListener('click', e => {
    const b = e.target.closest('.menu-i');
    if (!b || !menuState) return;
    const pick = menuState.onPick;
    closeMenu();
    pick(b.dataset.v);
  });
  document.addEventListener('mousedown', e => { if (menuState && !e.target.closest('#menu') && !e.target.closest('.range-pick')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('resize', closeMenu);
  $('main').addEventListener('scroll', closeMenu, { passive: true });
  $('#appsRange').addEventListener('click', e => {
    if (menuState) { closeMenu(); return; }
    const cur = APP_RANGES.includes(settings.appsRange) ? settings.appsRange : 1;
    openMenu(e.currentTarget, APP_RANGES.map(v => ({ value: v, label: rangeLabel(v), on: v === cur })), v => {
      settings.appsRange = Number(v);
      persist();
      renderApps();
    });
  });
}

let appInstalled = [];
let pickItems = [];

function renderCandidates() {
  const q = $('#appSearch').value.trim().toLowerCase();
  const tracked = new Set(appStats.map(a => a.exe));
  const match = c => !q || c.name.toLowerCase().includes(q) || c.exe.includes(q);
  const running = appCands.filter(c => !tracked.has(c.exe) && match(c));
  const runSet = new Set(running.map(c => c.exe));
  const rest = appInstalled.filter(c => !tracked.has(c.exe) && !runSet.has(c.exe) && match(c));
  pickItems = [];
  const block = (title, list) => {
    if (!list.length) return '';
    const rows = list.map(c => {
      pickItems.push(c);
      return `<button class="cand" data-i="${pickItems.length - 1}">${avatar(c.name, c.exe, c.icon)}<span class="cand-text"><span class="cand-name">${esc(c.name)}</span><span class="cand-exe">${esc(c.exe)}</span></span><span class="cand-add">+</span></button>`;
    }).join('');
    return `<div class="cand-group">${esc(title)}</div>${rows}`;
  };
  const html = block(t('appsPick'), running) + block(q ? t('appsFound') : t('appsAll'), rest);
  $('#appCandidates').innerHTML = html || `<div class="empty-state">${q ? t('appsNothing') : t('appsNoCand')}</div>`;
}

async function openPicker() {
  $('#appPicker').hidden = false;
  $('#btnAddApp').style.display = 'none';
  $('#appSearch').value = '';
  $('#appCandidates').innerHTML = '<div class="cand-loading"></div>';
  setTimeout(() => $('#appSearch').focus(), 60);
  const [run, all] = await Promise.all([api.appsCandidates(), api.appsInstalled()]);
  appCands = run || [];
  appInstalled = all || [];
  renderCandidates();
}

async function addApp(c) {
  if (!c) return;
  appStats = (await api.appsTrack(c)) || appStats;
  renderApps();
  renderCandidates();
  toast(t('appsAdded')(c.name));
}
function closePicker() {
  $('#appPicker').hidden = true;
  $('#btnAddApp').style.display = '';
}

/* ================= Launch with Windows ================= */
let autostartOn = false;
function renderAutostart() { $('#autostartToggle').classList.toggle('on', autostartOn); }

/* ================= Settings changes ================= */
function changeSetting(key, dir) {
  const lim = LIMITS[key];
  const v = Math.round((settings[key] + dir * lim.step) * 10) / 10;
  settings[key] = Math.min(lim.max, Math.max(lim.min, v));
  if ((key === 'work' && timer.phase === 'work') || (key === 'brk' && timer.phase === 'break')) {
    if (isUntouched()) setPhase(timer.phase);
  }
  persist();
  render();
}

function setValue(key, val) {
  settings[key] = val;
  if (key === 'lang') { applyI18n(); renderLabelMeta(); renderApps(); if (view === 'projects') renderProjects(); }
  if (key === 'theme') applyTheme();
  if (key === 'simple') applyMode();
  if (key === 'alwaysOnTop') api.alwaysOnTop(val);
  persist();
  render();
}

let animT = null;
function animateView() {
  if (ANDROID) return;
  const v = $(`#view-${view}`);
  $$('.view.anim').forEach(x => x.classList.remove('anim'));
  v.classList.add('anim');
  clearTimeout(animT);
  animT = setTimeout(() => v.classList.remove('anim'), 1100);
}

// Zoom is done by WebView2 itself, so CSS px, media queries and the responsive layout follow it.
function applyZoom() {
  api.zoom(settings.zoom);
}
function setZoom(z) {
  z = Math.round(Math.min(ZOOM.max, Math.max(ZOOM.min, z)) * 10) / 10;
  if (z === settings.zoom) return;
  settings.zoom = z;
  applyZoom();
  toast(`${t('scale')} ${Math.round(z * 100)}%`);
  persist();
  if (view === 'stats') renderStats();
}

/* ================= Toast ================= */
let toastT = null;
function toast(msg, action, onAction) {
  const el = $('#toast');
  el.querySelector('span').textContent = msg;
  const b = el.querySelector('button');
  b.hidden = !action;
  b.textContent = action || '';
  b.onclick = action ? () => { el.classList.remove('show', 'act'); onAction(); } : null;
  el.classList.toggle('act', !!action);
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show', 'act'), action ? 4500 : 1800);
}

/* ================= CSV ================= */
async function exportCsv() {
  const ru = settings.lang === 'ru';
  const sep = ru ? ';' : ',';
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  const lines = [t('csvHead')];
  [...sessions].sort((a, b) => a.start - b.start).forEach(s => {
    const mins = (s.dur / 60).toFixed(1);
    lines.push([dayKey(s.start), hm(s.start), hm(s.end), ru ? mins.replace('.', ',') : mins, q(s.label || '')].join(sep));
  });
  const ok = await api.exportCsv(lines.join('\r\n'), `yaytsa-timer-${dayKey(Date.now())}.csv`);
  if (ok) toast(t('exported'));
}

/* ================= Events ================= */
function bind() {
  $$('.tab').forEach(b => b.addEventListener('click', () => {
    view = b.dataset.view;
    $$('.tab').forEach(x => x.classList.toggle('active', x === b));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
    animateView();
    if (view === 'stats') { historyLimit = 7; renderStats(); nudgeFull(); }
    if (view === 'projects') renderProjects();
    if (view === 'plan') renderPlans();
    if (view === 'apps') { closePicker(); loadApps(); }
    if (view === 'timer') fitTimer();
    if (ANDROID) setPager(true);
    closeCalendar();
    renderTimer();
    $('main').scrollTop = 0;
  }));

  $('#btnStart').addEventListener('click', toggle);
  if (ANDROID) $('#btnStart').addEventListener('click', () => kick($('#btnStart'), 'press'));
  $('#btnReset').addEventListener('click', () => {
    if (series && !seriesPos.startsWith('wait')) {
      const done = timer.phase === 'work' && timer.startedAt ? Math.floor((timer.total - currentRemaining()) / 1000) : 0;
      confirmModal(t('endStopQ'), t('stopSeriesText2')(done >= MIN_SAVE_SEC ? fmtDur(done) : ''), t('endStop'), { cancel: t('stopKeep'), keepFirst: true })
        .then(ok => { if (ok) stopSeries(); });
      return;
    }
    if (series) reset(); else stopEarly();
  });
  $('#btnSkip').addEventListener('click', skip);
  $('#label').addEventListener('input', () => { if (series) series.label = $('#label').value.trim(); persist(); renderLabelMeta(); });

  // Projects
  $('#projAdd').addEventListener('submit', e => {
    e.preventDefault();
    const name = cleanName($('#projName').value);
    if (!name) return;
    meta(projKey(name), name).hidden = false;
    $('#projName').value = '';
    persist();
    renderProjects();
  });
  $('#projList').addEventListener('click', onProjectClick);

  // Apps
  $('#btnAddApp').addEventListener('click', openPicker);
  $('#btnPickClose').addEventListener('click', closePicker);
  $('#appCandidates').addEventListener('click', e => {
    const b = e.target.closest('.cand');
    if (b) addApp(pickItems[Number(b.dataset.i)]);
  });
  $('#appSearch').addEventListener('input', renderCandidates);
  $('#appSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter' && pickItems.length === 1) addApp(pickItems[0]);
    if (e.key === 'Escape') closePicker();
  });
  $('#btnBrowse').addEventListener('click', async () => addApp(await api.appsBrowse(t('appsBrowseTitle'))));
  $('#appList').addEventListener('click', e => {
    const row = e.target.closest('.app');
    if (row) openAppDetail(row.dataset.exe);
  });
  setInterval(() => { if (view === 'apps') loadApps(); }, 10000);

  // Launch with Windows
  $('#autostartToggle').addEventListener('click', async () => {
    const want = !autostartOn;
    if (await api.setAutostart(want)) autostartOn = want;
    renderAutostart();
  });
  $('#label').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });

  $$('.toggle[data-key]').forEach(el => el.addEventListener('click', () => setValue(el.dataset.key, !settings[el.dataset.key])));
  $$('.seg[data-key] button').forEach(b => b.addEventListener('click', e => {
    const key = b.closest('.seg').dataset.key;
    if (key === 'theme') setThemeAnimated(b.dataset.val, e);
    else setValue(key, b.dataset.val);
  }));
  $$('#chartRange button').forEach(b => b.addEventListener('click', () => { chartRange = Number(b.dataset.range); renderControls(); renderStats(); }));
  $$('#heatRange button').forEach(b => b.addEventListener('click', () => { settings.heatRange = Number(b.dataset.range); persist(); animateView(); renderControls(); renderStats(); }));
  $$('#chartMode button').forEach(b => b.addEventListener('click', () => { settings.chartMode = b.dataset.mode; persist(); animateView(); renderControls(); renderStats(); }));
  initHeatTip();
  let resizeT = null;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (view === 'stats') renderStats(); }, 120); });

  $('#btnHistAll').addEventListener('click', openHistory);
  $('#history').addEventListener('click', e => {
    const b = e.target.closest('.hs-del');
    if (b) { deleteEntries(b.closest('.hs').dataset.id.split(',')); return; }
    const row = e.target.closest('.hs.series');
    if (row) { openSeriesCard(row.dataset.series); return; }
    const one = e.target.closest('.hs');
    if (one) openAddTime(null, one.dataset.id); // a single entry opens for editing
  });
  $('#seriesCard').addEventListener('click', e => {
    if (e.target.closest('#scTask') && scId) {
      const id = scId, cur = (sessions.find(s => s.series === id && s.label) || {}).label || '';
      askTask({ title: t('scNameQ'), sub: t('scNameSub'), current: cur }).then(name => { if (name) { nameSeries(id, name); renderSeriesCard(); renderHistory(); } });
      return;
    }
    if (e.target.id === 'seriesCard' || e.target.closest('#scClose')) { closeSeriesCard(); return; }
    const b = e.target.closest('.hs-del');
    if (b) deleteEntries([b.closest('.sc-row').dataset.id]);
  });
  $('#histAll').addEventListener('click', e => { if (e.target.id === 'histAll' || e.target.closest('#histClose')) closeHistory(); });
  $('#historyFull').addEventListener('click', e => {
    const btn = e.target.closest('.del');
    if (!btn) { const row = e.target.closest('.row[data-id]'); if (row) openAddTime(null, row.dataset.id); return; }
    sessions = sessions.filter(s => s.id !== btn.dataset.id);
    persistNow();
    renderStats();
    renderTimer();
    toast(t('deleted'));
  });
  $('#btnMore').addEventListener('click', () => { historyLimit += 14; renderHistory(); });
  $('#btnExport').addEventListener('click', exportCsv);
  $('#btnExport2').addEventListener('click', exportCsv);
  $('#btnFolder').addEventListener('click', () => api.openDataFolder());

  // Interface scale: Ctrl + / Ctrl − / Ctrl 0 and Ctrl + wheel
  document.addEventListener('keydown', e => {
    if (!e.ctrlKey || e.altKey) return;
    if (e.code === 'Equal' || e.code === 'NumpadAdd') { e.preventDefault(); setZoom(settings.zoom + ZOOM.step); }
    else if (e.code === 'Minus' || e.code === 'NumpadSubtract') { e.preventDefault(); setZoom(settings.zoom - ZOOM.step); }
    else if (e.code === 'Digit0' || e.code === 'Numpad0') { e.preventDefault(); setZoom(1); }
  });
  window.addEventListener('wheel', e => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    setZoom(settings.zoom + (e.deltaY < 0 ? ZOOM.step : -ZOOM.step));
  }, { passive: false });

  api.onPhaseDue(() => tick());
  api.onWindowVisible(v => { winVisible = v; if (v) { render(); fitTimer(); } });

  // Title bar: drag, double-click to maximize, top edge resizes, own window buttons
  $('#titlebar').addEventListener('mousedown', e => {
    if (e.button !== 0 || e.target.closest('.win-btn')) return;
    const edge = e.target.closest('[data-hit]');
    api.ncdrag(edge ? Number(edge.dataset.hit) : 2);
  });
  $('#titlebar').addEventListener('dblclick', e => { if (!e.target.closest('.win-btn')) api.winMax(); });
  $('#winMin').addEventListener('click', () => api.winMin());
  $('#winMax').addEventListener('click', () => api.winMax());
  $('#winClose').addEventListener('click', () => api.winClose());
  api.onMaximized(m => document.documentElement.classList.toggle('maxed', !!m));

  bindLabelSuggest();
  bindCalendar();
  $('#modalCancel').addEventListener('click', () => closeModal(false));
  $('#modalOk').addEventListener('click', () => closeModal(true));
  $('#modal').addEventListener('mousedown', e => { if (e.target.id === 'modal') closeModal(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#modal').hidden) closeModal(false);
    else if (!$('#cal').hidden) closeCalendar();
  });

  // CSV import
  const pickCsv = () => { $('#csvFile').value = ''; $('#csvFile').click(); };
  $('#btnImport').addEventListener('click', pickCsv);
  $('#btnImport2').addEventListener('click', pickCsv);
  $('#csvFile').addEventListener('change', e => { const f = e.target.files[0]; if (f) importFile(f); });

  // Responsive timer view
  let fitT = null;
  window.addEventListener('resize', () => { cancelAnimationFrame(fitT); fitT = requestAnimationFrame(() => { fitTimer(); fitTabs(); }); });

  api.onAlertAction(action => {
    if (alertIsTest) { alertIsTest = false; return; }
    if (action !== 'start') return;
    tick(); // a phase that ran out while the app slept is completed first
    if (!timer.running) start();
  });
  let updAsked = false;
  api.onUpdateReady(v => {
    const el = $('#update');
    el.querySelector('span').textContent = t('updReady')(v);
    el.querySelector('button').textContent = t('updNow');
    el.hidden = false;
    // On the phone ask right away, once per launch
    if (ANDROID && !updAsked && $('#modal').hidden) {
      updAsked = true;
      confirmModal(t('updTitle')(v), t('updText'), t('updInstall'), { safe: true, cancel: t('updLater') })
        .then(ok => { if (ok) api.installUpdate(); });
    }
  });
  $('#update button').addEventListener('click', () => api.installUpdate());
  api.onTrayAction(a => {
    if (a === 'toggle') toggle();
    else if (a === 'test') runTest();
  });
  $('#btnTest').addEventListener('click', runTest);
  $('#btnTest2').addEventListener('click', runTest);
  window.addEventListener('error', e => api.log(String(e.message)));

  if (ANDROID) {
    api.onTimerState(s => { if (applyHostTimer(s)) { lastHostState = ''; render(); } });
    // System back: close what is open, then go back to the timer; false lets the app go to background
    window.__back = () => {
      if (!$('#sheet').hidden) { closeSheet(null); return true; }
      if (tsOpen) { closeTimeSheet(); return true; }
      if (taResolve) { closeTask(null); return true; }
      if (peState) { closePlanEdit(); return true; }
      if (planOpen) { closePlanPanel(); return true; }
      if (scId) { closeSeriesCard(); return true; }
      if (adExe) { closeAppDetail(); return true; }
      if (!$('#histAll').hidden) { closeHistory(); return true; }
      if (!$('#cal').hidden) { closeCalendar(); return true; }
      if (!$('#addTime').hidden) { closeAddTime(); return true; }
      if (!$('#modal').hidden) { closeModal(false); return true; }
      if (!$('#cal').hidden) { closeCalendar(); return true; }
      if (view !== 'timer') { $('.tab[data-view="timer"]').click(); return true; }
      return false;
    };
  }
  if (ANDROID) {
    api.onBgHelp(() => {
      const ask = () => confirmModal(t('bgTitle'), t('bgText'), t('bgGo'), { safe: true, cancel: t('bgLater') })
        .then(ok => { if (ok) api.fixBackground(); });
      if ($('#modal').hidden) ask(); else setTimeout(ask, 4000);
    });
    bindSwipe();
    bindDials();
    $('#btnReset').addEventListener('click', () => kick($('#btnReset'), 'spin'));
    $('#btnSkip').addEventListener('click', () => kick($('#btnSkip'), 'nudge'));
    $$('.seg[data-key="theme"] button').forEach(b => b.addEventListener('click', () => kick(b, 'swing')));
    $$('.tab').forEach(b => b.addEventListener('click', () => kick(b, 'pop')));
    $$('.toggle').forEach(b => b.addEventListener('click', () => kick(b, 'press')));
    $('#btnSound').addEventListener('click', pickSound);
    $('#sheetCancel').addEventListener('click', () => closeSheet(null));
    $('#sheet').addEventListener('click', e => {
      if (e.target.id === 'sheet') closeSheet(null);
      const it = e.target.closest('.sheet-item');
      if (it) closeSheet(it.dataset.key);
    });
    api.soundInfo().then(r => { $('#soundName').textContent = (r && r.name) || t('soundDefault'); });
  }
  api.onSystemTheme(dark => { systemDark = dark; if (settings.theme === 'system') applyTheme(); });

  // Called by the host right before quitting
  // Quitting does not end a session any more: the timer is saved (and in the cloud) and goes on
  window.__beforeQuit = () => { api.saveSync(snapshot()); };
  window.addEventListener('beforeunload', () => { api.saveSync(snapshot()); });

  // Refresh stats around midnight / while visible
  setInterval(() => {
    if (view === 'stats') renderStats();
    if (view === 'projects' && !document.querySelector('.proj .inline')) renderProjects();
    renderLabelMeta();
  }, 15000);
}

/* ================= Boot ================= */
// The last run ended unexpectedly (the host saw its "running" mark still there): say so, and what was kept
function showCrashNote(c, bootLogged) {
  if (!c || !c.alive) return;
  const lines = [t('crashAt')(hm(c.alive))];
  const touched = !isUntouched();
  const done = Math.max(0, Math.floor((timer.total - currentRemaining()) / 1000));
  if (bootLogged) lines.push(t('crashLogged')(fmtDur(bootLogged)));
  else if (series && !seriesPos.startsWith('wait')) lines.push(t('crashGoes')($('#cycleInfo').textContent));
  else if (timer.phase === 'work' && touched) lines.push((timer.running ? t('crashRun') : t('crashPaused'))(fmtDur(done), fmtDur(Math.round(timer.total / 1000))));
  lines.push(t('crashToday')(fmtDur(todaySec())));
  if (c.saved) lines.push(t('crashSaved')(startOfDay(c.saved) === startOfDay() ? hm(c.saved) : `${dayTitle(c.saved)}, ${hm(c.saved)}`));
  confirmModal(t('crashTitle'), lines.join('\n'), t('gotIt'), { safe: true, noCancel: true });
}
(async function boot() {
  if (ANDROID) {
    Object.values(I18N).forEach(l => { l.popup = l.popupA; l.popupDesc = l.popupDescA; l.dataDesc = l.dataDescA; l.workLen = l.work; l.breakLen = l.break; });
    I18N.ru.trayTest = 'Проверка сигнала'; I18N.en.trayTest = 'Test the alert'; // shorter labels on the phone
  }
  const data = (await api.load()) || {};
  settings = { ...DEFAULTS, ...(data.settings || {}) };
  // 2.17: the endless timer is the new default — once, for everyone
  if (!settings.endlessDefault) { settings.seriesCount = 0; settings.endlessDefault = 1; }
  sessions = Array.isArray(data.sessions) ? data.sessions : [];
  dedupeSessions(); // twins logged by two devices before 2.17.1
  projects = data.projects && typeof data.projects === 'object' ? data.projects : {};
  systemDark = await api.systemDark();
  autostartOn = !!(await api.autostart());
  if (data.current && data.current.label) $('#label').value = data.current.label;

  applyTheme();
  applyZoom();
  applyI18n();
  applyMode();
  setPhase('work');
  if (ANDROID) applyHostTimer(data.timer);
  let bootLogged = 0; // a session that ran out while the app was closed, logged just now
  const savedSeries = ANDROID && data.timer && data.timer.series ? data.timer.series : (data.current && data.current.series);
  if (validSeries(savedSeries)) { series = { logged: 0, pausedAt: 0, ...savedSeries }; applySeries(true); }
  else if (!ANDROID && data.current && data.current.timer) {
    applyHostTimer(data.current.timer); // the timer kept going while the app was closed
    if (timer.running && Date.now() > timer.endAt + 120000) {
      // it ran out long ago: log it with its real end, quietly, and move to the next phase
      if (timer.phase === 'work') { logWork(true); bootLogged = Math.round(timer.total / 1000); }
      setPhase(timer.phase === 'work' ? 'break' : 'work');
    }
  }
  if (settings.theme !== 'light' && settings.theme !== 'dark') settings.theme = systemDark ? 'dark' : 'light'; // light and dark only now
  bind();
  bindWhen();
  bindAppDetail();
  bindTimeSheet();
  bindAddTime();
  bindTimePicker();
  bindMenu();
  bindArchive();
  bindPlans();
  bindTask();
  bindChips();
  initInfo();
  syncInit(data);
  render();
  renderAutostart();
  updateDatalist();
  renderLabelMeta();
  setInterval(tick, 250);
  if (ANDROID) { renderProjects(); renderStats(); setPager(false); } // neighbour pages are visible while swiping
  setTimeout(() => { const sp = $('#splash'); if (sp) sp.remove(); }, 1600); // the launch animation is pure CSS
  planTick(true); // a planned start that came while the app was closed begins from its planned time
  renderPlans();
  maybeAskMode();
  if (data.crash) setTimeout(() => showCrashNote(data.crash, bootLogged), 400);
  if (api.ready) { tick(); api.ready(); }
})();
