(function () {
    // callMessagePage(1);
    // var url = new URL(window.location.href);

    // console.log(url);
})();


function callMessagePage(code) {
    

    var myWindow = window.open(`message.html?code=${code}`, `_self`);
    // myWindow.document.getElementById("confBoxMsg") = code;
}