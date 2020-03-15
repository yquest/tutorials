console.log(`serving initialisation state, page:${req.url}`);
const state = { list: ["my element 1", "my element 2"] };
res.writeHead(200, { "Content-Type": "application/javascript" });
res.end(`var __state = ${JSON.stringify(state)};`);
