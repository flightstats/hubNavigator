var currentUrl = document.URL;
var baseUrl = currentUrl.match(/http:\/\/hub-v2[a-z.]+\//g);
var baseChannel = currentUrl.match(/channel\/\w+/g);
console.log(baseChannel + " " + baseUrl);

function load(url,parameter){
		$.ajax({
			url: url+parameter,
			dataType: "json"
			}).done(function(data,textStatus,jqXHR){
				$('pre').html(syntaxHighlight(data));
				var newUrl = jqXHR.getResponseHeader('Link');
				newUrl = newUrl.match(/http:\/\/hub-v2[a-z.]+([\w\/])+\//g);
				$('pre').prepend('<h1>'+newUrl[0]+'</h1>');
				currentUrl = newUrl[0];
				console.log(currentUrl);
	});
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
                if (/http/.test(match)){
                	var link = match.replace(/['"]+/g, '');
        			match = "<a href='" + link + "'>" + match + "</a>";
       			}
            } 
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

$("body").prepend("<div id='hubMenu'><ul>");
$("#hubMenu").append("<li><button id='next'>Next</button></li>");
$("#hubMenu").append("<li><button id='previous'>Previous</button></li>");
$("#hubMenu").append("<li><button id='latest'>Latest</button></li>");
$("body").prepend("</ul></div>");
$("body").prepend("<h1 id='hubUrl'></h1>");
$("pre").html(syntaxHighlight($("pre").html()));

$("#next").click(function(){
		load(currentUrl,'next');
});

$(document).bind('keydown', 'ctrl+o', function(){
		load(currentUrl,'next');
});

$("#previous").click(function(){
		load(currentUrl,'previous');
});

$(document).bind('keydown','ctrl+i', function(){
		load(currentUrl,'previous');
});

$("#latest").click(function(){
		load(baseUrl+baseChannel,'latest');
});
$(document).bind('keydown', 'ctrl+l', function(){
		load(baseUrl+baseChannel,'latest');
});
