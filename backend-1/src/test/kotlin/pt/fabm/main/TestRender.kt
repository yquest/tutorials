package pt.fabm.main


import io.vertx.core.buffer.Buffer
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class TestRender {
    @Test
    fun renderMainTest() {
        val buffer = Buffer.buffer()
        MainPage(buffer).render()
        val expected = """<html><body><div class="my-outer-div"><div><div class="my-inner-div"><h1>Main page</h1></div></div></div><div class="body-class"><p>this is my body second page</p></div></body></html>"""
        Assertions.assertEquals(expected, buffer.toString())
    }

    @Test
    fun renderSecondTest() {
        val buffer = Buffer.buffer()
        SecondPage(buffer).render()
        val expected = """<html><body><div class="my-outer-div"><div><div class="my-inner-div"><h1>Second page</h1></div></div></div><div class="body-class"></hr>this is my second page</div></body></html>"""
        Assertions.assertEquals(expected, buffer.toString())
    }
}