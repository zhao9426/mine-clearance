/* 点击开始游戏  -》动态生成100个小格子 -》100div
左边点击   没有雷-》显示数字 （代表以当前格子为中心周围8个格的雷数  扩散（当前周围八个格没有雷
            有雷-》game over
右边点击  没有标记并且没有数字-》进行标记  有标记 -》取消标记*   -》标记是否正确，10个都正确标记，提示成功
            已经出现数字-》无效果*/

var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImage = document.getElementById('alertImage');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var minesNum, mineOver;
var block;
var mineMap = [];//小格子标记
var startGameBool = true;


function bindEvent(){
    startBtn.onclick = function(){
        if( startGameBool){
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGameBool = false;
        }
    }
    box.oncontextmenu = function(){//取消鼠标右键默认事件
        return false;
    } 
    box.onmousedown = function(e){
        var event = e.target;
        if(e.which == 1){
            leftClick(event);
        }else if(e.which == 3){
            rightClick(event);
        }
    }
    closeBtn.onclick = function(){
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        startGameBool = true;
    }
}
bindEvent();

function init(){//点击开始游戏的初始函数
    minesNum = 10;
    mineOver = 10;
    score.innerHTML = mineOver;
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id', i + '-' + j);
            box.appendChild(con);
            mineMap.push({mine:0})//初始标记为没有雷
        }
    }
    block = document.getElementsByClassName('block');//取出所有的小格子
    while(minesNum){//当还有雷时
        var mineIndex = Math.floor(Math.random()*100);//随机获取10个小格子的下标
        if(mineMap[mineIndex].mine === 0){//判断当前格子是否放雷
            mineMap[mineIndex].mine = 1;//没有雷就放雷
            block[mineIndex].classList.add('isLei');//给小格子添加雷的样式
            minesNum --;//雷数减一
        }
    }
}

function leftClick(dom){//左击事件
    if(dom.classList.contains('flag')){//判断小格子中是否放了红旗，如果放了就返回
        return;
    }
    var isLei = document.getElementsByClassName('isLei');//获取所有的雷
    if(dom && dom.classList.contains('isLei')){//判断是否点到雷，进入if语句
        for(var i = 0; i < isLei.length; i ++){//遍历出所有雷
            console.log(isLei[i]);
            isLei[i].classList.add('show');//让雷的样式展示出来
        }
        setTimeout(function(){//设置定时器，过了800mm 弹出游戏结束图片
            alertBox.style.display = 'block';
            alertImage.style.backgroundImage = 'url("./img/end.png")';
        },800)
    }else{//没有点到雷，进入else语句
        var n = 0;//初始雷数为0
        var posArr = dom && dom.getAttribute('id').split('-');//获取属性为id的小格子并用-分割
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');
        for( var i = posX-1; i < posX+1; i++){
            for(var j = posY-1; j < posY+1; j++){
                var aroundBox = document.getElementById(i+ '-' +j);
                if(aroundBox && aroundBox.classList.contains('isLei')){
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if(n == 0){
            for( var i = posX-1; i < posX+1; i++){
                for(var j = posY-1; j < posY+1; j++){
                    var nearBox = document.getElementById(i+ '-' +j);
                    if(nearBox && nearBox.length != 0){
                       if(!nearBox.classList.contains('check')){
                           nearBox.classList.add('check');
                           leftClick(nearBox);
                       }
                    }
                }
            }
        }
    }
}

function rightClick(dom){
    if(dom.classList.contains('num')){
        return;
    }
    dom.classList.toggle('flag');
    if(dom.classList.contains('isLei') &&  dom.classList.contains('flag')){
        mineOver --;
    }
    if(dom.classList.contains('isLei') &&  !dom.classList.contains('flag')){
        mineOver ++;
    }
    score.innerHTML = mineOver;
    if(mineOver == 0){
        alertBox.style.display = 'block';
        alertImage.style.backgroundImage = 'url("./img/cg.png")';
    }

}