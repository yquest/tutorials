package pt.fabm.multimodule.main

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.AbstractVerticle
import io.vertx.core.AsyncResult
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
    override fun start() {
        val confPath = System.getProperty("conf") ?: throw error("config not defined")
        val store = ConfigStoreOptions()
                .setType("file")
                .setFormat("yaml")
                .setConfig(JsonObject()
                        .put("path", "$confPath/config.yaml")
                )

        val retriever: ConfigRetriever = ConfigRetriever.create(vertx,
                ConfigRetrieverOptions().addStore(store))

        retriever.getConfig { config ->
            if (config.failed()) {
                throw config.cause()
            } else {
                configInit(config.result())
            }
        }
    }

    override fun stop() {
        server.close {
            println("server stop")
        }
    }

    private fun main(rc: RoutingContext) {
        val page = Page()
        val buffer = page.render(
                MainServer(list = listOf("my element 1", "my element 2"))
                        .render(),
                JsonArray().add("my element 1").add("my element 2")
        )
        rc.response().end(buffer)
    }

    private fun send(rc: RoutingContext) {
        val body = rc.getBodyAsString()
        vertx.eventBus().send(ListDao.DAO_EVENT_TRIGGER, body)
        rc.response().end()
    }

    private fun sse(rc: RoutingContext) {
        val response = rc.response()
        response.setChunked(true)
        response.headers().add("Content-Type", "text/event-stream")
        response.headers().add("Connection", "keep-alive")
        response.headers().add("Cache-Control", "no-cache")

        vertx.eventBus().consumer(ListDao.DAO_EVENT_TRIGGER) { message: Message<String> ->
            val chunk = "data: ${JsonObject(message.body()).getString("message")}\n\n"
            if (response.closed()) {
                LOGGER.warn("response is closed")
            } else {
                response.write(chunk)
            }
        }

    }

    private fun list(rc: RoutingContext) {
        val response = rc.response()
        val message: Void? = null
        vertx.eventBus().send(ListDao.DAO_ITEMS_LIST,
                message, DeliveryOptions().setCodecName(List::class.java.simpleName),
                Handler<AsyncResult<Message<List<String>>>> { reply ->
                    LOGGER.info("list ${reply.result().body()}")
                })
    }

    private fun configInit(config: JsonObject) {
        vertx.eventBus().registerCodec(LocalCodec(java.util.List::class.java))
        ListDao(vertx)
        val restConf = config.getJsonObject("confs").getJsonObject("rest")
        server = vertx.createHttpServer()
        val router = Router.router(vertx)
        val staticPath = restConf.getString("pdir") ?: throw error("expected static path")
        val webRoot = StaticHandler
                .create()
                .setAllowRootFileSystemAccess(true)
                .setWebRoot(staticPath)

        router.get("/").handler(::main)
        router.get("/api/sse").handler(::sse)
        router.post("/api/send").handler(BodyHandler.create()).handler(::send)
        router.get("/api/data").handler(::list)
        router.route().handler(webRoot)

        val port = restConf.getInteger("port") ?: throw error("server port required")
        server.requestHandler { router.handle(it) }.listen(port) {
            if (it.succeeded())
                println("server started")
            else
                println("server fails")
        }

    }
}