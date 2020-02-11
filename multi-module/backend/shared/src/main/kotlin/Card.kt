package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Element

abstract class Card(buffer: Buffer) : Element(buffer) {

    abstract fun h4(block: () -> Unit)
    abstract fun h5(className: String, block: () -> Unit)
    abstract fun div(className: String, block: () -> Unit)
    abstract fun children(block: () -> Unit)
    abstract fun a(href: String, className: String,onClick:String, block: () -> Unit)

    fun render(title: String, value: String, btn: String, children: () -> Unit) {
        div(className = "col-lg-6 mb-3") {
            div(className = "card box-shadow") {
                div(className = "card-header") {
                    h4 { +title }
                }
                div(className = "card-body") {
                    h5(className = "card-title") {
                        +value
                    }
                    children()
                    a(href = "#", className = "btn btn-primary", onClick = "props.evt") {
                        +btn
                    }
                }
            }
        }
    }
}