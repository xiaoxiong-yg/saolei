function Mine(tr,td,minenum) {
    this.tr = tr;
    this.td = td;
    this.minenum = minenum;
    this.endminenum = minenum;
    this.squares = [];
    this.tds = [];
    this.main = document.getElementsByClassName('main')[0];
    this.allright = false;
}
// init方法
Mine.prototype.init = function() {
    this.span = document.getElementsByTagName('span');
    this.span[0].innerHTML = this.minenum;
    this.createdom();
    this.randommine();
    this.updatenum();
    this.choose();
    this.main.oncontextmenu = function() {
        return false;
    }
    
    // for(var i = 0;i < this.tr;i++){
    //     for(var j = 0;j < this.td;j++){
    //         if(this.squares[i][j].type == 'mine'){
    //             this.tds[i][j].className = 'mine';
    //         }else{
    //             this.tds[i][j].innerHTML = this.squares[i][j].value
    //         }
    //     }
    // }
}
// 创建随机数
Mine.prototype.randomnum = function() {
    var square = new Array(this.tr*this.td);
    for(var i = 0;i<square.length;i++){
        square[i] = i
    }
    square.sort(function() {
        return Math.random() - 0.5
    });
    return square.splice(0,this.minenum)
}
// 创建随机雷
Mine.prototype.randommine = function() {
    var result = this.randomnum()
    // console.log(result)
    var n = 0;
    for(var i = 0;i < this.tr;i++){
        this.squares[i] = []
        for(var j = 0;j < this.td;j++){
            if(result.indexOf(n)!=-1){
                this.squares[i][j] = {type:'mine',x:j,y:i}
            }else{
                this.squares[i][j] = {type:'number',x:j,y:i,value:0}
            }
            n++
        }
    }
}
// 获取格子周围
Mine.prototype.getaround = function(squares){
    var x = squares.x;
    var y = squares.y;
    var around = []
    // console.log(x+','+y)
    for(var i = x - 1;i <= x + 1;i ++){
        for(var j = y - 1;j <= y + 1;j ++){
            if(i < 0 || i > this.td-1 || j < 0 || j > this.tr-1 || ( i == x && j == y) || this.squares[j][i].type =='mine'){
                continue
            }else{
                around.push([j,i])
            }

        }
    }
    // console.log(around)
    return around
}
// 更新雷周围数字
Mine.prototype.updatenum =function() {
    for(var i = 0;i < this.tr;i++){
        for(var j = 0;j < this.td;j++){
            if(this.squares[i][j].type == 'mine'){
                var num = this.getaround(this.squares[i][j]);
                // console.log(num)
                for(var k = 0;k < num.length;k++){
                    this.squares[num[k][0]][num[k][1]].value += 1
                }
            }
        }
    }
    // console.log(squares);
    // var num = this.getaround(squares);
    // console.log(num)
    // for(var k = 0;k < num.length;k++){
    //     console.log(this.squares[num[k][0]][num[k][1]].value)
    //     ++this.squares[num[k][0]][num[k][1]].value
    // }
}
// 创建dom
Mine.prototype.createdom = function () {
    var This = this
    var table = document.createElement('table');
    for(var i = 0;i < this.tr;i++){
        var domtr = document.createElement('tr');
        this.tds[i] = [];
        for(var j = 0;j < this.td;j++){
            var domtd = document.createElement('td');
            domtd.pos = [i,j]
            domtd.onmousedown = function() {
                // a.key = true;
                This.play(event,this);
                
                // console.log(a.key)
            }
            this.tds[i][j] = domtd;
            domtr.appendChild(domtd);
            
        }
        table.appendChild(domtr);
    }
    this.main.innerHTML = ''
    this.main.appendChild(table);
}
// 创建play方法
Mine.prototype.play = function(e,obj) {
    var This = this
    var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
    // console.log(curSquare)
    if(e.which == 1 && obj.className != 'flag'){
        var numcolor = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eigth'];
       
        if(curSquare.type == 'number'){
            obj.innerHTML = curSquare.value;
            obj.className = numcolor[curSquare.value];
            if(curSquare.value == 0){
                obj.innerHTML = ''
                function getallzero(square){
                    var result = This.getaround(square);
                    for(var i = 0;i<result.length;i++){
                        var x = result[i][0];
                        var y = result[i][1];
                        This.tds[x][y].className = numcolor[This.squares[x][y].value];
                        if(This.squares[x][y].value == 0){
                            if(!This.tds[x][y].check){
                                This.tds[x][y].check = true;
                                getallzero(This.squares[x][y])
                            }
                        }else{
                            This.tds[x][y].innerHTML = This.squares[x][y].value
                        }
                    }
                }
                getallzero(curSquare)
            }
        }else{
            for(var i = 0;i < this.tr;i++){
                for(var j = 0;j < this.td;j++){
                    if(this.squares[i][j].type == 'mine'){
                        this.tds[i][j].className = 'mine';
                    }
                    this.tds[i][j].onmousedown = '';
                }
            }
            alert('游戏失败');
            // a.key = false;
            obj.style.backgroundColor = 'red';
            
        }
    }else if(e.which == 3){
        if(obj.className && obj.className != 'flag'){
            return
        }
        obj.className = obj.className == 'flag'?"":"flag";
        if(curSquare.type == 'mine'){
            this.allright = true
        }
        else if(curSquare.type == 'number'){
            this.allright = false
        }
        if(obj.className == 'flag'){
            this.span[0].innerHTML = --this.endminenum
        }else{
            this.span[0].innerHTML = ++this.endminenum
        }
        if(this.endminenum == 0){
            if(this.allright == true){
                alert('游戏成功');
                // a.key = false;
            }else{
                alert('游戏失败');
                // a.key = false;
                for(var i = 0;i < this.tr;i++){
                    for(var j = 0;j < this.td;j++){
                        if(this.squares[i][j].type == 'mine'){
                            this.tds[i][j].className = 'mine';
                        }
                        this.tds[i][j].onmousedown = '';
                    }
                }
            }
        }
    }
}
// 按钮切换选择
Mine.prototype.choose = function (){
    var This = this
    var arr = [[9,9,10],[16,16,40],[28,28,99]]
    var button = document.getElementsByTagName('button');
    for(var i = 0;i < button.length;i++){
        (function(j){
            button[j].onclick = function() {
                for(var i = 0;i < button.length-1;i++){
                    button[i].className = ''
                }
                this.className = 'active';
                var mine = new Mine(arr[j][0],arr[j][1],arr[j][2]);
                mine.init();
                n = 0
            }
        }(i))
    }
    button[3].onclick = function(){
        // console.log(a.key)
        This.init();
        This.endminenum = This.minenum;
        n = 0;
        // a.key = true;
    }
}
// 定时器
var n = 0;
var sp = document.getElementsByTagName('span')[1];
sp.innerHTML = n;
var time = setInterval(
    function(){
        n++;
        sp.innerHTML = n;
        // console.log('a')
    },1000) 
// var a = {
//     key : false
// };
// function timer(){
//     var time = setInterval(
//         function(){
//             n++;
//             sp.innerHTML = n;
//             console.log('a')
//         },1000) 
//     if(!a.key){
//         clearInterval(time)
//     }
// }
// if(a.key == true){
//     timer()
//     console.log(a.key)
// }
// console.log(a.key)


var mine1 = new Mine(9,9,10);
mine1.init()
