/* 
 * This file has one dependencies and is not used in any other file.
 * The dependency is timonjs@1.0.5
 */

const progress = getQuery(".news-progress").get(0)
const wrapper = getQuery(".news-slider").get(0)
const slides = getQuery(".news-slider .news-slide")

slides[0].addClass("active")

let lastTime = performance.now()
let isOver = false
let currentSlide = 0
const max = progress.max || 100

wrapper.on("mouseenter", () => isOver = true)
wrapper.on("mouseleave", () => isOver = false)

requestAnimationFrame(animate)

function animate(now) {
    const delta = (now - lastTime) / 100
    lastTime = now

    if (!isOver) {
        if (progress.value + delta >= max) {
            nextSlide()
            progress.value = 0
        } else {
            progress.value += delta
        }
    }

    requestAnimationFrame(animate)
}

function nextSlide() {
    slides[currentSlide].removeClass("active")
    currentSlide = (currentSlide + 1) % slides.length
    slides[currentSlide].addClass("active")
}
