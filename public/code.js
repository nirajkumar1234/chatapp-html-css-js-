
(function () {
    const app = document.querySelector(".app")
    const socket = io();
    let uname;
    let typing = false;

    app.querySelector("#join-user").addEventListener("click", function () {
        let username = app.querySelector("#username").value;
        if (username.length == 0) {
            return;
        }

        socket.emit("newuser", username);
        uname = username;

        app.querySelector(".join-screen").classList.remove("active")
        app.querySelector(".chat-screen").classList.add("active")
    })

    app.querySelector("#message-input").addEventListener("input", function () {
        if (!typing) {
            typing = true;
            socket.emit("typing", uname);
        }
    });

    app.querySelector("#message-input").addEventListener("blur", function () {
        if (typing) {
            typing = false;
            socket.emit("stop-typing", uname);
        }
    });

    app.querySelector("#send-message").addEventListener("click", function () {
        let message = app.querySelector("#message-input").value;

        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        })
        socket.emit("chat", {
            username: uname,
            text: message
        })
        app.querySelector("#message-input").value = "";
    })

    app.querySelector('#exit-chat').addEventListener("click", function () {
        socket.emit("exituser", uname)
        window.location.href = window.location.href;
    })

    socket.on("update", function (update) {
        renderMessage("update", update)
    })

    socket.on("chat", function (message) {
        renderMessage("other", message);
    })

    socket.on("typing", function (username) {
        let el = document.createElement("div");
        el.setAttribute("class", "typing");
        el.innerHTML = `${username} is typing...`;
        app.querySelector(".messages").appendChild(el);
    });

    socket.on("stop-typing", function (username) {
        let typingEl = app.querySelector(".typing");
        if (typingEl) {
            typingEl.remove();
        }
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".messages")
        if (type == "my") {
            let el = document.createElement("div")
            el.setAttribute("class", "message my-message")
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    
                    <div class="text">${message.text}</div>
                </div>
            `;

            messageContainer.appendChild(el);
        }
        else if (type == "other") {
            let el = document.createElement("div")
            el.setAttribute("class", "message other-message")
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    
                    <div class="text">${message.text}</div>
                </div>
            `;

            messageContainer.appendChild(el);
        }

        else if (type == "update") {
            let el = document.createElement("div")
            el.setAttribute("class", "update")
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;

    }
})();
const form = document.querySelector('.typebox');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent form from refreshing the page
    // your code to handle form submission goes here
});
