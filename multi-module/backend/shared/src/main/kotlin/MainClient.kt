package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class MainClient(buffer: Buffer = Buffer.buffer()) : Main(buffer) {
    override fun ul(className: String, block: () -> Unit) {
        Tag("ul", buffer)
                .attribute("className",className)
                .createBody(block)
    }

    override fun li(className: String, key: String, block: () -> Unit) {
        Tag("li", buffer)
                .attribute("key", key)
                .attribute("className",className)
                .createBody(block)
    }

    override fun div(className: String, block: () -> Unit) {
        Tag("div", buffer)
                .attribute("className", className)
                .createBody(block)
    }

    override fun div(block: () -> Unit) {
        Tag("div", buffer)
                .createBody(block)
    }

    override fun app(title: String, block: () -> Unit) {
        Tag("App", buffer)
                .attribute("title", title)
                .createBody(block)
    }

    override fun card(title: String, evt: String, value: String, btn: String, block: () -> Unit) {
        Tag("Card", buffer)
                .attribute("title", title)
                .clientAttribute("evt", evt)
                .clientAttribute("value", value)
                .attribute("btn", btn)
                .createBody(block)
    }

    override fun onListNotEmpty(block: () -> Unit) {
        buffer.appendString("list.length > 0 && (")
        block()
        buffer.appendString(")")
    }


    override fun expressionLabel(): String {
        return "{`idx=\${idx} value=(\${value}) `}"
    }

    override fun eachLine(block: () -> Unit) {
        buffer.appendString("{list.map((value, idx) => (")
        block()
        buffer.appendString("))}")
    }

    override fun button(onClick: String, className: String, type: String, block: () -> Unit) {
        Tag("button", buffer)
                .clientAttribute("onClick", onClick)
                .attribute("type", type)
                .attribute("className", className)
                .createBody(block)
    }

    override fun handleFrontEndList() {
        buffer.appendString("{createList(stores.main.frontendList, props.removeFromFrontend)}")
    }

    override fun handleBackEndList() {
        buffer.appendString("{createList(stores.main.backendList, props.removeFromBackend)}")
    }

    override fun input(identifier: InputIdentifier, onChange: String, value: String) {
        val className: String = when (identifier) {
            InputIdentifier.MESSAGE -> "\"form-control mb-2\" + util.validationState2ControllerClass(stores.card5.validationState)"
        }
        Tag("input", buffer)
                .clientAttribute("className", className)
                .clientAttribute("onChange", onChange)
                .clientAttribute("value",value)
                .create()
    }

    override fun errorMessage() {
        buffer.appendString("{stores.card5.validationState === util.Validationstate.INVALID && (<div className=\"invalid-feedback mb-2\">{stores.card5.validationMessage}</div>)}")
    }

    fun renderCreateList(): Buffer {
        buffer.appendString("""function createList(list: string[], fnRemove: (value: string) => (e: React.MouseEvent) => void): JSX.Element {return (""")
        createList()
        buffer.appendString(");}")
        return buffer
    }

    override fun render(): Buffer {
        buffer.appendString( """
        import * as React from "react";
        import { App } from "./App.tpl";
        import { Card } from "./Card.tpl";
        import { stores } from "../store/stores";
        import { observer } from "mobx-react";
        import { main } from "../controller/Main.controller";
        import { util } from "../util";""".trimMargin())

        renderCreateList()
        buffer.appendString(
            """
            export const Main = observer(
            (props: main.Props): JSX.Element => (""".trimMargin()
        )
        super.render()
        buffer.appendString("));")
        return buffer
    }

}
