window.onload = function () {
    var uploadBtn = document.getElementById('upload_btn');
    var imgFile = document.getElementById('img_file');
    var msg = document.getElementById('msg');

    uploadBtn.addEventListener('click', uploadBtnClickHandler);
    imgFile.addEventListener('change', imgFileChangeHandler);


    //------------------//
    function upload(file) {
        var request = new XMLHttpRequest();
        let formData = new FormData();
        formData.append('img', file);
        request.open('post', '/upload');
        //
        request.onreadystatechange = function () {
            //如果请求完成
            if (request.readyState === 4 && request.status === 200) {
                //取得Content-Type
                var type = request.getResponseHeader('Content-Type');
                //如果Content-Type是text
                if (type.match(/^text/)) {
                    if (request.responseText.match(/^http/)) {
                        clearFile('img_file');
                        window.location = request.responseText;
                    } else {
                        alert(request.responseText);
                    }

                }
            }
        }
        //request.setRequestHeader('Content-Type', 'multipart/form-data');
        request.send(formData);
    }
    function uploadBtnClickHandler() {
        var file = imgFile.files[0];
        if (!file) {
            return;
        }
        if (!imgFileChangeHandler()) {
            return;
        }
        upload(file);
    }
    function imgFileChangeHandler() {
        var file = imgFile.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                msg.innerHTML = '文件太大';
                return false;
            }
            if ('.jpg.jpeg.gif.png'.indexOf(file.type.split('/')[1]) === -1) {
                msg.innerHTML = '不被允许的文件类型';
                return false;
            }
            msg.innerHTML = '已选择文件:' + file.name;
            return true;
        }
    }
    function clearFile(id) {
        let file = document.getElementById(id);
        //IE，Safari，chrome
        if (file.outerHTML) {
            file.outerHTML = file.outerHTML;
        }
        else {      //FF
            file.value = "";
        }
    }
}
