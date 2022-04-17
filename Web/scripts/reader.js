var fs = require('fs');

clear_list = ['Track Lost', 'Normal Clear', 'Full Recall', 'Pure Memory', 'Easy Clear', 'Hard Clear']
diff_list = ['PST', 'PRS', 'FTR', 'BYD']


data_root = __dirname.slice(0,-7) + '/data/'

function get_info(qq, callback) {
    if (!fs.existsSync(data_root + qq + '.json')) {
        callback({code: 400, msg: '该QQ号未绑定，请前往 http://arcaea.gensou.cc/ 进行账号绑定~'});
        return;
    }
    fs.readFile(data_root + qq + '.json', (err, base_data) => {
        if (err) {
            console.log(err);
        } else {
            var base_info_str = base_data.toString();
            var base_info = JSON.parse(base_info_str);
            var time_now = Date.now();
            var probe_time = (time_now - base_info['req_time']) / 1000 / 60;
            if (base_info['state'] == 1 && probe_time < 10) {
                callback({code: 300, msg: '正在从查分器存储至缓存中，请稍后再查询~'});
                return;
            }
            if (base_info['state'] == 1 && probe_time >= 10) {
                callback({code: 301, msg: '查询超时！'});
                return;
            }
            if (base_info['state'] == 3) {
                callback({code: 500, msg: '查分器查询失败，请重新在  http://arcaea.gensou.cc/ 绑定账号！' + JSON.stringify(base_info)});
                return;
            }
            update_time = base_info['updatetime']
            fs.readFile(data_root + qq + '.txt', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    rich_info_str = data.toString();
                    rich_info = JSON.parse(rich_info_str)
                    result = {};
                    result['qq'] = qq;
                    result['user_id'] = rich_info['userinfo']['user_id'];
                    result['join_date'] = rich_info['userinfo']['join_date'];
                    result['rating'] = rich_info['userinfo']['rating'];
                    result['user_code'] = rich_info['userinfo']['user_code'];
                    result['username'] = rich_info['userinfo']['name'];
                    result['b30'] = [];
                    result['update_time'] = update_time;
                    // let song_count = Math.min(30, rich_info['scores'].length)
                    var cur_id = "";
                    var song_index = 0;
                    for (let index = 0; index < rich_info['scores'].length; index++) {
                        if (song_index == 30) break;
                        const element = rich_info['scores'][index];
                        if (element['song_id'] == cur_id) continue;
                        cur_id = element['song_id'];
                        song_index += 1;
                        result['b30'].push({
                            song_id: element['song_id'],
                            song: rich_info['song_title'][element['song_id']]['en'],
                            difficulty: diff_list[element['difficulty']],
                            score: element['score'],
                            shiny_perfect_count: element['shiny_perfect_count'],
                            perfect_count: element['perfect_count'],
                            near_count: element['near_count'],
                            miss_count: element['miss_count'],
                            clear_type: clear_list[element['clear_type']],
                            rating: element['rating'],
                            constant: element['constant'],
                        });
                    }
                    // for (let index = 0; index < song_count; index++) {
                    //     const element = rich_info['scores'][index];
                    //     result['b30'].push({
                    //         song_id: element['song_id'],
                    //         song: rich_info['song_title'][element['song_id']]['en'],
                    //         difficulty: diff_list[element['difficulty']],
                    //         score: element['score'],
                    //         shiny_perfect_count: element['shiny_perfect_count'],
                    //         perfect_count: element['perfect_count'],
                    //         near_count: element['near_count'],
                    //         miss_count: element['miss_count'],
                    //         clear_type: clear_list[element['clear_type']],
                    //         rating: element['rating'],
                    //         constant: element['constant'],
                    //     });
                    // }
                    callback({code:200, msg:'获取成功', data:result});
                }
            });
        }
    }) 
}

function get_hostory(qq, callback) {
    if (!fs.existsSync(data_root + qq + '.json')) {
        callback({code: 400, msg: '该QQ号未绑定，请前往 http://arcaea.gensou.cc/ 进行账号绑定~'});
        return;
    }
    fs.readFile(data_root + qq + '.json', (err, base_data) => {
        if (err) {
            console.log(err);
        } else {
            base_info_str = base_data.toString();
            base_info = JSON.parse(base_info_str)
            if (base_info['state'] == 1) {
                callback({code: 300, msg: '正在从查分器存储至缓存中，请稍后再查询~'});
                return;
            }
            if (base_info['state'] == 3) {
                callback({code: 500, msg: '查分器查询失败，请重新在  http://arcaea.gensou.cc/ 绑定账号！' + JSON.stringify(base_info)});
                return;
            }
            fs.readFile(data_root + qq + '.txt', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    rich_info_str = data.toString();
                    rich_info = JSON.parse(rich_info_str);
                    result = rich_info['userinfo']['rating_records'];
                    callback({code:200, msg:'获取成功', data:result});
                }
            });
        }
    }) 
}

module.exports.get_info = get_info
module.exports.get_hostory = get_hostory