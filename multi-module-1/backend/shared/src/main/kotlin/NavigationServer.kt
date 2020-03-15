package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class NavigationServer(buffer: Buffer) : Navigation(buffer) {
    override fun div(className: String, block: () -> Unit) {
        Tag("div", buffer)
                .attribute("class", className)
                .createBody(block)
    }

    override fun h5(className: String, block: () -> Unit) {
        Tag("h5", buffer)
                .attribute("class", className)
                .createBody(block)
    }

    override fun a(className: String, href: String, block: () -> Unit) {
        Tag("a", buffer)
                .attribute("href", href)
                .attribute("class", className)
                .createBody(block)
    }

    override fun nav(className: String, block: () -> Unit) {
        Tag("nav", buffer)
                .attribute("class", className)
                .createBody(block)
    }

    override fun i(className: String) {
        Tag("i", buffer)
                .attribute("class", className)
                .createBody {  }
    }

    override fun offLineMode() {
        //ignored on server
    }

    override fun onLineMode(block: () -> Unit) {
        block()
    }
}