var context_get;

function onRequest(request, sender, sendResponse) {
  sendResponse({});
  console.log(request);
  context_get=request.data;
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

function genericOnClick(info, tab) {
   // console.log("item " + info.menuItemId + " was clicked");
   // console.log("info: " + JSON.stringify(info));
   // console.log("tab: " + JSON.stringify(tab));
   
 /*   var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://elmccd.pl/angielski/api.php?a=" + info.selectionText, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = xhr.responseText;
        chrome.tabs.sendMessage(tab.id, {data: resp}, function(response) {
           console.log(response);
        });
      }
    }
    xhr.send();
    */
    console.log("Słówko: "  + info.selectionText);
    console.log("Kontekst: " + context_get);
    
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://pl.bab.la/slownik/angielski-polski/" + info.selectionText, true);
    xhr2.onreadystatechange = function() {
      if (xhr2.readyState == 4) {
        var resp = xhr2.responseText;
        resp=resp.split("Streszczenie</h4>");
        
        resp_id=resp[1].split("javascript:babSpeakIt('angielski',");
        resp_id=resp_id[1].split(")");
        resp_id=resp_id[0];
        
        resp=resp[1].split('<div class="fb-like-wrapper"');
        resp=resp[0].split('<div class="quick-result-section"');
        resp=resp[0];
        
        var url="http://pl.bab.la/slownik/angielski-polski/" + info.selectionText;
        console.log(resp);
        console.log(resp_id);
        
        //add view
        var xhr3 = new XMLHttpRequest();
        xhr3.open("GET", "http://wordki.vot.pl/rest/increase/view", true);
        xhr3.send();
        
        
        chrome.tabs.sendMessage(tab.id, {data: resp, id: resp_id, url:url, context:context_get}, function(response) {
           
        });
      }
    }
    xhr2.send();
    
    //alert("Słówko: "  + info.selectionText + "\nKontekst: " + get_context(info.selectionText, context_get));

}

/**
 * Select context from text - all sentences with translating word
 * 
 * @param {String} Word we want to translate
 * @param {String} Parent element of word - context
 */
function get_context(word, context){
   //Replace special chars to chars add unique breakpoint to safe ?!.
    context = context.replace(/\!/g,'.888break888');
    context = context.replace(/\:/g,'.888break888');
    context = context.replace(/\?/g,'.888break888');
    context = context.replace(/\./g,'.888break888');
   //console.log(context);
   var result = context.split("888break888"); //Split for sentences
   //return result;
   var sentences = [];
   for(var i=0, j=result.length; i< j; i++){
     if(result[i].indexOf(word) !== -1){
        sentences.push($.trim(result[i]))
     }
   };
   return sentences[0];
}
  
// Translating selections
var id = chrome.contextMenus.create({
    "title" : "Tłumacz zaznaczenie",
    "contexts" : ["selection"],
    "onclick" : genericOnClick
});



// Default menu
var parent = chrome.contextMenus.create({
    "title" : "Angielski",
    "onclick" : function(){
        chrome.tabs.create({url: 'http://wordki.vot.pl/'});
    }
});
/*var child1 = chrome.contextMenus.create({
    "title" : "Przeglądaj słówka",
    "parentId" : parent,
    "onclick" : function(){}
});
var child2 = chrome.contextMenus.create({
    "title" : "Tłumacz stronę",
    "parentId" : parent,
    "onclick" : function(){}
});*/