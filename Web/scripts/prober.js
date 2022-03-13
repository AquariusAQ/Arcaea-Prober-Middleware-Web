var fs = require('fs');
var jsexecpy = require('jsexecpy')

// 关于state
// 0: 已有有效数据
// 1: 数据查询中
// 2: 不存在该账号
// 3: 目前服务器网络不佳

function crawler(qq, username) {
    data = {
        qq: qq,
        username: username,
        state: 1,
    }
    let str = JSON.stringify(data,"","\t")
    fs.writeFile('./data/' + qq + '.json', str, function(err){
        if (err) {
            console.log(err);
            return;
        }
        let params = [qq, username]
        jsexecpy.runpath_with_params("./scripts/arcaea_crawler.py", params, () => {

        });
        // try {
        //     var ws = new WebSocket("wss://arc.estertion.win:616/");

        //     ws.onopen = function(evt) {  //绑定连接事件
        //         console.log("Connection open ...");
        //         console.log("Sending username: " + username);
        //         ws.send(username);
        //     };

        //     ws.onmessage = function(evt) {//绑定收到消息事件
        //         let data = iconv.decode(Buffer.from(evt.data), 'utf8');
        //         console.log( "Received Message: " + data);
        //     };

        //     ws.onclose = function(evt) { //绑定关闭或断开连接事件
        //         console.log("Connection closed.");
        //     };
        // } catch(err) {
        //     console.log(err)
        // }
    });
}

module.exports.crawler = crawler