const rangeSelect = document.querySelector("#test")
const btn = document.querySelector("#btn")
const info = document.querySelector(".info__content")

let sign
let canvas = document.getElementById("example")
canvas.width = 1000
canvas.height = 1000
canvas.style.backgroundColor = "lightblue"
ctx = canvas.getContext("2d")

btn.addEventListener("click", () => {
	let w = document.querySelector("#num1").value
	let h = document.querySelector("#num2").value
	let scale = +rangeSelect.value
	sign = new Sign(w, h, scale)
	main()
	infoAboutSign()
})

rangeSelect.addEventListener("change", (event) => {
	document.querySelector("#scaleValue").innerText = event.target.value
	if (sign) {
		sign.scale = +event.target.value
		btn.click()
		main()
	}
})

class Line {
	constructor(x_start, y_start, x_end, y_end, cornerType) {
		this.x0 = x_start
		this.y0 = y_start
		this.x1 = x_end
		this.y1 = y_end
		this.lineCornerType = cornerType
	}
}

class Sign {
	constructor(width, height, scale) {
		this.width = Number(width)
		this.height = Number(height)
		this.cornerType //тип уголка знака
		this.verticalLines = []
		this.horizontalLines = []
		this.dx = 10 //смещение от края canvas
		this.dy = 10 //смещение от края canvas
		this.scale = scale /* Коэффициент масштабирования */
		this.isDublicate = false /* является ли знак дублирующим (состоящим из двух маленьких) */
		this.secondSign
		this.verticalStep /*вертикальный шаг линий */
		this.horizontalStep /*горизонтальный шаг линий*/
	}

	/* рассчет линий знака */
	calculate() {
		if (this.height / this.scale >= 4600 / this.scale) {
			showMessage("Знак не может быть высотой больше чем 4600")
		} else if (this.width / this.scale >= 4000 / this.scale) {
			this.cornerType = 45
			if (
				this.height / this.scale >= 1250 / this.scale &&
				this.height / this.scale <= 2300 / this.scale
			) {
				/* Создаем вертикальные линии*/
				this.verticalStep = 1250 / this.scale
				let x_start = 1250 / this.scale /*точка старта*/
				for (
					let i = 0;
					i < Math.floor(this.width / this.scale / this.verticalStep);
					i++
				) {
					this.createVerticalLine(
						x_start,
						0,
						x_start,
						this.height / this.scale,
						35
					)
					x_start += this.verticalStep
				}

				/* Создаем горизонтальные линии, в данном случае она 1 в позиции h/2 */
				this.horizontalStep = this.height / 2 / this.scale
				/* x0 - 0, y0 - h/2, x1 - width, y1 - h/2 */
				this.createHorizontalLine(
					0,
					this.horizontalStep,
					this.width / this.scale,
					this.horizontalStep,
					25
				)
			} else {
				//this.height / this.scale >= 1200 / this.scale && this.height / this.scale < 2300)
				if (false) {
					/* Создаем вертикальные линии */
					/* !!!!!!!!!!!! код ниже неверный, надо обсуждать ТЗ снова */
					console.log("Уточнить ТЗ")
				} else if (this.height / this.scale >= 2300 / this.scale) {
					console.log("Знак делится на две части")
					showMessage("Знак делится на две части!!!!!")
					this.isDublicate = true
					this.height = this.height / 2
					this.calculate() //перерасчет для знака
				}
			}
		} else if (
			this.width / this.scale <= 4000 / this.scale &&
			this.width / this.scale >= 2250 / this.scale
		) {
			if (this.height / this.scale >= 1200 / this.scale) {
				this.cornerType = 35 /* тип каркаса */
				/* создаем вертикальные линии  */
				this.verticalStep = 1250 / this.scale
				let x_start = 1250 / this.scale /*точка старта*/
				for (
					let i = 0;
					i < Math.floor(this.width / this.scale / this.verticalStep);
					i++
				) {
					this.createVerticalLine(
						x_start,
						0,
						x_start,
						this.height / this.scale,
						35
					)
					x_start += this.verticalStep
				}

				/* Создаем горизонтальные линии, в данном случае она 1 в позиции h/2 */
				this.horizontalStep = this.height / 2 / this.scale
				/* x0 - 0, y0 - h/2, x1 - width, y1 - h/2 */
				this.createHorizontalLine(
					0,
					this.horizontalStep,
					this.width / this.scale,
					this.horizontalStep,
					25
				)
			} else {
				console.log("Высота не может быть меньше чем 1200-1250")
				showMessage("Высота не может быть меньше чем 1200-1250!!!")
			}
		} else if (
			this.width / this.scale <= 2250 / this.scale &&
			this.width / this.scale >= 1000 / this.scale
		) {
			if (
				this.height / this.scale <= 1500 / this.scale &&
				this.height / this.scale >= 1200 / this.scale
			) {
				this.cornerType = 25
				/* Создаем вертикальные линии*/
				this.verticalStep = this.width / 2 / this.scale
				let x_start = this.width / 2 / this.scale /*точка старта*/
				this.createVerticalLine(
					x_start,
					0,
					x_start,
					this.height / this.scale,
					25
				)
				x_start += this.verticalStep
			}
		} else {
			console.log("Длина не может быть меньше чем 1000")
			showMessage("Длина не может быть меньше чем 1000")
		}

		if (this.width < 1000 || this.height < 1200) {
			showMessage(
				"Введены некорректные данные! Длина не меньше чем 1000, высота не меньше чем 1200"
			)
		}
	}

