package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class MainServer(buffer: Buffer, private val list: List<String>) : Main(buffer) {
    var currentIdx: Int = 0
    lateinit var currentValue:String

    override fun ul(className: String, block: () -> Unit) {
        Tag("ul", buffer)
                .attribute("class", className)
                .createBody(block)
    }

    override fun li(className: String, key: String, block: () -> Unit) {
        Tag("li", buffer)
                .attribute("class", className)
                .createBody(block)
    }

    override fun div(className: String, block: () -> Unit) {
        Tag("div", buffer)
                .attribute("class", className)
                .createBody(block)
    }

    override fun div(block: () -> Unit) {
        Tag("div", buffer)
                .createBody(block)
    }

    override fun app(title: String, block: () -> Unit) {
        AppServer(buffer).render(title, block)
    }

    override fun card(title: String, evt: String, value: String, btn: String, block: () -> Unit) {
        val serverValue = when(value){
            "stores.main.value1" -> "0"
            "stores.main.value2" -> "0"
            "stores.main.frontendList.length" -> "0"
            "stores.main.backendList.length" -> list.size.toString()
            else -> value
        }
        CardServer(buffer).render(title,serverValue,btn,block)
    }

    override fun onListNotEmpty(block: () -> Unit) {
        if (list.isNotEmpty()) block()
    }

    override fun expressionLabel(): String {
        return "idx=${currentIdx} value=(my element ${currentIdx+1})"
    }

    override fun eachLine(block: () -> Unit) {
        for((idx, value) in list.withIndex()){
            currentIdx = idx
            currentValue = value
            block()
        }
    }

    override fun button(onClick: String, className: String, type: String, block: () -> Unit) {
        Tag("button", buffer)
                .attribute("class", className)
                .attribute("type", type)
                .createBody(block)
    }

    override fun handleFrontEndList() {
        //ignored in server
    }

    override fun handleBackEndList() {
        createList()
    }

    override fun input(identifier: InputIdentifier, onChange: String, value: String) {
        val className: String = when (identifier) {
            InputIdentifier.MESSAGE -> "form-control mb-2"
        }
        val serverValue:String = when (value){
            "stores.main.message" -> ""
            else -> value
        }

        Tag("input", buffer)
                .attribute("class", className)
                .attribute("value", serverValue)
                .create()
    }

    override fun errorMessage() {
        //ignore in server
    }
}