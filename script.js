let first_spin = true
let first_click = true
let phase = 1

// надписи и цвета на секторах
const prizes = [
  {
    text: "Буська",
    color: "hsl(197 30% 43%)",
  },
  { 
    text: "Буська",
    color: "hsl(173 58% 39%)",
  },
  { 
    text: "Буська",
    color: "hsl(43 74% 66%)",
  },
  {
    text: "Буська",
    color: "hsl(27 87% 67%)",
  },
  {
    text: "Буська",
    color: "hsl(12 76% 61%)",
  },
  {
    text: "Буська",
    color: "hsl(350 60% 52%)",
  },
  {
    text: "Поджопник",
    color: "hsl(91 43% 54%)",
  },
  {
    text: "Буська",
    color: "hsl(10 96% 74%)",
  },
  {
    text: "Буська",
    color: "hsl(140 36% 74%)",
  },
  {
    text: "Буська",
    color: "hsl(140 58% 74%)",
  },
  {
    text: "Буська",
    color: "hsl(190 79% 44%)",
  },
];

// создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

// на сколько секторов нарезаем круг
const prizeSlice = 360 / prizes.length;
// на какое расстояние смещаем сектора друг относительно друга
const prizeOffset = Math.floor(180 / prizes.length);
// прописываем CSS-классы, которые будем добавлять и убирать из стилей
const spinClass = "is-spinning";
const selectedClass = "selected";
// получаем все значения параметров стилей у секторов
const spinnerStyles = window.getComputedStyle(spinner);

// переменная для анимации
let tickerAnim;
// угол вращения
let rotation = 0;
// текущий сектор
let currentSlice = 0;
// переменная для текстовых подписей
let prizeNodes;

// расставляем текст по секторам
const createPrizeNodes = () => {
  // обрабатываем каждую подпись
  prizes.forEach(({ text, color, reaction }, i) => {
    
    if (phase == 1) {
      text = Math.floor((Math.random() * 9) + 3)
    }
    // каждой из них назначаем свой угол поворота
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    // добавляем код с размещением текста на страницу в конец блока spinner
    spinner.insertAdjacentHTML(
      "beforeend",
      // текст при этом уже оформлен нужными стилями
      `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const changePrizesNodes = () => {
  for (let i=0; i < prizeNodes.length; i++){
    // prizeNodes[i].textContent = prizes[i].text
    prizeNodes[i].textContent = ""
  }
}

const clearOldWheel = () => {
  prizes_in_page = document.querySelectorAll(".prize")
  prizes_in_page.forEach(element => element.remove());
}

// рисуем разноцветные секторы
const createConicGradient = () => {
  // устанавливаем нужное значение стиля у элемента spinner
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        // получаем цвет текущего сектора
        .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
        .reverse()
      }
    );`
  );
};


// создаём функцию, которая нарисует колесо в сборе
const setupWheel = () => {
  // сначала секторы
  createConicGradient();
  // потом текст
  createPrizeNodes();
  // а потом мы получим список всех призов на странице, чтобы работать с ними как с объектами
  prizeNodes = wheel.querySelectorAll(".prize");
};

// определяем количество оборотов, которое сделает наше колесо
const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (phase == 2) {
    console.log(first_spin)
    phase = 3
    return Math.floor(2 * (max - min + 1)) + min;
  }
  else{
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// функция запуска вращения с плавной остановкой
const runTickerAnimation = () => {
  // взяли код анимации отсюда: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];  
  let rad = Math.atan2(b, a);
  
  if (rad < 0) rad += (2 * Math.PI);
  
  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  // анимация язычка, когда его задевает колесо при вращении
  // если появился новый сектор
  if (currentSlice !== slice) {
    // убираем анимацию язычка
    ticker.style.animation = "none";
    // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
    setTimeout(() => ticker.style.animation = null, 10);
    // после того, как язычок прошёл сектор - делаем его текущим 
    currentSlice = slice;
  }
  // запускаем анимацию
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

// функция выбора призового сектора
const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
};

// отслеживаем нажатие на кнопку
trigger.addEventListener("click", () => {
  if (!first_click){
    clearOldWheel()
    setupWheel()
    trigger.textContent = "Испытай удачу"
    first_click = true
  }
  else{
    // делаем её недоступной для нажатия
    trigger.disabled = true;
    // задаём начальное вращение колеса
    rotation = Math.floor(2 * 360 + spinertia(400, 838.5));
    // rotation = Math.floor(Math.random() * 360 + spinertia(400, 800));
    // убираем прошлый приз
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
    // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
    wheel.classList.add(spinClass);
    // через CSS говорим секторам, как им повернуться
    spinner.style.setProperty("--rotate", rotation);
    // возвращаем язычок в горизонтальную позицию
    ticker.style.animation = "none";
    first_click = false
    // запускаем анимацию вращение
    runTickerAnimation();
    phase = 2
  };
});

// отслеживаем, когда закончилась анимация вращения колеса
spinner.addEventListener("transitionend", () => {
  // останавливаем отрисовку вращения
  cancelAnimationFrame(tickerAnim);
  // получаем текущее значение поворота колеса
  rotation %= 360;
  // выбираем приз
  selectPrize();
  // убираем класс, который отвечает за вращение
  wheel.classList.remove(spinClass);
  // отправляем в CSS новое положение поворота колеса
  spinner.style.setProperty("--rotate", rotation);
  // делаем кнопку снова активной
  trigger.disabled = false;
  trigger.textContent = "Продолжить"
});

// подготавливаем всё к первому запуску
setupWheel();
