package pt.fabm.main.global

import io.vertx.core.buffer.Buffer

abstract class Element(protected val buffer: Buffer) {
    operator fun String.unaryPlus() {
        buffer.appendString(this)
    }
}