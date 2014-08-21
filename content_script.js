$('body').addClass('chrome_extension_ang');

document.body.onmouseup = function() {
    if (window.getSelection().type == "Range") {
        data = window.getSelection().anchorNode.data;
        chrome.extension.sendRequest({
            'data' : data
        }, function(response) {
        });
    }
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    $('#ang-ext').remove();
    $('.span_test').remove();

    console.log(request);
    if($('#ang-ext-container').length==0){
        $('body').prepend('<div id="ang-ext-container"></div>');
    }
    var speak_id = request.id;

    $('#ang-ext-container').append('<iframe id="ang-ext"></iframe>');
    $('#ang-ext').contents().find('body').html('<div id="angielski_ext_tooltip">' + request.data + '</div>');
    $('#ang-ext').contents().find('head').append('<link rel="stylesheet" href="' + chrome.extension.getURL('/styles.css') + '" type="text/css" />');
    $('#ang-ext').contents().find('body').attr('id', 'ang-ext-body');
    var height = ($('#ang-ext').contents().find('#angielski_ext_tooltip').height() + 10);
    if(height<130)
        height = 130;
    $('#ang-ext').css('height', height + 'px');

    console.log(chrome.extension.getURL('/styles.css'));
    var word_adress = request.url;

    $('#ang-ext').contents().find('#angielski_ext_tooltip .babAMore').attr('href', word_adress);
    $('#ang-ext').contents().find('#angielski_ext_tooltip .babAMore').attr('target', '_blank');

    var imgPlus = chrome.extension.getURL("/img/plus3.png");
    var imgAdded = chrome.extension.getURL("/img/added2.png");
    var imgSpeaker = chrome.extension.getURL("/img/speaker3.png");
    var imgOff = chrome.extension.getURL("/img/off2.png");

    $('#ang-ext').contents().find('body').find('#angielski_ext_tooltip').prepend('<span class="ext_off"><img src="' + imgOff + '"></span><span class="ext_added"><img src=' + imgAdded + '></span><span class="ext_add active"><img src=' + imgPlus + '></span><span class="ext_play"><img src=' + imgSpeaker + '></span>');

    $('#ang-ext').contents().find('.ext_off').click(function() {
        $('#ang-ext').remove();
        $('.span_test').remove();
    });

    $('#ang-ext').contents().find('.ext_add').click(function() {

        $('#ang-ext').contents().find('.ext_add').remove();
        $('#ang-ext').contents().find('.ext_added').show();
        //add add
        var optionTexts = [];
        $('#ang-ext').contents().find('#angielski_ext_tooltip .muted-link').each(function() {
            optionTexts.push($(this).text())
        });
        var en = $('#ang-ext').contents().find('.result-link').eq(0).text();
        var pl = optionTexts.join(';');
        var xhr3 = new XMLHttpRequest();
        xhr3.open("GET", "http://wordki.vot.pl/rest/increase/add/" + pl + "/" + en + "/0/" + speak_id, true);
        xhr3.send();
    });


    $('#ang-ext').contents().find('.ext_play').click(function() {
        babSpeakIt(speak_id);
    });

    babSpeakIt(speak_id);

    if (request.data != "")
        sendResponse({
            farewell : "goodbye"
        });
});

function babSpeakIt(id) {
    var url = 'http://pl.bab.la/sound/angielski/' + id + '.mp3';
    var a = !!(document.createElement('audio').canPlayType);
    var mp3 = false;
    if (a) {
        var babSO = document.createElement('audio');
        if (babSO.canPlayType) {
            mp3 = !!babSO.canPlayType && "" != babSO.canPlayType('audio/mpeg');
        }
    }
    if (mp3) {
        var ae;
        ae = new Audio("");
        document.body.appendChild(ae);
        ae.src = url;
        ae.addEventListener('canplay', function() {
            ae.play();
        }, false);
    } else {

    }
}

function insert_after_selection(html) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
        range = window.getSelection().getRangeAt(0);
        range.collapse(false);

        var el = document.createElement("div");
        el.innerHTML = html;
        var frag = document.createDocumentFragment(), node, lastNode;
        while (( node = el.firstChild)) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
    }
}
