package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Element
import pt.fabm.main.global.Tag

abstract class Main(protected val buffer: Buffer) : Element(buffer) {
    enum class InputIdentifier {
        MESSAGE
    }

    abstract fun ul(className: String, block: () -> Unit)
    abstract fun li(className: String, key: String, block: () -> Unit)
    abstract fun div(className: String, block: () -> Unit)
    abstract fun div(block: () -> Unit)
    abstract fun app(title: String, block: () -> Unit)
    abstract fun card(title: String, evt: String, value: String, btn: String, block: () -> Unit)
    abstract fun onListNotEmpty(block: () -> Unit)
    abstract fun expressionLabel(): String
    abstract fun eachLine(block: () -> Unit)
    abstract fun button(onClick: String, className: String, type: String, block: () -> Unit)
    private fun p(block: () -> Unit) = Tag(buffer = buffer, name = "p").createBody(block)
    abstract fun handleFrontEndList()
    abstract fun handleBackEndList()
    abstract fun input(identifier: InputIdentifier, onChange: String, value: String)
    abstract fun errorMessage()

    fun createList() {
        onListNotEmpty {
            ul(className = "list-group mb-3") {
                eachLine {
                    li(className = "list-group-item", key = "`idx-\${idx}`") {
                        div(className = "row") {
                            div(className = "col-7") {
                                +expressionLabel()
                            }
                            div(className = "col text-right") {
                                button(onClick = "fnRemove(value)", type = "button", className = "btn btn-primary") {
                                    +"remove"
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    open fun render():Buffer {
        app(title = "Example title") {
            div(className = "row") {
                card(title = "Card 1", evt = "props.update1OnClickEvt", value = "stores.main.value1", btn = "increment") {
                    p {
                        +"Increment Card"
                    }
                }
                card(title = "Card 2", evt = "props.update2OnClickEvt", value = "stores.main.value2", btn = "copy first") {
                    p {
                        +"Copy value from Card 1"
                    }
                }
                card(title = "Card 3", evt = "props.addToList", value = "stores.main.frontendList.length", btn = "add to list") {
                    p {
                        +"List length"
                    }
                    handleFrontEndList()
                }
                card(title = "Card 4", evt = "props.loadList", value = "stores.main.backendList.length", btn = "load from backend") {
                    p {
                        +"List length"
                    }
                    handleBackEndList()
                }
                card(title = "Card 5", evt = "props.fireNotification", value = "0", btn = "fire notification") {
                    div {
                        input(InputIdentifier.MESSAGE, onChange = "props.changeInputMessage", value = "stores.main.message")
                    }
                    errorMessage()
                }
            }
        }
        return buffer
    }
}