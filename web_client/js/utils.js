function httpPostAsync(url, json, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200)
            callback(xhr.responseText)
    }
    xhr.open("POST", url, true) 
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(json))
}

function removeCookies() {
    var res = document.cookie
    var multiple = res.split(';')
    for (var i = 0; i < multiple.length; i++) {
       var key = multiple[i].split('=')
       document.cookie = key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC'
    }
}