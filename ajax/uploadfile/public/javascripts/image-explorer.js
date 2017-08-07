window.onload = function () {
    var img = document.getElementById('img');
    var preBtn = document.getElementById('pre_btn');
    var nextBtn = document.getElementById('next_btn');

    var num = 0;
    img.setAttribute('width', document.documentElement.clientWidth);
    getImage();

    preBtn.onclick = function () {
        console.log(num)
        if (num == 0) {
            alert('没有了');
        }
        if (num > 0) {
            num--;
            getImage();
        }
    }

    nextBtn.onclick = function () {
        console.log(num)
        num++
        getImage();
    }

    function getImage() {
        var request = new XMLHttpRequest();
        request.open('get', '/image-explorer/img?n=' + num);
        request.onreadystatechange = function () {

            if (request.readyState === 4 && request.status === 200) {
                if (request.responseText.match(/^http/)) {
                    img.setAttribute('src', request.responseText);
                }
            }
            if (request.readyState === 4 && request.status === 404) {
                num--;
                alert('没有了');
            }
        }
        request.send();
    }
    window.onresize = function () {
        img.setAttribute('width', document.documentElement.clientWidth);
    }
    function getScrollbarWidth() {
        var oP = document.createElement('p'),
            styles = {
                width: '100px',
                height: '100px',
                overflowY: 'scroll'
            }, i, scrollbarWidth;
        for (i in styles) oP.style[i] = styles[i];
        document.body.appendChild(oP);
        scrollbarWidth = oP.offsetWidth - oP.clientWidth;
        oP.remove();
        return scrollbarWidth;
    }
}