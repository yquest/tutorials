const bodyParser = require("body-parser");
const tick = {
  send: null
};

app.use(bodyParser.json());
var resSse;

app.all("/api/*", function(req, res) {
  console.log(`serving url:${req.path} with method ${req.method}`);
  if (req.path === "/api/data") {
    const data = [
      "my custom data 1",
      "my custom data 2",
      "my custom data 3",
      "my custom data 4"
    ];
    res.status(200).json(data);
  } else if (req.path == "/api/send") {
    tick.send(req.body.message);
    res.end();
  } else if (req.path === "/api/sse") {
    resSse = res;
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache"
    });
    tick.send = message => {
      resSse.write(`data: ${message}\n\n`);
    };
    res.on("close", () => {
      if (!res.finished) {
        console.log("CLOSED");
      }
    });
  } else {
    res.end();
  }
});
