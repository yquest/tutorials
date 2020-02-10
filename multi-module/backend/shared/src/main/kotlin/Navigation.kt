package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Element
import pt.fabm.main.global.Tag

abstract class Navigation(private val buffer: Buffer = Buffer.buffer()) : Element(buffer) {
    abstract fun div(className: String, block: () -> Unit)
    abstract fun h5(className: String, block: () -> Unit)
    abstract fun a(className: String, href: String, block: () -> Unit)
    abstract fun i(className: String)
    abstract fun offLineMode()
    abstract fun onLineMode(block: () -> Unit)

    fun render(title: String): Buffer {
        div(className = "d-flex align-items-center p-3 mb-3 border-bottom box-shadow bg-light fixed-top") {
            h5(className = "my-0 mr-md-auto font-weight-normal") {
                i(className = "fas fa-home")
                +title
            }
            offLineMode()
            onLineMode {
                a(className = "btn btn-outline-primary", href = "#") {
                    i(className = "fas fa-sign-in-alt")
                    +"Sign up"
                }
            }
        }

        return buffer
    }
}
