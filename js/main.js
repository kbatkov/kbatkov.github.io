$(function () {
	/**
	 * Constants
	 */

	const breakpoint = {
		DESKTOP: 1270,
		LAPTOP: 991,
		TABLET: 767,
	}

	// ##########################################################

	/**
	 * Resize
	 */

	$(window).on('resize', function () {
		if ($(window).width() > breakpoint.LAPTOP) {
			$('[data-mobile-menu]').removeClass('show')
		}
	})

	// ##########################################################

	/**
	 * Loader
	 */

	$('.loader').delay(1000).fadeOut()

	/**
	 * Burger
	 */

	$('[data-burger]').on('click', function () {
		$('[data-mobile-menu]').toggleClass('show')
		return false
	})

	$(document).on('click', function (event) {
		const target = event.target

		if (!target.closest('.mobile-menu__body')) {
			$('[data-mobile-menu]').removeClass('show')
		}
	})

	/**
	 * Navigation
	 */

	const $nav = $('.nav')

	$nav.find('.nav__link').on('click', function (event) {
		if (
			$(window).width() < breakpoint.LAPTOP &&
			$(this).siblings('.nav__sublist').length
		) {
			event.preventDefault()
			$(this).next().slideToggle()
		}
	})

	/**
	 * Smooth scroll
	 */

	function smoothScroll(el) {
		const to = $(el.attr('href')).offset().top

		$('html, body').animate(
			{ scrollTop: to - $('.header').outerHeight() },
			1000
		)
	}

	$('[data-smooth-scroll]').on('click', function (e) {
		e.preventDefault()
		$('[data-mobile-menu]').removeClass('show')
		smoothScroll($(this))
	})

	$('[data-to-top]').on('click', function (e) {
		e.preventDefault()
		$('html, body').animate({ scrollTop: 0 }, 1000)
	})

	/**
	 * Handle staking
	 */

	$('[data-staking]').on('keyup', function () {
		const rate = 1.22
		const value = $(this).val()
		let earn

		if (value > 0) {
			earn = Math.floor(Math.round(value * rate))

			$('[data-earned]').html(earn - value)
			$('[data-annual-income]').html(earn)
		}
	})

	/**
	 * Fancybox
	 */

	if ($('[data-fancybox]').length) {
		$('[data-fancybox]').fancybox({
			beforeShow(instance, slide) {
				if ($('[data-mobile-menu]').css('display') === 'block') {
					$('[data-mobile-menu]').removeClass('show')
				}
			},
		})
	}

	/**
	 * Tokenomic chart
	 */

	const initial_data = [
		'#5691ea',
		'#ffa66c',
		'#ffd15d',
		'#ad7fb7',
		'#ff5f52',
		'#43bbc3',
		'#6cd86a',
		'#cd8ff3',
	]
	const hover_data = [
		'#4c85af',
		'#4c85af',
		'#4c85af',
		'#4c85af',
		'#4c85af',
		'#4c85af',
		'#4c85af',
		'#4c85af',
	]

	const data = {
		datasets: [
			{
				data: [10, 10, 2, 5, 35, 32.5, 5, 0.5],
				backgroundColor: initial_data,
				hoverBackgroundColor: initial_data,
				borderWidth: 0,
				weight: 3,
			},
		],
	}

	let partIndex

	if ($('#myChart').length) {
		function updateData(data) {
			myPieChart.config.data.datasets[0].backgroundColor = data
			myPieChart.update()
		}

		let ctxP = document.getElementById('myChart').getContext('2d')
		let myPieChart = new Chart(ctxP, {
			type: 'doughnut',
			data: data,
			options: {
				responsive: true,
				tooltips: {
					enabled: false,
				},
				legend: {
					display: false,
				},
				cutoutPercentage: 57,
				onHover: function (a, b) {
					if (b[0] !== undefined) {
						updateData(hover_data)
						partIndex = b[0]._index
						highlightPartOfChart(partIndex)
					} else {
						updateData(initial_data)
						initialStateOfParts()
					}
				},
			},
		})
	}

	function highlightPartOfChart(index) {
		$('.economy__token').removeClass('active').addClass('hovered')
		$('.economy__token').eq(index).addClass('active').removeClass('hovered')
	}

	function initialStateOfParts() {
		$('.economy__token').removeClass('active hovered')
	}

	/**
	 * Email sending
	 */

	function isEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
		return regex.test(email)
	}

	$('.footer__form').on('submit', function (e) {
		const $form = $(this)
		const $email = $form.find('input[type="email"]')
		const $message = $form.find('textarea[name="message"]')
		let error = false

		if (!isEmail($email.val())) {
			$email.closest('.field').addClass('field--error')
			error = true
		} else {
			$email.closest('.field').removeClass('field--error')
		}

		if ($message.val().trim().length < 1) {
			$message.closest('.field').addClass('field--error')
			error = true
		} else {
			$message.closest('.field').removeClass('field--error')
		}

		if (error) {
			return false
		}

		$.ajax({
			type: $form.attr('method'),
			url: $form.attr('action'),
			data: $form.serialize(),
		}).done(function () {
			$form.fadeOut(400, function () {
				$('[data-contact-notification]').fadeIn().css('display', 'flex')
			})
		})

		return false
	})
})


