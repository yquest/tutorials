package pt.fabm.multimodule.main

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.AbstractVerticle
import io.vertx.core.CompositeFuture
import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory

class MainVerticle : AbstractVerticle() {
    companion object {
        val LOGGER = LoggerFactory.getLogger(MainVerticle::class.java)
    }

    override fun start(startFuture: Future<Void>?) {
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
                LOGGER.error("problem when load conf", config.cause())
                startFuture?.fail(config.cause())
            }
            val loadFuture: CompositeFuture = loadVerticles(config.result())
            loadFuture.setHandler { ar ->
                if (ar.failed()) {
                    startFuture?.fail(ar.cause())
                } else {
                    startFuture?.complete()
                }
            }
        }
    }

    private fun loadVerticles(config: JsonObject): CompositeFuture {
        val verticles = config.getJsonObject("verticles")
        val confs = config.getJsonObject("confs")
        val confWeb = confs.getJsonObject("web")
        val confDAO = confs.getJsonObject("dao")
        val successRest = Future.future<String>()
        val successDAO = Future.future<String>()
        vertx.deployVerticle(verticles.getString("dao"), DeploymentOptions().setConfig(confDAO)) {
            successRest.handle(it)
        }
        vertx.deployVerticle(verticles.getString("web"), DeploymentOptions().setConfig(confWeb)) {
            successDAO.handle(it)
        }
        return CompositeFuture.all(successRest, successDAO)
    }

}