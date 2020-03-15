package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class AppServer(buffer: Buffer): App(buffer) {
    override fun navigation(title: String) {
        NavigationServer(buffer).render(title)
    }

    override fun div(block: () -> Unit) {
        Tag("div",buffer)
                .createBody(block)
    }

    override fun div(classname: String, block: () -> Unit) {
        Tag("div",buffer)
                .attribute("class",classname)
                .createBody(block)
    }

    override fun h1(block: () -> Unit) {
        Tag("h1",buffer)
                .createBody(block)
    }
}