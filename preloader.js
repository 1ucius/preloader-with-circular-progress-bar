;////////////Preloader//////////

///////////Настройки прогресс бара прелоадера//////////
let settings = {
    preloaderBackground:          '#100f11', // Цвет фона прелоадера
    progressSize:                 325,       // Высота и ширина прогресс бара
    progressColor:                '#00FFFF', // Цвет линии
    progressOpacity:              .5,       // Прозрачность линии( от 0 до 1)
    textColor:                    '#00FFFF', // Цвет текста
    textOpacity:                  .5,       // Прозрачность текста ( от 0 до 1)
    lineWidth:                    4,         // Толщина линии(px)
    lineCap:                      'round',   // Стиль окончания линии прогресс бара: 'round' - закругленная; 'butt', 'square' - обрубленная
    preloaderAnimationDuration:   1000,      // Длина анимации(мс)
    startDegree:                  -90,       // Начальный угол прогресс бара(указывать только в градусах)
    finalDegree:                  270        // Конечный угол прогресс бара(указывать только в градусах)
}
////////////////////

///////////Добавление прелоадера на страницу//////////
function setAttributes(elem, attrs) {

    for(let key in attrs) {
        elem.setAttribute(key, attrs[key]);
    }

}

let preloader          = document.createElement('div'),
    canvas             = document.createElement('canvas'),
    progressPercentage = document.createElement('div');

setAttributes( preloader, { class: "preloader", id: 'preloader', style: 'transition: opacity ' + settings.preloaderAnimationDuration/1000 + 's' } );
setAttributes( canvas, { class: 'preloader__progress-bar', id: 'progress-bar' , width: settings.progressSize, height: settings.progressSize } );
setAttributes( progressPercentage, { class: 'preloader__progress-percentage', id: 'progress-percentage' } );

document.body.insertBefore(preloader, document.body.firstChild );
preloader.appendChild(canvas);
preloader.appendChild(progressPercentage);
////////////////////

///////////Переменные//////////
preloader          = document.getElementById('preloader');
progressPercentage = document.getElementById('progress-percentage');

let progressBar        = document.getElementById('progress-bar'),
    images             = document.images,
    imagesAmount       = images.length,
    imagesLoaded       = 0,
    barCtx             = progressBar.getContext('2d'),
    circleCenterX      = progressBar.width/2,
    circleCenterY      = progressBar.height/2,
    circleRadius       = circleCenterX - settings.lineWidth,
    degreesPerPercent  = 3.6,
    currentProgress    = 0,
    showedProgress     = 0,
    progressStep       = 0,
    progressDelta      = 0,
    startTime          = null,
    running;
////////////////////

/////////requestAnimationFrame crossbrowser fix////////
(function() {

    return requestAnimationFrame         ||
           mozRequestAnimationFrame      ||
           webkitRequestAnimationFrame   ||
           oRequestAnimationFrame        ||
           msRequestAnimationFrame       ||
           function(callback) {
               setTimeout(callback, 1000/60);
           };

})();
////////////////////

/////////Перевод градусов в радианы////////
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};
////////////////////

/////////Установка параметров прогресс бара из settings////////
progressPercentage.style.color   = settings.textColor;
progressPercentage.style.opacity = settings.textOpacity;
progressBar.style.opacity        = settings.progressOpacity;
barCtx.strokeStyle               = settings.progressColor;
barCtx.lineWidth                 = settings.lineWidth;
barCtx.lineCap                   = settings.lineCap;
let angleMultiplier              = ( Math.abs(settings.startDegree) + Math.abs(settings.finalDegree) )/360;
let startAngle                   = Math.radians(settings.startDegree);
document.body.style.overflowY    = 'hidden';/////////Запрет прокрутки body, пока виден прелоадер, т.е. во время загрузки страници
preloader.style.backgroundColor  = settings.preloaderBackground;
progressPercentage.innerHTML = '0';
////////////////////

/////////Описание события загрузки для каждой картинки на странице////////
for (let i = 0; i < imagesAmount; i++){

    let imageClone     = new Image();
    imageClone.onload  = onImageLoad;
    imageClone.onerror = onImageLoad;
    imageClone.src     = images[i].src;

}
////////////////////

/////////Срабатывает при загрузке каждой картинки,
/////////увеличивает процент общей загрузки страници,
/////////запускает анимацию прогресс бара(animate).
/////////Если новая картинка загрузилась до окончания предыдущей анимации прогресс бара
/////////останавливает цикл анимации animate, обновляет параметры для запуска анимации и вызывает animate
/////////Запускает hidePreloader, если все картинки загружены
function onImageLoad() {

    if (running === true) running = false;

    imagesLoaded++;

    if( imagesLoaded >= imagesAmount ) hidePreloader();

    progressStep = showedProgress;
    currentProgress = ( ( 100/imagesAmount ) * imagesLoaded ) << 0;
    progressDelta = currentProgress - showedProgress;

    setTimeout( function() {

        if (startTime === null) startTime = performance.now();
        running = true;
        animate();

    }, 10 );
   
}
////////////////////

/////////Анимация прогресс бара
function animate() {

    if (running === false){
        startTime = null;
        return;
    }

    let timeDelta = Math.min( 1, ( performance.now() - startTime )/settings.preloaderAnimationDuration );
    showedProgress = progressStep + (progressDelta * timeDelta);

    if (timeDelta < 1) {

        progressPercentage.innerHTML = Math.round(showedProgress);
        barCtx.clearRect(0, 0, progressBar.width, progressBar.height);
        barCtx.beginPath();
        barCtx.arc( circleCenterX, circleCenterY, circleRadius, startAngle, ( Math.radians( showedProgress * degreesPerPercent ) * angleMultiplier ) + startAngle );
        barCtx.stroke();
        requestAnimationFrame(animate);

    } else {
        startTime = null;
    }

}
////////////////////

/////////Скрытие прелоадера////////
function hidePreloader() {

    setTimeout(function() {

        preloader.classList.add('preloader_unvisible');
        document.body.style.overflowY = '';

    }, settings.preloaderAnimationDuration + 100);

}
////////////////////

////////////////////
