(() => {
    document.getElementById("confirmBtn").addEventListener("click", () => {
        var check = true;

        var username = document.getElementById("usernameInput");
        check = champsVerif.vide(username);

        var password = document.getElementById("passwordInput");
        check = champsVerif.vide(password);

        if (check != false) {
            if (username.value === "admin" && password.value === "admin")
                window.open(`admin.html`, `_self`);
            else {
                document.getElementById("usernameInputErr").innerText = "Error non d'utilisateur";
                document.getElementById("passwordInputErr").innerText = "Error mot de passe";
            }
        }
    });
})();