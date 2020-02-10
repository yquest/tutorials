package pt.fabm.main

import io.vertx.core.AbstractVerticle
import io.vertx.core.http.HttpServer
import io.vertx.ext.web.Router

class WebVerticle: AbstractVerticle() {
    lateinit var server:HttpServer
    override fun start() {
        server = vertx.createHttpServer()
        val router = Router.router(vertx)
        router.route("/").handler {
            it.response().end(MainPage().render())
        }
        router.route("/second").handler {
            it.response().end(SecondPage().render())
        }

        server.requestHandler { router.handle(it) }.listen(8080){
            if(it.succeeded())
                println("server started")
            else
                println("server fails")
        }
    }

    override fun stop() {
        server.close{
            println("server stop")
        }
    }
}