package pt.fabm.main

import io.vertx.core.buffer.Buffer

class Page {
    fun render(buffer: Buffer,json: Any): Buffer {
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
                <title>Example app</title>
                <link rel="shortcut icon" href="favicon.ico"></link><link href="main.css" rel="stylesheet"></link>
              </head>
              <body>
                <div id="root">""".trimMargin()
        )
        wrapper.appendBuffer(buffer)
        wrapper.appendString(
                """</div>
                <script type="text/javascript">var __state=${json};</script>
                <script type="text/javascript" src="bundle.js"></script>
              </body>
            </html>
        """.trimIndent()
        )
        return wrapper
    }
}