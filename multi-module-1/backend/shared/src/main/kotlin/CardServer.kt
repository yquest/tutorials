package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class CardServer(buffer: Buffer):Card(buffer){
    override fun h4(block: () -> Unit) {
        Tag("h4",buffer)
                .createBody(block)
    }

    override fun h5(className: String, block: () -> Unit) {
        Tag("h5",buffer)
                .attribute("class",className)
                .createBody(block)
    }

    override fun div(className: String, block: () -> Unit) {
        Tag("div",buffer)
                .attribute("class",className)
                .createBody(block)
    }

    override fun children(block: () -> Unit) {
        block()
    }

    override fun a(href: String, className: String, onClick: String, block: () -> Unit) {
        Tag("a",buffer)
                .attribute("href",href)
                .attribute("class",className)
                .createBody(block)
    }

}