const questions = document.querySelectorAll('.question')
const plans = document.querySelector('.plans')
const yearly = document.querySelector('.yearly')
const yearlyP = document.querySelector('#yearly')
const yearlySpan = document.querySelector('#yearly-span')
const changeButton = document.querySelector('.change-button')
const monthly = document.querySelector('.monthly')
const monthlyP = document.querySelector('#monthly')
const yearPrices = document.querySelectorAll('.year')
const monthPrices = document.querySelectorAll('.month')
const subPrices = document.querySelectorAll('.sub-price')

const track = document.querySelector('.comments-card')
const cards = document.querySelectorAll('.comment-card')
const bullets = document.querySelectorAll('.bullet')

const changeType = document.querySelector('.change-type')
const nav = document.querySelector('nav')
const toggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.dropdown-menu')


let index = 0
let startX = 0
let currentTranslate = 0
let isDragging = false
let startXPlan = 0
let isDraggingPlan = false

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled')
    } else {
        nav.classList.remove('scrolled')
    }
})

toggle.addEventListener('click', () => {
    menu.classList.toggle('open')
})

document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open')
    }
})


questions.forEach((q) => {
    const button = q.querySelector('.expand-question')

    button.addEventListener('click', () => {
        questions.forEach(item => {
            if (item !== q) item.classList.remove('active')
        })

        q.classList.toggle('active')
    })
})

function updateCarousel() {
    const wrapper = document.querySelector('.comments-card-wrapper')
    const wrapperWidth = wrapper.offsetWidth
    const gap = 20

    const move = (wrapperWidth * 0.85 + gap) * index

    track.style.transform = `translateX(-${move}px)`

    bullets.forEach((b, i) => {
        b.classList.toggle('enable', i === index)
        b.classList.toggle('disable', i !== index)
    })
}

bullets.forEach((bullet, i) => {
    bullet.addEventListener('click', () => {
        index = i;
        updateCarousel()
    })
})

track.addEventListener('touchstart', startTouch)
track.addEventListener('touchmove', moveTouch)
track.addEventListener('touchend', endTouch)

// opcional: funciona com mouse também (PC)
track.addEventListener('mousedown', startTouch)
track.addEventListener('mousemove', moveTouch)
track.addEventListener('mouseup', endTouch)
track.addEventListener('mouseleave', endTouch)

function startTouch(e) {
    isDragging = true
    startX = e.touches ? e.touches[0].clientX : e.clientX
}

function moveTouch(e) {
    if (!isDragging) return

    const currentX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = currentX - startX

    const cardWidth = cards[0].offsetWidth
    const gap = 20

    const baseMove = (cardWidth + gap) * index

    track.style.transform = `translateX(${ -baseMove + diff }px)`
}

function endTouch(e) {
    if (!isDragging) return
    isDragging = false

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const diff = endX - startX

    const threshold = 50 // sensibilidade

    if (diff > threshold && index > 0) {
        index--
    } else if (diff < -threshold && index < cards.length - 1) {
        index++
    }

    updateCarousel()
}

function setPlan(type) {
    const isYearly = type === 'yearly'

    changeButton.classList.toggle('move', !isYearly)

    monthlyP.classList.toggle('enable', !isYearly)
    monthlyP.classList.toggle('disable', isYearly)

    yearlyP.classList.toggle('enable', isYearly)
    yearlyP.classList.toggle('disable', !isYearly)

    yearlySpan.classList.toggle('enable', isYearly)
    yearlySpan.classList.toggle('disable', !isYearly)

    monthPrices.forEach(el => {
        el.classList.toggle('show', !isYearly)
        el.classList.toggle('hide', isYearly)
    })

    yearPrices.forEach(el => {
        el.classList.toggle('show', isYearly)
        el.classList.toggle('hide', !isYearly)
    })

    subPrices.forEach(el => {
        el.classList.toggle('show', isYearly)
        el.classList.toggle('hide', !isYearly)
    })
}

yearly.addEventListener('click', () => setPlan('yearly'))
monthly.addEventListener('click', () => setPlan('monthly'))

changeType.addEventListener('touchstart', (e) => {
    startXPlan = e.touches[0].clientX
    isDraggingPlan = true
})

changeType.addEventListener('touchend', (e) => {
    if (!isDraggingPlan) return
    isDraggingPlan = false

    const endX = e.changedTouches[0].clientX
    const diff = endX - startXPlan

    const threshold = 50

    if (diff > threshold) {
        setPlan('yearly') // arrastou pra direita
    } else if (diff < -threshold) {
        setPlan('monthly') // arrastou pra esquerda
    }
})

changeType.addEventListener('mousedown', (e) => {
    startXPlan = e.clientX
    isDraggingPlan = true
})

changeType.addEventListener('mouseup', (e) => {
    if (!isDraggingPlan) return
    isDraggingPlan = false

    const diff = e.clientX - startXPlan
    const threshold = 50

    if (diff > threshold) {
        setPlan('yearly')
    } else if (diff < -threshold) {
        setPlan('monthly')
    }
})

updateCarousel()