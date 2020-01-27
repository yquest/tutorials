package pt.fabm.main

import io.vertx.core.buffer.Buffer

class MainPage(private val buffer: Buffer = Buffer.buffer()) : Element(buffer) {
    private fun headerFragment() = HeaderFragment(buffer).render("Main page")
    private fun html(block: () -> Unit) = Tag("html", buffer).createBody(block)
    private fun div(className: String, block: () -> Unit) = Tag("div", buffer)
            .attribute("class", className)
            .createBody(block)

    private fun p(block: () -> Unit) = Tag("p", buffer).createBody(block)
    private fun body(block: () -> Unit) = Tag("body", buffer).createBody(block)

    fun render():Buffer {
        html {
            body {
                headerFragment()
                div("body-class") {
                    p {
                        +"this is my body second page"
                    }
                }
            }
        }
        return buffer
    }
}
