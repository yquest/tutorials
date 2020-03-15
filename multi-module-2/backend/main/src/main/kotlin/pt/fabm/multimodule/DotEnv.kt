package pt.fabm.multimodule

import io.vertx.core.Future
import io.vertx.core.Vertx
import java.io.StringReader
import java.util.*

class DotEnv(vertx: Vertx) {
    private val properties = Future.future<Properties>()

    init {
        vertx.fileSystem().readFile(".env") {
            if (it.failed()) {
                properties.handle(Future.failedFuture(it.cause()))
            } else {
                val localProperties = Properties()
                localProperties.load(StringReader(it.result().toString()))
                properties.handle(Future.succeededFuture(localProperties))
            }
        }
    }

    fun getProperty(key: String): Future<String?> {
        val future = Future.future<String?>()
        properties.map {
            it.getProperty(key) ?: System.getenv(key)
        }.otherwise {
            System.getenv(key)
        }.setHandler(future)
        return future
    }
}