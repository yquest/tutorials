package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class CardClient(buffer: Buffer) : Card(buffer) {
    override fun h4(block: () -> Unit) {
        Tag(name = "h4", buffer = buffer).createBody(block)
    }

    override fun h5(className: String, block: () -> Unit) {
        Tag(name = "h5", buffer = buffer).createBody(block)
    }

    override fun div(className: String, block: () -> Unit) {
        Tag(name = "div", buffer = buffer).attribute("className", className).createBody(block)
    }

    override fun children(block: () -> Unit) {
        block()
    }

    override fun a(href: String, className: String, block: () -> Unit) {
        Tag(name = "a", buffer = buffer)
                .attribute("href", href)
                .attribute("className", className)
                .createBody(block)
    }

}