package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class CardClient(buffer: Buffer = Buffer.buffer()) : Card(buffer) {
    override fun h4(block: () -> Unit) {
        Tag(name = "h4", buffer = buffer).createBody(block)
    }

    override fun h5(className: String, block: () -> Unit) {
        Tag(name = "h5", buffer = buffer)
                .attribute("className", className)
                .createBody(block)
    }

    override fun div(className: String, block: () -> Unit) {
        Tag(name = "div", buffer = buffer)
                .attribute("className", className)
                .createBody(block)
    }

    override fun children(block: () -> Unit) {
        block()
    }

    override fun a(href: String, className: String, onClick:String, block: () -> Unit) {
        Tag(name = "a", buffer = buffer)
                .attribute("href", href)
                .clientAttribute("onClick",onClick)
                .attribute("className", className)
                .createBody(block)
    }

    fun render():Buffer {
        buffer.appendString("""
        import * as React from "react";
        import { card } from "../controller/Card.controller";
        export const Card = (props: card.Props) => {return (
        """.trimIndent())
        render(
                title = "{props.title}",
                value = "{props.value}",
                btn = "{props.btn}"
        ) {
            +"{props.children}"
        }
        buffer.appendString(");}")
        return buffer
    }

}