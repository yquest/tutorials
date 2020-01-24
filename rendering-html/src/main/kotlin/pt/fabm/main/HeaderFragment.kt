package pt.fabm.main

import io.vertx.core.buffer.Buffer

class HeaderFragment(private val buffer: Buffer) : Element(buffer) {

    private fun h1(block:() -> Unit) = Tag("h1", buffer).createBody(block)
    private fun div(className: String, block: () -> Unit) = Tag("div", buffer)
                .attribute("class", className)
                .createBody(block)
    private fun div(block:() -> Unit) = Tag("div", buffer).createBody(block)

    fun render(title: String) {
        div(className = "my-outer-div") {
            div {//div without class
                div(className = "my-inner-div") {
                    h1 { +title }
                }
            }
        }
    }
}