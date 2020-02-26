package pt.fabm.main

import io.vertx.core.buffer.Buffer
import pt.fabm.main.global.Tag

class AppClient(buffer: Buffer = Buffer.buffer()):App(buffer){

    override fun navigation(title: String) {
        Tag("Navigation",buffer)
                .attribute("title",title)
                .create()
    }

    override fun div(block: () -> Unit) {
        Tag("div",buffer)
                .createBody(block)
    }

    override fun div(classname: String, block: () -> Unit) {
        Tag("div",buffer)
                .attribute("className",classname)
                .createBody(block)
    }

    override fun h1(block: () -> Unit) {
        Tag("h1",buffer)
                .createBody(block)
    }

    fun render():Buffer{
        buffer.appendString("""
        import * as React from "react";
        import { app } from "../controller/AppController";
        import { Navigation } from "./Navigation.tpl";
        export const App = (props: app.Props) =>{return (
        """.trimIndent())

        render("{props.title}"){
            + "{props.children}"
        }

        buffer.appendString(");}")
        return buffer
    }
}