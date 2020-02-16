package pt.fabm.multimodule.main

import io.vertx.core.Vertx
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.Message

class ListDao(private val vertx: Vertx) {
    companion object {
        const val DAO_EVENT_TRIGGER = "dao.event.trigger"
        const val DAO_ITEMS_LIST = "dao.list"
    }

    init {
        vertx.eventBus().consumer<Void>(DAO_ITEMS_LIST, ::list)
    }

    fun list(message: Message<Void>) {
        message.reply(listOf("my custom data 1",
                "my custom data 2",
                "my custom data 3",
                "my custom data 4"
        ), DeliveryOptions().setCodecName(List::class.java.simpleName))
    }
}