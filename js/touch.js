var slider = {
    //判断设备是否支持touch事件
    touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    slider:document.getElementById('slider'),

    //事件
    events:{
        index:0,     //显示元素的索引
        slider:this.slider,     //this为slider对象
        icons:document.getElementById('icons'),
        icon:this.icons.getElementsByTagName('span'),
        handleEvent:function(event){
            var self = this;     //this指events对象
            if(event.type == 'touchstart'){
                self.start(event);
            }else if(event.type == 'touchmove'){
                self.move(event);
            }else if(event.type == 'touchend'){
                self.end(event);
            }
        },
        //滑动开始
        start:function(event){
            var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
            isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
            this.slider.addEventListener('touchmove',this,false);
            this.slider.addEventListener('touchend',this,false);
        },
        //移动
        move:function(event){
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
            if(isScrolling === 0){
                event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
                this.slider.className = 'cnt';
                this.slider.style.left = -this.index*600 + endPos.x + 'px';
            }
        },
        //滑动释放
        end:function(event){
            var duration = +new Date - startPos.time;    //滑动的持续时间
            if(isScrolling === 0){    //当为水平滚动时
                this.icon[this.index].className = '';
                if(Number(duration) > 10){
                    //判断是左移还是右移，当偏移量大于10时执行
                    if(endPos.x > 10){
                        if(this.index !== 0) this.index -= 1;
                    }else if(endPos.x < -10){
                        if(this.index !== this.icon.length-1) this.index += 1;
                    }
                }
                this.icon[this.index].className = 'curr';
                this.slider.className = 'cnt f-anim';
                this.slider.style.left = -this.index*600 + 'px';
            }
            //解绑事件
            this.slider.removeEventListener('touchmove',this,false);
            this.slider.removeEventListener('touchend',this,false);
        }
    },

    //初始化
    init:function(){
        var self = this;     //this指slider对象
        if(!!self.touch) self.slider.addEventListener('touchstart',self.events,false);    //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
    }
};

slider.init();