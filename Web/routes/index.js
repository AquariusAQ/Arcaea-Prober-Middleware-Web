var express = require('express');
var crawler = require('../scripts/prober').crawler
var get_info = require('../scripts/reader').get_info
var get_hostory = require('../scripts/reader').get_hostory
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+'/index.html')
});

router.post('/action/update', function(req, res) {
  qq = "" + req.body.qq;
  username = "" + req.body.username;
  crawler(qq, username);
  res.send({code: 200, msg: "正在更新您的游玩数据，请等待3~5分钟后在右侧进行查询。如果10分钟内仍未成功，请重试或报告Bug~"});
  res.end();
})

router.post('/api/info', function(req, res) {
  qq = "" + req.body.qq;
  get_info(qq, (data) => {
    str = JSON.stringify(data);
    res.send(str);
    res.end();
  })
})

router.post('/api/history' ,function(req, res) {
  qq = "" + req.body.qq;
  get_hostory(qq, (data) => {
    str = JSON.stringify(data);
    res.send(str);
    res.end();
  })
})


// 以下为对称的get请求

router.get('/api/info', function(req, res) {
  qq = "" + req.query.qq;
  get_info(qq, (data) => {
    str = JSON.stringify(data)
    res.send(str);
    res.end();
  })
})

router.get('/api/history' ,function(req, res) {
  qq = "" + req.query.qq;
  get_hostory(qq, (data) => {
    str = JSON.stringify(data);
    res.send(str);
    res.end();
  })
})

module.exports = router;

