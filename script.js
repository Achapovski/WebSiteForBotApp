/* делаем везде так, чтобы свойства width и height задавали не размеры контента, а размеры блока */
* {
  box-sizing: border-box;
}

/* общие настройки страницы */
body {
  /* подключаем сетку */
  display: grid;
  /* ставим всё по центру */
  place-items: center;
  /* если что-то не помещается на своё место — скрываем то, что не поместилось */
  overflow: hidden;
}

/* общий блок для всех элементов */
.deal-wheel {
  /* задаём переменные блока */
  /* размеры колеса */
  --size: clamp(250px, 80vmin, 700px);
  /* настройки яркости и заливки фона секторов */
  --lg-hs: 0 3%;
  --lg-stop: 50%;
  --lg: linear-gradient(
      hsl(var(--lg-hs) 0%) 0 var(--lg-stop),
      hsl(var(--lg-hs) 20%) var(--lg-stop) 100%
    );
  /* добавляем позиционирование относительно других элементов */
  position: relative;
  /* подключаем сетку */
  display: grid;
  grid-gap: calc(var(--size) / 20);
  /* выравниваем содержимое блока по центру */
  align-items: center;
  /* задаём имена областей внутри сетки */
  grid-template-areas:
    "spinner"
    "trigger";
  /* устанавливаем размер шрифта */
  font-size: calc(var(--size) / 20);
}

/* всё, что относится ко внутренним элементам главного блока, будет находиться в области сетки с названием spinner */
.deal-wheel > * {
  grid-area: spinner;
}

/* сам блок и кнопка будут находиться в области сетки с названием trigger и будут выровнены по центру */
.deal-wheel .btn-spin {
  grid-area: trigger;
  justify-self: center;
}

/* сектор колеса */
.spinner {
  /* добавляем относительное позиционирование */
  position: relative;
  /* подключаем сетку */
  display: grid;
  /* выравниваем всё по центру */
  align-items: center;
  /* добавляем элемент в сетку */
  grid-template-areas: "spinner";
  /* устанавливаем размеры */
  width: var(--size);
  height: var(--size);
  /* поворачиваем элемент  */
  transform: rotate(calc(var(--rotate, 25) * 1deg));
  /* рисуем круглую обводку, а всё, что не поместится, — будет скрыто за кругом */
  border-radius: 50%;
}

/* всё, что внутри этого блока, будет находиться в области сетки с названием spinner */
.spinner * {
  grid-area: spinner;
}

/* текст на секторах */
.prize {
  /* включаем «гибкую» вёрстку */
  display: flex;
  align-items: center;
  /* задаём отступы от краёв блока */
  padding: 1 calc(var(--size) / 25) 0 calc(var(--size) / 22);
  /* устанавливаем размеры */
  width: 43%;
  height: 50%;
  /* устанавливаем координаты, относительно которых будем вращать текст */
  transform-origin: center right;
  /* поворачиваем текст */
  transform: rotate(var(--rotate));
  /* запрещаем пользователю выделять мышкой текст на секторах */
  user-select: none;
}

/* язычок */
.ticker {
  /* добавляем относительное позиционирование */
  position: relative;
  /* устанавливаем размеры */
  left: calc(var(--size) / -15);
  width: calc(var(--size) / 10);
  height: calc(var(--size) / 20);
  /* фон язычка */
  background: var(--lg);
  /* делаем так, чтобы язычок был выше колеса */
  z-index: 1;
  /* форма язычка */
  clip-path: polygon(20% 0, 100% 50%, 20% 100%, 0% 50%);
  /* устанавливаем точку, относительно которой будет вращаться язычок при движении колеса */
  transform-origin: center left;
}

/* кнопка запуска колеса */
.btn-spin {
  color: white;
  background: black;
  border: none;
  /* берём размер шрифта такой же, как в колесе */
  font-size: inherit;
  /* добавляем отступы от текста внутри кнопки */
  padding: 0.9rem 2rem 1rem;
  /* скругляем углы */
  border-radius: 0.5rem;
  /* меняем внешний вид курсора над кнопкой на руку*/
  cursor: pointer;
}

/* если кнопка нажата и неактивна */
.btn-spin:disabled {
  /* меняем внешний вид курсора */
  cursor: progress;
  /* делаем кнопку полупрозрачной */
  opacity: 0.25;
}

/* анимация вращения */
.is-spinning .spinner {
  transition: transform 8s cubic-bezier(0.1, -0.01, 0, 1);
}

/* анимация движения язычка */
.is-spinning .ticker {
          animation: tick 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}


/* эффект, когда колесо задевает язычок при вращении */
@keyframes tick {
  40% {
    /* чуть поворачиваем язычок наверх в середине анимации */
    transform: rotate(-12deg);
  }
}

/* анимируем выпавший сектор */
.prize.selected .text {
  /* делаем текст белым */
  color: white;
  /* настраиваем длительность анимации */
  animation: selected 800ms ease;
}

/* настраиваем анимацию текста на выпавшем секторе по кадрам */
@keyframes selected {
  /* что происходит на 25% от начала анимации */
  25% {
    /* увеличиваем текст в 1,25 раза */
    transform: scale(1.25);
    /* добавляем тексту тень */
    text-shadow: 1vmin 1vmin 0 hsla(0 0% 0% / 0.1);
  }
  40% {
    transform: scale(0.92);
    text-shadow: 0 0 0 hsla(0 0% 0% / 0.2);
  }
  60% {
    transform: scale(1.02);
    text-shadow: 0.5vmin 0.5vmin 0 hsla(0 0% 0% / 0.1);
  }
  75% {
    transform: scale(0.98);
  }
  85% {
    transform: scale(1);
  }
}
