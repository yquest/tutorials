package pt.fabm.multimodule.main

import com.datastax.oss.driver.api.core.CqlSession
import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.Message
import pt.fabm.multimodule.main.Events.DAO_ITEMS
import java.nio.file.Paths

class DaoVerticle : AbstractVerticle() {

    private val cassandraSessionAsync = Future.future<CqlSession>()
    override fun start() {
        vertx.eventBus().registerCodec(LocalCodec(Iterable::class.java))
        val config = config()
        try {
            val cassandraSession = CqlSession.builder()
                    .withCloudSecureConnectBundle(Paths.get(config.getString("path")))
                    .withAuthCredentials("", "")
                    .withKeyspace("ks")
                    .build()
            cassandraSessionAsync.handle(Future.succeededFuture(cassandraSession))
        } catch (e: Exception) {
            cassandraSessionAsync.handle(Future.failedFuture(e))
        }

        vertx.eventBus().consumer<Void>(DAO_ITEMS, ::list)
    }

    fun list(message: Message<Void>) {
        cassandraSessionAsync.map { cqlSession ->
            cqlSession.execute("select id, content from backend;").map { row ->
                Example(
                        row.getUuid("id") ?: throw error("expected id"),
                        row.getString("content") ?: throw error("content")
                )
            }
        }.setHandler {
            if (it.succeeded()) {
                message.reply(it.result(), DeliveryOptions().setCodecName(Iterable::class.java.simpleName))
            }
        }
    }
}