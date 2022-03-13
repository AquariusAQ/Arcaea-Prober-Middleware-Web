var fs = require('fs');

clear_list = ['Track Lost', 'Normal Clear', 'Full Recall', 'Pure Memory', 'Easy Clear', 'Hard Clear']
diff_list = ['PST', 'PRS', 'FTR', 'BYD']

function get_info(qq, callback) {
    //data_root = __dirname + '../data/'
    //data_root = './'
    data_root = __dirname.slice(0,-7) + '/data/'
    if (!fs.existsSync(data_root + qq + '.json')) {
        callback({code: 400, msg: '该QQ号未绑定（'+data_root + qq + '.json'+')'});
        return;
    }
    fs.readFile(data_root + qq + '.json', (err, base_data) => {
        if (err) {
            console.log(err);
        } else {
            base_info_str = base_data.toString();
            base_info = JSON.parse(base_info_str)
            if (base_info['state'] != 0) {
                callback({code: 300, msg: '正在查询中' + JSON.stringify(base_info)});
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
                    for (let index = 0; index < 30; index++) {
                        const element = rich_info['scores'][index];
                        result['b30'].push({
                            song: rich_info['song_title'][element['song_id']]['en'],
                            difficulty: diff_list[element['difficulty']],
                            score: element['score'],
                            shiny_perfect_count: element['shiny_perfect_count'],
                            perfect_count: element['perfect_count'],
                            near_count: element['near_count'],
                            miss_count: element['miss_count'],
                            clear_type: clear_list[element['clear_type']],
                            rating: element['rating']
                        });
                    }
                    callback({code:200, msg:'获取成功', data:result});
                }
            });
        }
    }) 
}

module.exports.get_info = get_info