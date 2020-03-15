package pt.fabm.multimodule.main

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.Future
import io.vertx.core.Verticle
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.Message
import io.vertx.core.json.JsonObject
import io.vertx.core.spi.VerticleFactory
import io.vertx.ext.web.client.HttpResponse
import io.vertx.ext.web.client.WebClient
import io.vertx.ext.web.client.WebClientOptions
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import java.util.*

@ExtendWith(VertxExtension::class)
class TestVerticle {

    companion object {
        fun confLoad(vertx: Vertx, path: String): Future<JsonObject> {
            val asyncJsonObject = Future.future<JsonObject>()
            System.setProperty("conf", path)
            val confPath = System.getProperty("conf") ?: throw error("config not defined")
            val store = ConfigStoreOptions()
                    .setType("file")
                    .setFormat("yaml")
                    .setConfig(JsonObject()
                            .put("path", "$confPath/config.yaml")
                    )

            ConfigRetriever.create(vertx,
                    ConfigRetrieverOptions().addStore(store)).getConfig(asyncJsonObject)

            return asyncJsonObject
        }
    }

    private fun mockFactory(vertx: Vertx, mocks: Map<String, Verticle>) {
        vertx.registerVerticleFactory(object : VerticleFactory {
            override fun createVerticle(verticleName: String?, classLoader: ClassLoader?): Verticle {
                return mocks[VerticleFactory.removePrefix(verticleName)]
                        ?: throw error("no verticle mock in map")
            }

            override fun prefix(): String = "mock"
        })
    }

    @Test
    fun testMainDeploy(vertx: Vertx, context: VertxTestContext) {
        val list = listOf<Example>(
                Example(
                        id = UUID.randomUUID(),
                        content = "example 1"
                ),
                Example(
                        id = UUID.randomUUID(),
                        content = "example 1"
                )
        )

        fun messageSender(message: Message<Unit>) {
            message.reply(list, DeliveryOptions().setCodecName(Iterable::class.java.simpleName))
        }

        val mockDao = Mockito.mock(Verticle::class.java)
        fun onStopDao(stop: Future<*>) {
            stop.complete()
        }
        Mockito.doAnswer {
            val future = it.arguments[0] as Future<*>
            vertx.eventBus().registerCodec(LocalCodec(Iterable::class.java))
            vertx.eventBus().consumer<Unit>(Events.DAO_ITEMS, ::messageSender)
            future.complete()
        }.`when`(mockDao).start(Mockito.any())
        Mockito.doAnswer { onStopDao(it.arguments[0] as Future<*>) }.`when`(mockDao).stop(Mockito.any())
        mockFactory(vertx, mapOf("dao" to mockDao))
        val asyncLoad = confLoad(vertx, "./build/resources/test/scenario1")
                .compose { conf ->
                    val afterDeploy = Future.future<String>()
                    vertx.deployVerticle(MainVerticle(), afterDeploy)
                    afterDeploy.map { conf }
                }

        val contentExpected = """
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <link rel="manifest" href="/manifest.json">
                <title>Example app</title>
                <link rel="shortcut icon" href="favicon.ico"></link><link href="main.css" rel="stylesheet"></link>
              </head>
              <body>
                <div id="root"><div><div class="d-flex align-items-center p-3 mb-3 border-bottom box-shadow bg-light fixed-top"><h5 class="my-0 mr-md-auto font-weight-normal"><i class="fas fa-home"></i>header example</h5><nav class="my-2 my-md-0 mr-md-3"><a href="#" class="p-2 text-dark">link example</a></nav><a href="#" class="btn btn-outline-primary"><i class="fas fa-sign-in-alt"></i>Sign up</a></div><div class="container mt-5"><div class="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center"><h1>Example title</h1></div><div class="row"><div class="col-lg-6 mb-3"><div class="card box-shadow"><div class="card-header"><h4>Card 1</h4></div><div class="card-body"><h5 class="card-title">controller.value1</h5><p>Increment Card</p><a href="#" class="btn btn-primary">increment</a></div></div></div><div class="col-lg-6 mb-3"><div class="card box-shadow"><div class="card-header"><h4>Card 2</h4></div><div class="card-body"><h5 class="card-title">controller.value2</h5><p>Copy value from Card 1</p><a href="#" class="btn btn-primary">copy first</a></div></div></div><div class="col-lg-6 mb-3"><div class="card box-shadow"><div class="card-header"><h4>Card 3</h4></div><div class="card-body"><h5 class="card-title">controller.frontEndList.length</h5><p>List length</p><a href="#" class="btn btn-primary">add to list</a></div></div></div><div class="col-lg-6 mb-3"><div class="card box-shadow"><div class="card-header"><h4>Card 4</h4></div><div class="card-body"><h5 class="card-title">controller.backEndList.length</h5><p>List length</p><ul class="list-group mb-3"><li class="list-group-item"><div class="row"><div class="col-7">idx=0 value=(example 1)</div><div class="col text-right"><button class="btn btn-primary" type="button">remove</button></div></div></li><li class="list-group-item"><div class="row"><div class="col-7">idx=1 value=(example 1)</div><div class="col text-right"><button class="btn btn-primary" type="button">remove</button></div></div></li></ul><a href="#" class="btn btn-primary">load from backend</a></div></div></div><div class="col-lg-6 mb-3"><div class="card box-shadow"><div class="card-header"><h4>Card 5</h4></div><div class="card-body"><h5 class="card-title">0</h5><div><input class="form-control mb-2" value="controller.message"/></div><a href="#" class="btn btn-primary">fire notification</a></div></div></div></div></div></div></div>
                <script type="text/javascript">var __state={"list":["example 1","example 1"]};</script>
                <script type="text/javascript" src="bundle.js"></script>
              </body>
            </html>
        """.trimIndent()

        asyncLoad.compose { conf ->
            val afterClientResponse = Future.future<HttpResponse<Buffer>>()
            val webConf = conf.getJsonObject("confs").getJsonObject("web")
            val client = WebClient.create(
                    vertx,
                    WebClientOptions()
                            .setDefaultHost(webConf.getString("host"))
                            .setDefaultPort(webConf.getInteger("port"))
            )
            client.get("/").send(afterClientResponse)
            afterClientResponse
        }.map {
            Assertions.assertEquals(200, it.statusCode())
            val currentContent = it.bodyAsString()
            Assertions.assertEquals(contentExpected, currentContent.trimIndent())
        }.setHandler(context.completing())
    }
}