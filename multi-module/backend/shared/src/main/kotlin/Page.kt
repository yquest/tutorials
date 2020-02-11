package pt.fabm.main

import io.vertx.core.buffer.Buffer

class Page {
    fun render(buffer: Buffer): Buffer {
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
                <div id="root">""".trimMargin()
        )
        wrapper.appendBuffer(buffer)
        wrapper.appendString(
                """</div>
              </body>
            </html>
        """.trimIndent()
        )
        return wrapper
    }
}