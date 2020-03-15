package pt.fabm

import io.vertx.core.buffer.Buffer
import org.junit.jupiter.api.Test
import pt.fabm.main.*

class Render {
    @Test
    fun renderMainClient() {
        val buffer = MainClient().render()
        print(buffer)
    }

    @Test
    fun renderAppClient() {
        val buffer = AppClient().render()
        print(buffer)
    }

    @Test
    fun renderCardClient() {
        val buffer = CardClient().render()
        print(buffer)
    }

    @Test
    fun renderNavigationClient() {
        val buffer = NavigationClient().render()
        print(buffer)
    }

    @Test
    fun renderMainServer() {
        val buffer = MainServer(Buffer.buffer(), listOf("my element 1", "my element 2")).render()
        val wrapper = Buffer.buffer()
        wrapper.appendString("""
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <link rel="manifest" href="/manifest.json">
                <title>Car app</title>
              </head>
              <body>
                <div id="root">""".trimMargin())
        wrapper.appendBuffer(buffer)
        wrapper.appendString(
                """</div>
              </body>
            </html>
        """.trimIndent())
        println(buffer)
    }
}