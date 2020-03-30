(function(){
    //强行暴露一个变量，一枝红杏出墙来
    window.Carousel = Carousel;
    //轮播图类
    function Carousel(JSON){
        console.log('123');
        this.$dom = $("#" + JSON.id); //DOM元素
        this.$imagesUl = null;
        this.$imagesUlLis = null;
        this.width = JSON.width;
        this.height = JSON.height;
        this.$leftBtn = null;
        this.$rightBtn = null;
        this.$circleOl = null;
        this.$circleLis = null;
        this.interval = JSON.interval;
        this.speed = JSON.speed; //滑动速度
        this.idx = 0;//信号量
        this.imagesURLArr = JSON.images;//图片地址数组
        console.log(this.imagesURLArr);
        this.pictureLength = JSON.images.length;//图片长度
        this.init();
        this.bindEvent();
        this.autoPlay(); //定时器
    }
    //初始化DOM
    Carousel.prototype.init = function(){
        //创建ul节点
        this.$imagesUl = $("<ul></ul>");
        this.$dom.append(this.$imagesUl);
        //创建li节点
        for(var i = 0; i < this.pictureLength; i++) {
            $("<li><img src='"+this.imagesURLArr[i].picUrl+"'/></li>").appendTo(this.$imagesUl);
        };
        //获得li元素引用
        this.$imagesUlLis = this.$imagesUl.find("li");
        //大盒子的布局
        this.$dom.css({
            "width" : this.width,
            "height" : this.height,
            "position" : "relative",
            "overflow" : "hidden"
        });
        //猫腻，让所有li藏起来（left移动到显示区域外）
        this.$imagesUlLis.css({
            "position" : "absolute",
            "left": this.width,
            "top": 0
        });
    //只显示第一张图
        this.$imagesUlLis.eq(0).css("left",0);
        //创建按钮
        this.$leftBtn = $("<a href='javascript:;' class='leftBtn'>\<</a>");
        this.$rightBtn = $("<a href='javascript:;' class='rightBtn'>\></a>");
        this.$leftBtn.appendTo(this.$dom);
        this.$rightBtn.appendTo(this.$dom);
        //创建小圆点
        this.$circleOl = $("<ol class='circls'></ol>");
        this.$circleOl.appendTo(this.$dom);
        for (var i = 0; i < this.pictureLength; i++) {
            $(`<li><a>${i+1}</a></li>`).appendTo(this.$circleOl);
        };
        //获得ol的li元素
        this.$circleLis = this.$circleOl.find("li");
        //加cur
        this.$circleLis.eq(0).addClass("cur");
    }
})();



//展示下一张
Carousel.prototype.showNext = function(){
    this.$imagesUlLis.eq(this.idx).animate({"left" : -2200},this.speed);
    this.idx++;
    if(this.idx > this.pictureLength - 1){
        this.idx = 0;
    }
    console.log(this.idx);
    if(this.idx == 0) {
        this.$imagesUlLis.eq(this.idx).css("z-index",11);
        
    }
    this.$imagesUlLis.eq(this.idx).css("z-index",9);
    this.$imagesUlLis.eq(++this.idx).css("z-index",6);
    this.$imagesUlLis.eq(--this.idx).css("z-index",6);
    this.$imagesUlLis.eq(this.idx).css("left",this.width).animate({"left" : 0},this.speed);
    //圆点的cur
    this.changeCirclesCur();
}
Carousel.prototype.changeCirclesCur = function(){
    this.$circleLis.eq(this.idx).addClass("cur").siblings().removeClass("cur");
}
//展示上一张
Carousel.prototype.showPrev = function(){
    this.$imagesUlLis.eq(this.idx).animate({"left" : this.width},this.speed);
    this.idx--;
    if(this.idx < 0){
        this.idx = this.pictureLength - 1;
    }
    this.$imagesUlLis.eq(this.idx).css("left",-this.width).animate({"left" : 0},this.speed);
    //圆点的cur
    this.changeCirclesCur();
}
//自动轮播
Carousel.prototype.autoPlay = function(){
    var self = this;
    this.timer = setInterval(function(){
        self.showNext();
    },this.interval);
}
// Carousel.prototype.bindEvent = function(){
//     var self = this;
//     //鼠标停表

// }
Carousel.prototype.bindEvent = function(){
    this.$dom.mouseenter(function(){
        clearInterval(self.timer);
    });
//离开开启
    this.$dom.mouseleave(function(){
        self.autoPlay();
    });
//圆点的监听
    this.$circleLis.click(function(){
        console.log('123');
        self.show($(this).index());
    });
    var self = this;
    //右边按钮的监听
    this.$rightBtn.click(function(){
        console.log('test');
        if(self.$imagesUlLis.is(":animated")) return;
        self.showNext();
    });
    //左边按钮的监听
    this.$leftBtn.click(function(){
        if(self.$imagesUlLis.is(":animated")) return;
        self.showPrev();
    });
}
//小圆点点击展示任意
Carousel.prototype.show = function(number){
    var old = this.idx; //旧idx信号量
    this.idx = number;    //当前点击的信号量，改变全局
    //判断
    if(this.idx > old){ //从右到左
        this.$imagesUlLis.eq(old).animate({"left" : -this.width},this.speed);
        this.$imagesUlLis.eq(this.idx).css("left",this.width).animate({"left" : 0},this.speed);
    }else if(this.idx < old){//从左到右
        this.$imagesUlLis.eq(old).animate({"left" : this.width},this.speed);
        this.$imagesUlLis.eq(this.idx).css("left",-this.width).animate({"left" : 0},this.speed);
    }
    //圆点的cur
    this.changeCirclesCur();
}