package pt.fabm.main

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.AbstractVerticle
import io.vertx.core.http.HttpServer
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.Router


class WebVerticle: AbstractVerticle() {
    lateinit var server:HttpServer
    override fun start() {
        val confPath = System.getProperty("conf")?:throw error("config not defined")
        val store = ConfigStoreOptions()
                .setType("file")
                .setFormat("yaml")
                .setConfig(JsonObject()
                        .put("path", "$confPath/config.yaml")
                )

        val retriever: ConfigRetriever = ConfigRetriever.create(vertx,
                ConfigRetrieverOptions().addStore(store))

        retriever.getConfig {config->
            if(config.failed()){
               throw config.cause()
            }else{
                configInit(config.result())
            }
        }
    }

    override fun stop() {
        server.close{
            println("server stop")
        }
    }

    private fun configInit(config:JsonObject){
        server = vertx.createHttpServer()
        val router = Router.router(vertx)
        val port = config.getJsonObject("confs").getJsonObject("rest").getInteger("port")?: throw error("server port required")
        server.requestHandler { router.handle(it) }.listen(port){
            if(it.succeeded())
                println("server started")
            else
                println("server fails")
        }

    }
}