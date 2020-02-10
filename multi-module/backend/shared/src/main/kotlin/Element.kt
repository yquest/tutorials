package pt.fabm.main

import io.vertx.core.buffer.Buffer

abstract class Element(private val buffer: Buffer) {
    operator fun String.unaryPlus() {
        buffer.appendString(this)
    }
}