// === TEST ===

// START

const toTwoLengthNumber = (number) => {
	return (number < 10 ? '0' : '') + number
}

const getWinnerCoin = (coins) => {
		const maxValue = Math.max.apply(null, Object.values(coins))
		return Object.keys(coins).filter(coin => coins[coin] === maxValue)
}

const coinsResult = {
	nft: 0,
	eth: 0,
	doge: 0,
	btc: 0,
	brtr: 0,
	bnb: 0
}

const questions = [
	["Я почти всегда нахожусь в хорошем настроении.", "doge"],
	["Мой образ в одежде непременно должен отражать мою уникальность.", "nft"],
	["Я комфортнее чувствую себя в уединении, нежели в обществе.", "eth"],
	// ["Я люблю быть в центре внимания.", "nft"],
	// ["Я могу проводить много времени “в себе”, не замечая ничего вокруг.", "eth"],
	["Я четко понимаю, в каком направлении двигаться.", "brtr"],
	// ["Я не вижу смысла в эмоциональной суете, так как она мешает логически мыслить.", "eth"],
	["Люблю, когда мои труды оцениваются по достоинству,  но сам предпочитаю оставаться в тени.", "btc"],
	// ["Не стремлюсь погружаться в чужие проблемы, зато могу разрядить обстановку", "doge"],
	// ["Неважно, что обо мне говорят. Главное, что говорят.", "nft"],
	["Я имею достаточно сильное влияние на других людей и получаю от этого удовольствие.", "bnb"],
	// ["Мне не просто установить эмоциональную связь с кем-либо.", "eth"],
	// ["Если кто-то рядом грустит меня тянет его развеселить.", "doge"],
	// ["Большую часть времени я нахожусь на “своей волне”.", "eth"],
	// ["Постоянно меняю свои увлечения, потому что главное для меня - яркая эмоция.", "doge"],
	// ["Я умею произвести впечатление на публику.", "nft"],
	// ["Вижу слабые места других, не стесняюсь им об этом говорить.", "bnb"],
	// ["Я не щедр на чувства, но зато точно могу показать свое отношение делом.", "brtr"],
	// ["Я достаточно консервативный человек, но это помогает мне чувствовать себя в безопасности", "btc"],
	// ["Стараюсь сразу оценивать риски, но в целом могу адаптироваться к незапланированным обстоятельствам, так как четко вижу цель.", "brtr"],
	// ["Генерируя что-то новое, я продумываю сразу все до мелочей и учитываю все риски.", "btc"],
	// ["В компании могу быть не в центре внимания, но всегда буду ее “душой”.", "doge"],
	// ["Стараюсь не выделяться среди других, так как лишнее внимание может навредить.", "btc"],
	// ["Не люблю признавать свои ошибки или просить прощения - это ниже чувства моего достоинства.", "bnb"],
	// ["Вижу цель - иду к ней - это про меня.", "brtr"],
	// ["Несовершенство других людей меня раздражает.", "bnb"],
	// ["Я предпочитаю следовать четкому, изначально намеченному плану.", "btc"],
	// ["Не трачу время и силы на сантименты, так как не вижу в этом пользы.", "brtr"],
	// ["Люблю говорить о себе, но не ради внимания, а чтобы люди понимали, насколько я ценен для общества.", "bnb"],
	// ["Мне становится неуютно, когда большую часть внимания обращают на кого-то другого.", "nft"]
]

// EXTRA QUESTIONS
const extraQuestions = [
	["Закрываюсь, ухожу в себя, в свои мысли - там все понятно и спокойно.", "eth"],
	["Пытаюсь с разных сторон (часто эмоционально) показать свою точку зрения, чтобы человек понял, что я чувствую. Где-то даже могу утрировать, чтобы пробить черствость оппонента.", "nft"],
	["Стараюсь отшутиться, чтобы нейтрализовать конфликт или пытаюсь сменить тему", "doge"],
	["Нервничаю, поскольку рискую выйти из зоны комфорта. Привычный порядок может нарушиться в результате конфликта", "btc"],
	["Как правило искренне не понимаю, почему со мной не согласны, ведь моя позиция абсолютно логична. Пытаюсь спокойно объяснить эту логику.", "brtr"],
	["Могу сильно задеть чувства человека, потому что не могу позволить задеть себя. Здесь уж кто кого.", "bnb"]
];

