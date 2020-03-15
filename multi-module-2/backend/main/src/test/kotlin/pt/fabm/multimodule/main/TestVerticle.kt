package pt.fabm.multimodule.main

import io.vertx.core.Future
import io.vertx.core.Verticle
import io.vertx.core.Vertx
import io.vertx.core.spi.VerticleFactory
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import pt.fabm.multimodule.DotEnv
import java.io.File

@ExtendWith(VertxExtension::class)
class TestVerticle {

    private fun mockFactory(vertx: Vertx, mocks: Map<String, Verticle>) {
        vertx.registerVerticleFactory(object : VerticleFactory {
            override fun createVerticle(verticleName: String?, classLoader: ClassLoader?): Verticle = mocks[VerticleFactory.removePrefix(verticleName)]
                    ?: throw error("no verticle mock in map")

            override fun prefix(): String = "mock"
        })
    }

    @Test
    fun testMainDeploy(vertx: Vertx, context: VertxTestContext) {
        val mockDao = Mockito.mock(Verticle::class.java)
        fun onStopDao(stop: Future<Unit>) {
            //configure ebus client
            stop.complete()
        }
        Mockito.doAnswer {
            (it.arguments[0] as Future<Unit>).complete()
        }.`when`(mockDao).start(Mockito.any())
        Mockito.doAnswer { onStopDao(it.arguments[0] as Future<Unit>) }.`when`(mockDao).stop(Mockito.any())
        mockFactory(vertx, mapOf("dao" to mockDao))
        val confPath = "./build/resources/test/scenario1"
        System.setProperty("conf", File(confPath).absolutePath)
        vertx.deployVerticle(MainVerticle()) {
            if (it.failed()) {
                context.failNow(it.cause())
            } else {
                context.completeNow()
            }
        }
    }
}