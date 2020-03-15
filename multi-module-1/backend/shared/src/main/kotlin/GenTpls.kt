package pt.fabm.main

import io.vertx.core.AbstractVerticle
import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.core.json.JsonObject
import io.vertx.core.logging.LoggerFactory

class GenTpls : AbstractVerticle() {
    companion object{
        val LOGGER = LoggerFactory.getLogger(GenTpls::class.java)
    }

    override fun start(startFuture: Future<Void>?) {
        val path = config().getString("path") ?: throw error("expected path from conf")
        val list: List<Pair<String, () -> Buffer>> = listOf(
                "Card" to { CardClient().render() },
                "Navigation" to { NavigationClient().render() },
                "App" to { AppClient().render() },
                "Main" to { MainClient().render() }
        )

        for (tpl in list) {
            val file = "$path/${tpl.first}.tpl.tsx"
            vertx.fileSystem().writeFile(file, tpl.second()) { result ->
                if (result.failed()) startFuture?.fail(result.cause())
                LOGGER.info("created file ${file}")
            }
        }
        startFuture?.complete()
    }
}

fun main() {
    val vertx = Vertx.vertx()
    vertx.deployVerticle(
            GenTpls(),
            DeploymentOptions()
                    .setConfig(
                            JsonObject()
                                    .put("path", "./frontend/src/tpl")
                    )
    ){vertx.close()}
}