package pt.fabm.multimodule.main

import com.datastax.oss.driver.api.core.CqlSession
import io.vertx.core.AbstractVerticle
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.Message
import java.nio.file.Paths

class DaoVerticle : AbstractVerticle() {
    companion object {
        const val DAO_EVENT_TRIGGER = "dao.event.trigger"
        const val DAO_ITEMS = "dao.list"
    }

    private lateinit var cassandraSession: CqlSession
    override fun start() {
        vertx.eventBus().registerCodec(LocalCodec(Iterable::class.java))
        val config = config()
        cassandraSession = CqlSession.builder()
                .withCloudSecureConnectBundle(Paths.get(config.getString("path")))
                .withAuthCredentials("", "")
                .withKeyspace("ks")
                .build()

        vertx.eventBus().consumer<Void>(DAO_ITEMS, ::list)
    }

    fun list(message: Message<Void>) {
        val iterator: Iterable<Example> = cassandraSession.execute("select id, content from backend;").map { row ->
            Example(
                    row.getUuid("id") ?: throw error("expected id"),
                    row.getString("content") ?: throw error("content")
            )
        }
        message.reply(iterator, DeliveryOptions().setCodecName(Iterable::class.java.simpleName))
    }
}