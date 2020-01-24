package pt.fabm.main

import io.vertx.core.Vertx
import io.vertx.ext.web.client.WebClient
import io.vertx.ext.web.client.WebClientOptions
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(VertxExtension::class)
class TestVerticle {

    companion object{

    }

    @Test
    fun testCallMain(vertx: Vertx, testContext: VertxTestContext) {
        val webVerticle = WebVerticle()
        vertx.deployVerticle(webVerticle)

        val expected = """<html><body><div class="my-outer-div"><div><div class="my-inner-div"><h1>Main page</h1></div></div></div><div class="body-class"><p>this is my body second page</p></div></body></html>"""
        val client = WebClient.create(vertx, WebClientOptions().setDefaultPort(8080))
        client.get("/").send {
            Assertions.assertEquals(expected,it.result().bodyAsString())
            vertx.undeploy(webVerticle.deploymentID()) {
                testContext.completeNow()
            }
        }
    }

    @Test
    fun testCallSecond(vertx: Vertx, testContext: VertxTestContext) {
        val webVerticle = WebVerticle()
        vertx.deployVerticle(webVerticle)

        val expected = """<html><body><div class="my-outer-div"><div><div class="my-inner-div"><h1>Second page</h1></div></div></div><div class="body-class"></hr>this is my second page</div></body></html>"""
        val client = WebClient.create(vertx, WebClientOptions().setDefaultPort(8080))
        client.get("/second").send {
            Assertions.assertEquals(expected,it.result().bodyAsString())
            vertx.undeploy(webVerticle.deploymentID()) {
                testContext.completeNow()
            }
        }
    }
}