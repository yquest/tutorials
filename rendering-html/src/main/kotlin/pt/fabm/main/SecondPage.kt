package pt.fabm.main

import io.vertx.core.buffer.Buffer

class SecondPage(private val buffer: Buffer= Buffer.buffer()) : Element(buffer) {
    private fun headerFragment() = HeaderFragment(buffer).render("Second page")
    private fun html(block: () -> Unit) = Tag("html", buffer).createBody(block)
    private fun hr() = Tag("hr",buffer,false)
    private fun div(className: String, block: () -> Unit) = Tag("div", buffer)
            .attribute("class", className)
            .createBody(block)

    private fun body(block: () -> Unit) = Tag("body", buffer).createBody(block)

    fun render(): Buffer {
        html {
            body {
                headerFragment()
                div("body-class") {
                    hr()
                    +"this is my second page"
                }
            }
        }
        return buffer
    }
}
