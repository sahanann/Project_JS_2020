
function getData(queries, callBacks) {
    xhr = getXMLHttpRequest();

    (function loop(i, length) {
        if (i>= length)
            return;
        
        var url = "php/getData.php?Query="+queries[i];
        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var response = xhr.responseText;
    
                if (response == "ERRSQL")
                    window.open(`message.html?code=0`, `_self`);
                else if (response == "NOTHING") 
                    callBacks[i](false);
                else if (response == "ERRQUERY")
                    window.open(`message.html?code=0`, `_self`);
                else 
                    callBacks[i](JSON.parse(xhr.responseText));

                loop(i + 1, length);
            }
        }

        xhr.send();

    })(0, queries.length);
}



function setData(queryList, msg) {
    xhr = getXMLHttpRequest();

    (function loop(i, length) {
        if (i>= length) {
            if (msg)
                window.open(`message.html?code=1`, `_self`);
            return;
        }
            
        
        var url = "php/insertData.php?Query="+queryList[i];
        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var response = xhr.responseText;
    
                if (response == "NOPE") {
                    window.open(`message.html?code=0`, `_self`);
                    return;
                }
                // if (response == "OK")
                //     isSet = true;

                loop(i + 1, length);
            }  
        }

        xhr.send();
    })(0, queryList.length)

    
}


function getXMLHttpRequest() {
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	
	return xhr;
}