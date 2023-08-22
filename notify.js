const message = document.querySelector(".notify__message--hidden")
const cross = document.querySelector(".notify__cross")
const textMsg = document.querySelector(".notify__text")

function showMessage(text) {
	textMsg.innerHTML = text
	message.classList.remove("notify__message--hidden")
	message.classList.add("notify__message")
}

function hideMessage() {
	message.classList.add("notify__message--hidden")
	message.classList.remove("notify__message")
}

cross.addEventListener("click", hideMessage)

let timeClose
setInterval(() => {
	if (message.classList.contains("notify__message")) {
		timeClose = setTimeout(hideMessage, 5000)
	}
}, 500)
