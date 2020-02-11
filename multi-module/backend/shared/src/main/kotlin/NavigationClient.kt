package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class NavigationClient(buffer: Buffer = Buffer.buffer()):Navigation(buffer) {
    override fun div(className: String, block: () -> Unit) {
        Tag("div",buffer)
                .attribute("className",className)
                .createBody(block)
    }

    override fun h5(className: String, block: () -> Unit) {
        Tag("h5",buffer)
                .attribute("className",className)
                .createBody(block)
    }

    override fun a(className: String, href: String, block: () -> Unit) {
        Tag("a",buffer)
                .attribute("className",className)
                .attribute("href",href)
                .createBody(block)
    }

    override fun nav(className: String, block: () -> Unit) {
        Tag("nav",buffer)
                .attribute("className",className)
                .createBody(block)
    }

    override fun i(className: String) {
        Tag("i",buffer)
                .attribute("className",className)
                .create()
    }

    override fun offLineMode() {
        buffer.appendString("{!navigator.onLine && <img src={nonet} />}")
    }

    override fun onLineMode(block: () -> Unit) {
        buffer.appendString("{navigator.onLine && (")
        block()
        buffer.appendString(")}")
    }

    fun render():Buffer{
        buffer.appendString("""
        import * as React from "react";
        import { navigation } from "../controller/Navigation.controller";
        import nonet from "../content/nonet.svg";
        export const Navigation = (props: navigation.Props) => (
        """.trimIndent())
        render("{props.title}")
        buffer.appendString(");")
        return buffer
    }

}