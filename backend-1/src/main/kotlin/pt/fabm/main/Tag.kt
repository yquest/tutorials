package pt.fabm.main

import io.vertx.core.buffer.Buffer

class Tag(private val name: String, private val buffer: Buffer, withBody: Boolean = true) {

    init {
        if (withBody)
            buffer.appendString("<$name")
        else
            buffer.appendString("</$name>")
    }

    fun attribute(name: String, value: String): Tag {
        buffer.appendString(""" $name="$value"""")
        return this
    }

    fun createBody(block: () -> Unit): Tag {
        buffer.appendString(">")
        block()
        buffer.appendString("</$name>")
        return this
    }
}