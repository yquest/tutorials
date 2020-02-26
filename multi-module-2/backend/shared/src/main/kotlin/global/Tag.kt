package pt.fabm.main.global

import io.vertx.core.buffer.Buffer

class Tag(private val name: String, private val buffer: Buffer) {
    private val bodyBuffer = Buffer.buffer()

    fun clientAttribute(name: String, value: String): Tag {
        bodyBuffer.appendString(""" $name={$value}""")
        return this
    }

    fun rawAttribute(name: String, value: String): Tag {
        bodyBuffer.appendString(""" $name=$value""")
        return this
    }

    fun attribute(name: String, value: String): Tag {
        bodyBuffer.appendString(""" $name="$value"""")
        return this
    }

    fun createBody(block: () -> Unit): Tag {
        buffer.appendString("<$name")
        buffer.appendBuffer(bodyBuffer)
        buffer.appendString(">")
        block()
        buffer.appendString("</$name>")
        return this
    }
    fun create(){
        buffer.appendString("<$name")
        buffer.appendBuffer(bodyBuffer)
        buffer.appendString("/>")
    }
}