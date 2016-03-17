(function () {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas');


    /**
     * функция получает поток видео
     *
     **/
    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true },
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function (e) {
                        video.play();

                        callback();
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };





    /**
     * функция применяет фильтр к изображению
     *
     *  @param {ImageData} imageData Объект ImageData, содержащий иформацию о пикселях холста
     *  в виде массива байт, количества строк пикселей изображения и количества пикселей в строке.
     **/
    var applyFilter = function (imageData) {
        var filterName = document.querySelector('.controls__filter').value;
        var source = imageData.data;
        var length = source.length;
        for (var i = 0; i < length; i += 4) {

            switch (filterName) {

                case "invert":
                    applyIvertFilter(source, i);
                    break;

                case "grayscale":
                    applyGrayscaleFilter(source, i);
                    break;

                case "threshold":
                    applyThresholdFilter(source, i);
                    break

            }
        }
        canvas.getContext('2d').putImageData(imageData, 0, 0);

    };


    /**
     * функция применяет фильтр Инвртировать к последвательности 3-х байт (пиксель) изображения
     *
     *  @param {CanvasPixelArray} source массив байт изображения объекта ImageData
     *  @param {number} i номер первого байта в тройке, которую нужно обработать
     **/
    var applyIvertFilter = function (source, i) {
        source[i] = 255 - source[i];
        source[i + 1] = 255 - source[i + 1];
        source[i + 2] = 255 - source[i + 2];
    };


    /**
     * функция применяет фильтр Оттенки серого к последвательности 3-х байт (пиксель) изображения
     *
     *  @param {CanvasPixelArray} source массив байт изображения объекта ImageData
     *  @param {number} i номер первого байта в тройке, которую нужно обработать
     **/
    var applyGrayscaleFilter = function (source, i) {
        var r = source[i];
        var g = source[i + 1];
        var b = source[i + 2];
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        source[i] = source[i + 1] = source[i + 2] = v;
    };



    /**
     * функция применяет фильтр Черно-белый к последвательности 3-х байт (пиксель) изображения
     *
     *  @param {CanvasPixelArray} source массив байт изображения объекта ImageData
     *  @param {number} i номер первого байта в тройке, которую нужно обработать
     **/
    var applyThresholdFilter = function (source, i) {
        var r = source[i];
        var g = source[i + 1];
        var b = source[i + 2];
        var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
        source[i] = source[i + 1] = source[i + 2] = v;
    };



    /**
     * функция показывает обработанное фильтром изображение
     *
     **/
    var captureFrame = function () {

        var width = video.videoWidth;
        var height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0);
        var imageData = context.getImageData(0, 0, width, height);
        applyFilter(imageData);
    };



    /**
     * функция обрабатывает поток видео с периодичностью в 16 милисекунд
     * (оптимальный интервал который пользователь не должен заметить)
     *
     **/
    getVideoStream(function () {
        captureFrame();
        setInterval(captureFrame, 16);
    });
})();
