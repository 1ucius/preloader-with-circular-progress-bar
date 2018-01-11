;////////////Preloader//////////

///////////Настройки прогресс бара прелоадера//////////
let settings = {
    preloaderBackground:          '#100f11', // Цвет фона прелоадера
    progressSize:                 375,       // Высота и ширина прогресс бара
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwcmVsb2FkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiOy8vLy8vLy8vLy8vL1ByZWxvYWRlci8vLy8vLy8vLy9cclxuXHJcbi8vLy8vLy8vLy8v0J3QsNGB0YLRgNC+0LnQutC4INC/0YDQvtCz0YDQtdGB0YEg0LHQsNGA0LAg0L/RgNC10LvQvtCw0LTQtdGA0LAvLy8vLy8vLy8vXHJcbmxldCBzZXR0aW5ncyA9IHtcclxuICAgIHByZWxvYWRlckJhY2tncm91bmQ6ICAgICAgICAgICcjMTAwZjExJywgLy8g0KbQstC10YIg0YTQvtC90LAg0L/RgNC10LvQvtCw0LTQtdGA0LBcclxuICAgIHByb2dyZXNzU2l6ZTogICAgICAgICAgICAgICAgIDQwMCwgICAgICAgLy8g0JLRi9GB0L7RgtCwINC4INGI0LjRgNC40L3QsCDQv9GA0L7Qs9GA0LXRgdGBINCx0LDRgNCwXHJcbiAgICBwcm9ncmVzc0NvbG9yOiAgICAgICAgICAgICAgICAnIzAwRkZGRicsIC8vINCm0LLQtdGCINC70LjQvdC40LhcclxuICAgIHByb2dyZXNzT3BhY2l0eTogICAgICAgICAgICAgIC4xNSwgICAgICAgLy8g0J/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINC70LjQvdC40LgoINC+0YIgMCDQtNC+IDEpXHJcbiAgICB0ZXh0Q29sb3I6ICAgICAgICAgICAgICAgICAgICAnIzAwRkZGRicsIC8vINCm0LLQtdGCINGC0LXQutGB0YLQsFxyXG4gICAgdGV4dE9wYWNpdHk6ICAgICAgICAgICAgICAgICAgLjE1LCAgICAgICAvLyDQn9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0YLQtdC60YHRgtCwICgg0L7RgiAwINC00L4gMSlcclxuICAgIGxpbmVXaWR0aDogICAgICAgICAgICAgICAgICAgIDQsICAgICAgICAgLy8g0KLQvtC70YnQuNC90LAg0LvQuNC90LjQuChweClcclxuICAgIGxpbmVDYXA6ICAgICAgICAgICAgICAgICAgICAgICdyb3VuZCcsICAgLy8g0KHRgtC40LvRjCDQvtC60L7QvdGH0LDQvdC40Y8g0LvQuNC90LjQuCDQv9GA0L7Qs9GA0LXRgdGBINCx0LDRgNCwOiAncm91bmQnIC0g0LfQsNC60YDRg9Cz0LvQtdC90L3QsNGPOyAnYnV0dCcsICdzcXVhcmUnIC0g0L7QsdGA0YPQsdC70LXQvdC90LDRj1xyXG4gICAgcHJlbG9hZGVyQW5pbWF0aW9uRHVyYXRpb246ICAgMTAwMCwgICAgICAvLyDQlNC70LjQvdCwINCw0L3QuNC80LDRhtC40Lgo0LzRgSlcclxuICAgIHN0YXJ0RGVncmVlOiAgICAgICAgICAgICAgICAgIC05MCwgICAgICAgLy8g0J3QsNGH0LDQu9GM0L3Ri9C5INGD0LPQvtC7INC/0YDQvtCz0YDQtdGB0YEg0LHQsNGA0LAo0YPQutCw0LfRi9Cy0LDRgtGMINGC0L7Qu9GM0LrQviDQsiDQs9GA0LDQtNGD0YHQsNGFKVxyXG4gICAgZmluYWxEZWdyZWU6ICAgICAgICAgICAgICAgICAgMjcwICAgICAgICAvLyDQmtC+0L3QtdGH0L3Ri9C5INGD0LPQvtC7INC/0YDQvtCz0YDQtdGB0YEg0LHQsNGA0LAo0YPQutCw0LfRi9Cy0LDRgtGMINGC0L7Qu9GM0LrQviDQsiDQs9GA0LDQtNGD0YHQsNGFKVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vLy8vLy8vLy8vL9CU0L7QsdCw0LLQu9C10L3QuNC1INC/0YDQtdC70L7QsNC00LXRgNCwINC90LAg0YHRgtGA0LDQvdC40YbRgy8vLy8vLy8vLy9cclxuZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbGVtLCBhdHRycykge1xyXG5cclxuICAgIGZvcihsZXQga2V5IGluIGF0dHJzKSB7XHJcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmxldCBwcmVsb2FkZXIgICAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgIGNhbnZhcyAgICAgICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLFxyXG4gICAgcHJvZ3Jlc3NQZXJjZW50YWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG5zZXRBdHRyaWJ1dGVzKCBwcmVsb2FkZXIsIHsgY2xhc3M6IFwicHJlbG9hZGVyXCIsIGlkOiAncHJlbG9hZGVyJywgc3R5bGU6ICd0cmFuc2l0aW9uOiBvcGFjaXR5ICcgKyBzZXR0aW5ncy5wcmVsb2FkZXJBbmltYXRpb25EdXJhdGlvbi8xMDAwICsgJ3MnIH0gKTtcclxuc2V0QXR0cmlidXRlcyggY2FudmFzLCB7IGNsYXNzOiAncHJlbG9hZGVyX19wcm9ncmVzcy1iYXInLCBpZDogJ3Byb2dyZXNzLWJhcicgLCB3aWR0aDogc2V0dGluZ3MucHJvZ3Jlc3NTaXplLCBoZWlnaHQ6IHNldHRpbmdzLnByb2dyZXNzU2l6ZSB9ICk7XHJcbnNldEF0dHJpYnV0ZXMoIHByb2dyZXNzUGVyY2VudGFnZSwgeyBjbGFzczogJ3ByZWxvYWRlcl9fcHJvZ3Jlc3MtcGVyY2VudGFnZScsIGlkOiAncHJvZ3Jlc3MtcGVyY2VudGFnZScgfSApO1xyXG5cclxuZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUocHJlbG9hZGVyLCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQgKTtcclxucHJlbG9hZGVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbnByZWxvYWRlci5hcHBlbmRDaGlsZChwcm9ncmVzc1BlcmNlbnRhZ2UpO1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8vLy8vLy8vLy/Qn9C10YDQtdC80LXQvdC90YvQtS8vLy8vLy8vLy9cclxucHJlbG9hZGVyICAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlcicpO1xyXG5wcm9ncmVzc1BlcmNlbnRhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZ3Jlc3MtcGVyY2VudGFnZScpO1xyXG5cclxubGV0IHByb2dyZXNzQmFyICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9ncmVzcy1iYXInKSxcclxuICAgIGltYWdlcyAgICAgICAgICAgICA9IGRvY3VtZW50LmltYWdlcyxcclxuICAgIGltYWdlc0Ftb3VudCAgICAgICA9IGltYWdlcy5sZW5ndGgsXHJcbiAgICBpbWFnZXNMb2FkZWQgICAgICAgPSAwLFxyXG4gICAgYmFyQ3R4ICAgICAgICAgICAgID0gcHJvZ3Jlc3NCYXIuZ2V0Q29udGV4dCgnMmQnKSxcclxuICAgIGNpcmNsZUNlbnRlclggICAgICA9IHByb2dyZXNzQmFyLndpZHRoLzIsXHJcbiAgICBjaXJjbGVDZW50ZXJZICAgICAgPSBwcm9ncmVzc0Jhci5oZWlnaHQvMixcclxuICAgIGNpcmNsZVJhZGl1cyAgICAgICA9IGNpcmNsZUNlbnRlclggLSBzZXR0aW5ncy5saW5lV2lkdGgsXHJcbiAgICBkZWdyZWVzUGVyUGVyY2VudCAgPSAzLjYsXHJcbiAgICBjdXJyZW50UHJvZ3Jlc3MgICAgPSAwLFxyXG4gICAgc2hvd2VkUHJvZ3Jlc3MgICAgID0gMCxcclxuICAgIHByb2dyZXNzU3RlcCAgICAgICA9IDAsXHJcbiAgICBwcm9ncmVzc0RlbHRhICAgICAgPSAwLFxyXG4gICAgc3RhcnRUaW1lICAgICAgICAgID0gbnVsbCxcclxuICAgIHJ1bm5pbmc7XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vLy8vLy8vLy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgY3Jvc3Nicm93c2VyIGZpeC8vLy8vLy8vXHJcbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgICAgfHxcclxuICAgICAgICAgICBtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICB8fFxyXG4gICAgICAgICAgIHdlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSAgIHx8XHJcbiAgICAgICAgICAgb1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICAgfHxcclxuICAgICAgICAgICBtc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxyXG4gICAgICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAvNjApO1xyXG4gICAgICAgICAgIH07XHJcblxyXG59KSgpO1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8vLy8vLy8v0J/QtdGA0LXQstC+0LQg0LPRgNCw0LTRg9GB0L7QsiDQsiDRgNCw0LTQuNCw0L3Riy8vLy8vLy8vXHJcbk1hdGgucmFkaWFucyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcclxuICAgIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcclxufTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vLy8vLy8vL9Cj0YHRgtCw0L3QvtCy0LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQv9GA0L7Qs9GA0LXRgdGBINCx0LDRgNCwINC40Lcgc2V0dGluZ3MvLy8vLy8vL1xyXG5wcm9ncmVzc1BlcmNlbnRhZ2Uuc3R5bGUuY29sb3IgICA9IHNldHRpbmdzLnRleHRDb2xvcjtcclxucHJvZ3Jlc3NQZXJjZW50YWdlLnN0eWxlLm9wYWNpdHkgPSBzZXR0aW5ncy50ZXh0T3BhY2l0eTtcclxucHJvZ3Jlc3NCYXIuc3R5bGUub3BhY2l0eSAgICAgICAgPSBzZXR0aW5ncy5wcm9ncmVzc09wYWNpdHk7XHJcbmJhckN0eC5zdHJva2VTdHlsZSAgICAgICAgICAgICAgID0gc2V0dGluZ3MucHJvZ3Jlc3NDb2xvcjtcclxuYmFyQ3R4LmxpbmVXaWR0aCAgICAgICAgICAgICAgICAgPSBzZXR0aW5ncy5saW5lV2lkdGg7XHJcbmJhckN0eC5saW5lQ2FwICAgICAgICAgICAgICAgICAgID0gc2V0dGluZ3MubGluZUNhcDtcclxubGV0IGFuZ2xlTXVsdGlwbGllciAgICAgICAgICAgICAgPSAoIE1hdGguYWJzKHNldHRpbmdzLnN0YXJ0RGVncmVlKSArIE1hdGguYWJzKHNldHRpbmdzLmZpbmFsRGVncmVlKSApLzM2MDtcclxubGV0IHN0YXJ0QW5nbGUgICAgICAgICAgICAgICAgICAgPSBNYXRoLnJhZGlhbnMoc2V0dGluZ3Muc3RhcnREZWdyZWUpO1xyXG5kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93WSAgICA9ICdoaWRkZW4nOy8vLy8vLy8vL9CX0LDQv9GA0LXRgiDQv9GA0L7QutGA0YPRgtC60LggYm9keSwg0L/QvtC60LAg0LLQuNC00LXQvSDQv9GA0LXQu9C+0LDQtNC10YAsINGCLtC1LiDQstC+INCy0YDQtdC80Y8g0LfQsNCz0YDRg9C30LrQuCDRgdGC0YDQsNC90LjRhtC4XHJcbnByZWxvYWRlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgID0gc2V0dGluZ3MucHJlbG9hZGVyQmFja2dyb3VuZDtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vLy8vLy8vL9Ce0L/QuNGB0LDQvdC40LUg0YHQvtCx0YvRgtC40Y8g0LfQsNCz0YDRg9C30LrQuCDQtNC70Y8g0LrQsNC20LTQvtC5INC60LDRgNGC0LjQvdC60Lgg0L3QsCDRgdGC0YDQsNC90LjRhtC1Ly8vLy8vLy9cclxuZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZXNBbW91bnQ7IGkrKyl7XHJcblxyXG4gICAgbGV0IGltYWdlQ2xvbmUgICAgID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZUNsb25lLm9ubG9hZCAgPSBvbkltYWdlTG9hZDtcclxuICAgIGltYWdlQ2xvbmUub25lcnJvciA9IG9uSW1hZ2VMb2FkO1xyXG4gICAgaW1hZ2VDbG9uZS5zcmMgICAgID0gaW1hZ2VzW2ldLnNyYztcclxuXHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vLy8vLy8vL9Ch0YDQsNCx0LDRgtGL0LLQsNC10YIg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0LrQsNC20LTQvtC5INC60LDRgNGC0LjQvdC60LgsXHJcbi8vLy8vLy8vL9GD0LLQtdC70LjRh9C40LLQsNC10YIg0L/RgNC+0YbQtdC90YIg0L7QsdGJ0LXQuSDQt9Cw0LPRgNGD0LfQutC4INGB0YLRgNCw0L3QuNGG0LgsXHJcbi8vLy8vLy8vL9C30LDQv9GD0YHQutCw0LXRgiDQsNC90LjQvNCw0YbQuNGOINC/0YDQvtCz0YDQtdGB0YEg0LHQsNGA0LAoYW5pbWF0ZSkuXHJcbi8vLy8vLy8vL9CV0YHQu9C4INC90L7QstCw0Y8g0LrQsNGA0YLQuNC90LrQsCDQt9Cw0LPRgNGD0LfQuNC70LDRgdGMINC00L4g0L7QutC+0L3Rh9Cw0L3QuNGPINC/0YDQtdC00YvQtNGD0YnQtdC5INCw0L3QuNC80LDRhtC40Lgg0L/RgNC+0LPRgNC10YHRgSDQsdCw0YDQsFxyXG4vLy8vLy8vLy/QvtGB0YLQsNC90LDQstC70LjQstCw0LXRgiDRhtC40LrQuyDQsNC90LjQvNCw0YbQuNC4IGFuaW1hdGUsINC+0LHQvdC+0LLQu9GP0LXRgiDQv9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPINC30LDQv9GD0YHQutCwINCw0L3QuNC80LDRhtC40Lgg0Lgg0LLRi9C30YvQstCw0LXRgiBhbmltYXRlXHJcbi8vLy8vLy8vL9CX0LDQv9GD0YHQutCw0LXRgiBoaWRlUHJlbG9hZGVyLCDQtdGB0LvQuCDQstGB0LUg0LrQsNGA0YLQuNC90LrQuCDQt9Cw0LPRgNGD0LbQtdC90YtcclxuZnVuY3Rpb24gb25JbWFnZUxvYWQoKSB7XHJcblxyXG4gICAgaWYgKHJ1bm5pbmcgPT09IHRydWUpIHJ1bm5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICBpbWFnZXNMb2FkZWQrKztcclxuXHJcbiAgICAvL2lmKCBpbWFnZXNMb2FkZWQgPj0gaW1hZ2VzQW1vdW50ICkgaGlkZVByZWxvYWRlcigpO1xyXG5cclxuICAgIHByb2dyZXNzU3RlcCA9IHNob3dlZFByb2dyZXNzO1xyXG4gICAgY3VycmVudFByb2dyZXNzID0gKCAoIDEwMC9pbWFnZXNBbW91bnQgKSAqIGltYWdlc0xvYWRlZCApIDw8IDA7XHJcbiAgICBwcm9ncmVzc0RlbHRhID0gY3VycmVudFByb2dyZXNzIC0gc2hvd2VkUHJvZ3Jlc3M7XHJcblxyXG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmIChzdGFydFRpbWUgPT09IG51bGwpIHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIGFuaW1hdGUoKTtcclxuXHJcbiAgICB9LCAxMCApO1xyXG4gICBcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8vLy8vLy8v0JDQvdC40LzQsNGG0LjRjyDQv9GA0L7Qs9GA0LXRgdGBINCx0LDRgNCwXHJcbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcblxyXG4gICAgaWYgKHJ1bm5pbmcgPT09IGZhbHNlKXtcclxuICAgICAgICBzdGFydFRpbWUgPSBudWxsO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZURlbHRhID0gTWF0aC5taW4oIDEsICggcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFRpbWUgKS9zZXR0aW5ncy5wcmVsb2FkZXJBbmltYXRpb25EdXJhdGlvbiApO1xyXG4gICAgc2hvd2VkUHJvZ3Jlc3MgPSBwcm9ncmVzc1N0ZXAgKyAocHJvZ3Jlc3NEZWx0YSAqIHRpbWVEZWx0YSk7XHJcblxyXG4gICAgaWYgKHRpbWVEZWx0YSA8IDEpIHtcclxuXHJcbiAgICAgICAgcHJvZ3Jlc3NQZXJjZW50YWdlLmlubmVySFRNTCA9IE1hdGgucm91bmQoc2hvd2VkUHJvZ3Jlc3MpO1xyXG4gICAgICAgIGJhckN0eC5jbGVhclJlY3QoMCwgMCwgcHJvZ3Jlc3NCYXIud2lkdGgsIHByb2dyZXNzQmFyLmhlaWdodCk7XHJcbiAgICAgICAgYmFyQ3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGJhckN0eC5hcmMoIGNpcmNsZUNlbnRlclgsIGNpcmNsZUNlbnRlclksIGNpcmNsZVJhZGl1cywgc3RhcnRBbmdsZSwgKCBNYXRoLnJhZGlhbnMoIHNob3dlZFByb2dyZXNzICogZGVncmVlc1BlclBlcmNlbnQgKSAqIGFuZ2xlTXVsdGlwbGllciApICsgc3RhcnRBbmdsZSApO1xyXG4gICAgICAgIGJhckN0eC5zdHJva2UoKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzdGFydFRpbWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8vLy8vLy8v0KHQutGA0YvRgtC40LUg0L/RgNC10LvQvtCw0LTQtdGA0LAvLy8vLy8vL1xyXG5mdW5jdGlvbiBoaWRlUHJlbG9hZGVyKCkge1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHByZWxvYWRlci5jbGFzc0xpc3QuYWRkKCdwcmVsb2FkZXJfdW52aXNpYmxlJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvd1kgPSAnJztcclxuXHJcbiAgICB9LCBzZXR0aW5ncy5wcmVsb2FkZXJBbmltYXRpb25EdXJhdGlvbiArIDEwMCk7XHJcblxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLyJdLCJmaWxlIjoicHJlbG9hZGVyLmpzIn0=
