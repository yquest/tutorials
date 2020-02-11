package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Element

abstract class App(buffer: Buffer = Buffer.buffer()) : Element(buffer) {
    abstract fun navigation(title: String)
    abstract fun div(block: () -> Unit)
    abstract fun div(classname: String, block: () -> Unit)
    abstract fun h1(block: () -> Unit)


   fun render(title: String, children: () -> Unit): Buffer {
        div {
            navigation("header example")
            div(classname = "container mt-5") {
                div(classname = "px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center"){
                    h1{
                        +title
                    }
                }
                children()
            }
        }
        return buffer
    }
}