	draw(ctx) {
		ctx.clearRect(0, 0, 1500, 1500) /*Чистим поле*/
		if (this.isDublicate) {
			this.drawSign(ctx, 0)
			ctx.fillStyle = "#00F"
			ctx.font = "bold 20pt Arial"
			ctx.fillText("X2", this.width / this.scale + 10, this.height / this.scale)
		} else {
			this.drawSign(ctx, 0)
		}
	}

	drawSign(ctx, dy) {
		ctx.lineWidth = 4
		ctx.strokeStyle = "blue"
		ctx.strokeRect(
			0,
			0 + dy,
			this.width / this.scale,
			this.height / this.scale + dy
		)

		/* стили текста */
		ctx.fillStyle = "#00F"
		ctx.font = "bold 8pt Arial"

		ctx.fillText(String(this.cornerType), 2, 12 + dy)

		/* отрисовка вертикальных */
		ctx.beginPath()

		ctx.lineWidth = 2
		ctx.strokeStyle = "red"

		ctx.fillStyle = "#d08d8d"
		ctx.font = "bold 8pt Arial"

		for (let line of this.verticalLines) {
			ctx.moveTo(line.x0, line.y0 + dy) // перемещаемся в стартовую позицию
			ctx.lineTo(line.x1, line.y1 + dy) // перемещаемся в стартовую позицию
			ctx.stroke()
			ctx.fillText(String(line.lineCornerType), line.x0 + 2, line.y0 + 12 + dy)
		}

		/* отрисовка горизонтальных */
		if (this.horizontalLines.length != 0) {
			ctx.beginPath()

			ctx.lineWidth = 2
			ctx.strokeStyle = "green"

			ctx.fillStyle = "#008000"
			ctx.font = "bold 8pt Arial"
			for (let line of this.horizontalLines) {
				ctx.moveTo(line.x0, line.y0 + dy) // перемещаемся в стартовую позицию
				ctx.lineTo(line.x1, line.y1 + dy) // перемещаемся в стартовую позицию
				ctx.stroke()
				ctx.fillText(
					String(line.lineCornerType),
					line.x0 + 2,
					line.y0 + 12 + dy
				)
			}
		}
	}

	createLine(x0, y0, x1, y1, cornerType) {
		return new Line(x0, y0, x1, y1, cornerType)
	}

	createVerticalLine(x0, y0, x1, y1, cornerType) {
		this.verticalLines.push(this.createLine(x0, y0, x1, y1, cornerType))
	}
	createHorizontalLine(x0, y0, x1, y1, cornerType) {
		this.horizontalLines.push(this.createLine(x0, y0, x1, y1, cornerType))
	}
}

function infoAboutSign() {
	document.querySelector(".info__width").innerHTML =
		"Ширина: " + String(sign.width).bold() + " мм."
	document.querySelector(".info__height").innerHTML =
		"Высота: " + String(sign.height).bold() + " мм."
	document.querySelector(".info__type").innerHTML =
		"Тип каркаса: " + String(sign.cornerType).bold()

	document.querySelector(".info__dublicate").innerHTML =
		"Знак делится пополам: " + String(sign.isDublicate).bold()

	let verticalRes = ""
	let j = 0
	for (let i of sign.verticalLines) {
		j += 1
		verticalRes +=
			"<b>" +
			`линия ${j}` +
			"</b>" +
			" x0: " +
			'<b class="red">' +
			Math.floor(i.x0 * sign.scale) +
			"</b> " +
			" y0: " +
			'<b class="red">' +
			Math.floor(i.y0 * sign.scale) +
			"</b> " +
			" x1: " +
			'<b class="red">' +
			Math.floor(i.x1 * sign.scale) +
			"</b> " +
			" y1: " +
			'<b class="red">' +
			Math.floor(i.y1 * sign.scale) +
			"</b> " +
			"  " +
			"<br />"
	}

	document.querySelector(".info__verticalTitle").innerHTML =
		"Вертикальные линии:"
	document.querySelector(".info__verticalLines").innerHTML = verticalRes

	let horintalRes = ""
	j = 0
	for (let i of sign.horizontalLines) {
		j += 1
		horintalRes +=
			"<b>" +
			`линия ${j}` +
			"</b>" +
			" x0: " +
			'<b class="green">' +
			Math.floor(i.x0 * sign.scale) +
			"</b> " +
			" y0: " +
			'<b class="green">' +
			Math.floor(i.y0 * sign.scale) +
			"</b> " +
			" x1: " +
			'<b class="green">' +
			Math.floor(i.x1 * sign.scale) +
			"</b> " +
			" y1: " +
			'<b class="green">' +
			Math.floor(i.y1 * sign.scale) +
			"</b> " +
			"  " +
			"<br />"
	}
	document.querySelector(".info__horizontalTitle").innerHTML =
		"Горизонтальные линии:"
	document.querySelector(".info__horizontalLines").innerHTML = horintalRes
}

function main() {
	sign.calculate() /*калькуляция линий */
	sign.draw(ctx) /* отрисовка знака */
}