const hundleExtraQuestions = (wrapper, winnerCoin) => {
	const extraWrapper = document.querySelector(wrapper);
	extraWrapperHtml = "";
	extraQuestions.map((item) => {
		if (winnerCoin.includes(item[1])) {
			extraWrapperHtml += `
			<input class="extra-input" type="radio" id="${item[1]}" name="radio">
			<label for="${item[1]}">${item[0]}</label>
		`;
		}
	})
	extraWrapper.innerHTML = extraWrapperHtml;
}

const extraBtn = document.querySelector(".extra-btn");
extraBtn.addEventListener('click', () => {
	const inputs = document.querySelectorAll(".extra-input");
	for (let i = 0; i < inputs.length; i += 1) {
		if (inputs[i].checked) {
			hundleResult([inputs[i].getAttribute("id")]);
			loader.style.display = "flex";
			setTimeout(() => {
			loader.style.display = "none";
			}, 1000);
			stageWrappers[2].classList.add("hidden");
			stageWrappers[3].classList.add("active");
			testWrapper.style.height = `${stageWrappers[3].offsetHeight}px`;
		}
	}
});
// END EXTRA QUESTIONS

const hundleResult = (winnerCoin) => {
	document.querySelector(`.result__wrapper.${winnerCoin[0]}`).classList.remove("hidden");
};

let stage = 0;

const testWrapper = document.querySelector(".test");
const startBtn = document.querySelector(".hero__btn");
const stageWrappers = document.querySelectorAll(".test__block");

const stageCounterFull = document.querySelector(".steps__counter-full");
const stageCounterCurrent = document.querySelector(".steps__counter-current");
stageCounterCurrent.innerHTML = toTwoLengthNumber(stage + 1);
stageCounterFull.innerHTML = questions.length;

testWrapper.style.height = `${stageWrappers[0].offsetHeight}px`;

startBtn.addEventListener('click', () => {
	stageWrappers[0].classList.add("hidden");
	stageWrappers[1].classList.add("active");
	testWrapper.style.height = `${stageWrappers[1].offsetHeight}px`;
});

// END START


// STEPS

function typeText(text, elem) {  
	let line = 0;
	let count = 0;
	let out = '';
	let htmlOut = document.querySelector(elem);
	function typeLine() {
		let interval = setTimeout(function(){
			out += text[line][count];
			htmlOut.innerHTML = out;
			count++;
			if (count >= text[line].length) {
				count = 0;
				line++;
				if (line == text.length) {
					clearTimeout(interval);
					return true;
				}
			}
			typeLine();
		}, 5);
	}
	typeLine();
}

const loader = document.querySelector(".loader");
const stepsBtn = document.querySelector(".steps__btn");
const answerOptions = document.querySelectorAll(".steps__step-item");
const answerOptionsPoints = [3, 1, -1];
let currentAnswer;

for (let i = 0; i < answerOptions.length; i += 1) {
	answerOptions[i].addEventListener('click', () => {
		for (answer of answerOptions) {
			answer.classList.remove('active');
		}
		answerOptions[i].classList.add("active");
		currentAnswer = answerOptionsPoints[i];
		stepsBtn.classList.add('active');
	});
}

stepsBtn.addEventListener('click', () => {
	if (stage !== questions.length - 1) {
		coinsResult[questions[stage][1]] += currentAnswer;
		stage += 1;
		stageCounterCurrent.innerHTML = toTwoLengthNumber(stage + 1);
		typeText(questions[stage][0], '.steps__title');
		console.log(coinsResult);
		console.log(getWinnerCoin(coinsResult));
	} else  if (getWinnerCoin(coinsResult).length > 1) {
		coinsResult[questions[stage][1]] += currentAnswer;
		hundleExtraQuestions('.extra-wrapper', getWinnerCoin(coinsResult));
		stageWrappers[1].classList.add("hidden");
		stageWrappers[2].classList.add("active");
		testWrapper.style.height = `${stageWrappers[2].offsetHeight}px`;
	} else {
		coinsResult[questions[stage][1]] += currentAnswer;
		hundleResult(getWinnerCoin(coinsResult));
		loader.style.display = "flex";
		setTimeout(() => {
		loader.style.display = "none";
		}, 1000);
		stageWrappers[1].classList.add("hidden");
		stageWrappers[3].classList.add("active");
		testWrapper.style.height = `${stageWrappers[3].offsetHeight}px`;
	}
	stepsBtn.classList.remove('active');
	for (answer of answerOptions) {
		answer.classList.remove('active');
	}
	// stepsBtn.innerHTML = JSON.stringify(coinsResult);
});

// END STEPS


// RESULT

// END RESULT