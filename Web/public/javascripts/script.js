var info = {
    data() {
        return {
            show: false,
            qq: "",
            username: "",
            qq_query: "",
            player_data: {
                qq: null,
                user_id: null,
                join_date: null,
                rating: null,
                user_code: null,
                username: null,
                update_time: null,
                b30: []
            }
        }
    },
    methods: {
        post_update() {
            if (this.qq == "" || this.username == "") {
                alert("QQ号和用户名不能为空！");
                return;
            }
            $.post('/action/update', {qq: this.qq.trim(), username: this.username.trim()}, (res) => {
                alert(res.msg);
            });
        },
        post_query() {
            if (this.qq_query == "") {
                alert("QQ号不能为空！");
                return
            }
            $.post('/api/info', {qq: this.qq_query.trim()}, (res) => {
                data = JSON.parse(res)
                if (data['code'] == 200) {
                    this.player_data.qq = data['data']['qq']
                    this.player_data.user_id = data['data']['user_id']
                    this.player_data.join_date = time_format(data['data']['join_date'])
                    this.player_data.rating = data['data']['rating'] / 100
                    this.player_data.user_code = data['data']['user_code']
                    this.player_data.username = data['data']['username']
                    this.player_data.update_time = data['data']['update_time']
                    this.player_data.b30 = []
                    for (let index = 0; index < data['data']['b30'].length; index++) {
                        const element = data['data']['b30'][index];
                        this.player_data.b30.push({
                            index: index,
                            song: element['song'],
                            difficulty: element['difficulty'],
                            score: element['score'],
                            shiny_perfect_count: element['shiny_perfect_count'],
                            perfect_count: element['perfect_count'],
                            near_count: element['near_count'],
                            miss_count: element['miss_count'],
                            clear_type: element['clear_type'],
                            rating: element['rating'].toFixed(3),
                            constant: element['constant']
                        });
                    }
                    this.show = true
                } else {
                    alert(data['msg'])
                }
                
            });
        }
    }
}

$(document).ready(() => {
    
    //Vue.createApp(update).mount('#update')
    //Vue.createApp(query).mount('#query')
    Vue.createApp(info).mount('#info')
});

function add0(m) {
    return m < 10 ? '0' + m : m 
}

function time_format(time)
{
    time = parseInt(time)
    var time = new Date(time);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}