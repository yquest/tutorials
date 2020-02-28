package pt.fabm.multimodule.main

import io.vertx.core.AbstractVerticle
import io.vertx.core.AsyncResult
import io.vertx.core.Future
import io.vertx.core.Handler
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.Message
import io.vertx.core.http.HttpServer
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.BodyHandler
import io.vertx.ext.web.handler.StaticHandler
import pt.fabm.main.MainServer
import pt.fabm.main.Page


class WebVerticle : AbstractVerticle() {
    companion object {
        val LOGGER = LoggerFactory.getLogger(WebVerticle::class.java)
    }

    lateinit var server: HttpServer

    override fun start(startFuture: Future<Void>?) {
        server = vertx.createHttpServer()
        val router = Router.router(vertx)
        val staticPath = config().getString("pdir") ?: throw error("expected static path")
        val webRoot = StaticHandler
                .create()
                .setAllowRootFileSystemAccess(true)
                .setWebRoot(staticPath)

        router.get("/").handler(::main)
        router.get("/api/sse").handler(::sse)
        router.post("/api/send").handler(BodyHandler.create()).handler(::send)
        router.get("/api/data").handler(::list)
        router.route().handler(webRoot)

        val port = config().getInteger("port") ?: throw error("server port required")
        val host = config().getString("host") ?: throw error("server host required")

        server.requestHandler { router.handle(it) }.listen(port, host) {
            if (it.succeeded()){
                println("server started")
                startFuture?.complete()
            }
            else{
                println("server fails")
                startFuture?.fail(it.cause())
            }

        }

    }

    override fun stop(stopFuture: Future<Void>?) {
        server.close {
            if (it.failed()) stopFuture?.fail(it.cause())
            else stopFuture?.complete()
        }
    }


    private fun main(rc: RoutingContext) {
        val page = Page()

        fun bufferData(event: (List<String>) -> Unit) = vertx.eventBus().send(DaoVerticle.DAO_ITEMS,
                null, DeliveryOptions().setCodecName(List::class.java.simpleName),
                Handler<AsyncResult<Message<List<String>>>> { reply ->
                    LOGGER.info("list ${reply.result().body()}")
                    event(reply.result().body())
                })


        bufferData { data ->
            val mainBuffer = MainServer(list = data).render()
            val buffer = page.render(mainBuffer, JsonObject().put("list", JsonArray(data)))
            rc.response().end(buffer)
        }

    }

    private fun send(rc: RoutingContext) {
        val body = rc.getBodyAsString()
        vertx.eventBus().send(DaoVerticle.DAO_EVENT_TRIGGER, body)
        rc.response().end()
    }

    private fun sse(rc: RoutingContext) {
        val response = rc.response()
        response.setChunked(true)
        response.headers().add("Content-Type", "text/event-stream")
        response.headers().add("Connection", "keep-alive")
        response.headers().add("Cache-Control", "no-cache")

        vertx.eventBus().consumer(DaoVerticle.DAO_EVENT_TRIGGER) { message: Message<String> ->
            val chunk = "data: ${JsonObject(message.body()).getString("message")}\n\n"
            if (response.closed()) {
                LOGGER.warn("response is closed")
            } else {
                response.write(chunk)
            }
        }

    }

    private fun list(rc: RoutingContext) {
        fun fromIterableToJsonArray(iterable:Iterable<Example>):JsonArray{
            val jsonArray = JsonArray()
            for(current in iterable){
                jsonArray.add(current.content)
            }
            return jsonArray
        }
        val response = rc.response()
        vertx.eventBus().send(DaoVerticle.DAO_ITEMS,
                null, DeliveryOptions().setCodecName(Iterable::class.java.simpleName),
                Handler<AsyncResult<Message<Iterable<Example>>>> { reply ->
                    LOGGER.info("list ${reply.result().body()}")
                    response.end(
                        reply.result().body().let(::fromIterableToJsonArray).toBuffer()
                    )
                })
    }

}