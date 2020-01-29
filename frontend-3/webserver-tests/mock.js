module.exports = function (req,res) {
    console.log(`serving url:${req.path} with method ${req.method}`)
    if(req.path === '/api/data'){
        const data = [
            "my custom data 1",
            "my custom data 2",
            "my custom data 3",
            "my custom data 4",
        ];
        res.status(200).json(data);
    }else{
        res.end();
    }
}
