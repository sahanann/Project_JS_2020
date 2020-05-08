

function getData(query, callBack) {
    var url = "php/getData.php?Query="+query;

    xhr = getXMLHttpRequest();
    xhr.open("GET", url, true);
    
    xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			var response = xhr.responseText;

			if (response == "ERRSQL")
				alert("Err conexion bd");
			else if (response == "NOTHING") 
                callBack(false);
			else if (response == "ERRQUERY")
				alert("Err Query");
			else 
                callBack(JSON.parse(xhr.responseText));
		}
    }

    xhr.send();
}

function setData(queryList) {
    // var url = "php/insertData.php?Query="+query;

    xhr = getXMLHttpRequest();

    (function loop(i, length) {
        if (i>= length)
            return;
        
        var url = "php/insertData.php?Query="+queryList[i];
        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var response = xhr.responseText;
    
                if (response == "NOPE") {
                    alert(`Problème avec le serveur ${response}`);
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