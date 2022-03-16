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
