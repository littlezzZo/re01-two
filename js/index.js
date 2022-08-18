window.addEventListener('load', function() {
    // 1. 获取元素
    var focus = document.querySelector('.focus');
    var ul = focus.children[0];
    var ol = focus.children[1];
    // 获得focus的宽度
    var w = focus.offsetWidth;
    // 2. 利用定时器自动轮播图片
    var index = 0;
    var timer = setInterval(function() {
        index++;
        var translateX = -index * w;
        // 添加动画效果
        ul.style.transition = 'all .3s';
        ul.style.transform = 'translateX(' + translateX + 'px)';
    }, 2000);
    // 等着过渡完成之后，再去判断，监听过渡完成的事件transitionend
    ul.addEventListener('transitionend', function() {
        // 无缝滚动
        if (index >= 3) {
            index = 0;
            // 去掉过渡效果，这样让ul快速的跳到目标位置
            ul.style.transition = 'none';
            // 利用最新的索引号乘以宽度，继续滚动图片
            var translateX = -index * w;
            ul.style.transform = 'translateX(' + translateX + 'px)';
        } else if (index < 0) {
            index = 2;
            // 去掉过渡效果，这样让ul快速的跳到目标位置
            ul.style.transition = 'none';
            // 利用最新的索引号乘以宽度，继续滚动图片
            var translateX = -index * w;
            ul.style.transform = 'translateX(' + translateX + 'px)';
        }
        // 3. 小圆点跟随变化
        // 把ol里面li带有current类名的选出来，去掉类名remove
        ol.querySelector('.current').classList.remove('current');
        // 让当前索引号的li加上current类名add
        ol.children[index].classList.add('current');
    });
    // 4. 手指滑动轮播图
    // 触摸元素touchstart：获取手指初始坐标
    var startX = 0;
    var moveX = 0;  // 后面会使用这个移动距离，所以要定义为全局变量
    var flag = false;  //用来标志手指是否真的移动，还是只是点击
    ul.addEventListener('touchstart', function(e) {
        startX = e.targetTouches[0].pageX;
        // 手指触摸的时候就停止定时器
        clearInterval(timer);
    });
    // 移动手指touchmove：计算手指的滑动距离，并且移动盒子
    ul.addEventListener('touchmove', function(e) {
        // 计算移动距离
        // e.targetTouches[0]为第一个手指，[1]表示第二个手指
        moveX = e.targetTouches[0].pageX - startX;
        // 移动盒子：盒子原来的位置 + 手指移动的距离
        var translateX = -index * w + moveX;
        // 手指拖动的时候，不需要动画效果，所以要取消过渡效果
        ul.style.transition = 'none';
        ul.style.transform = 'translateX(' + translateX + 'px)';
        flag = true;
        e.preventDefault();   //组织滚动屏幕的行为
    });
    // 手指离开，根据移动距离去判断是回弹还是播放上一张或者下一张
    ul.addEventListener('touchend', function(e) {
        // 只有手指移动过了，才执行下面的代码
        if (flag) {
            //（1）如果移动距离大于50像素，则播放上一张或者下一张
            if (Math.abs(moveX) > 50) {
                // 如果是右滑就是播放上一张，moveX是正值
                if (moveX > 0) {
                    index--;
                } else {
                    // 如果是左滑就是播放下一张，moveX是负值
                    index++;
                }
                // 用最新的index乘以宽度
                var translateX = -index * w;
                ul.style.transition = 'all .3s';
                ul.style.transform = 'translateX(' + translateX + 'px)';
            } else {
                //（2）如果移动距离小于50像素就回弹
                var translateX = -index * w;
                ul.style.transition = 'all .1s';
                ul.style.transform = 'translateX(' + translateX + 'px)';
            }
        }        
        // 手指离开的时候就重新开启定时器
        // 注意：开启定时器之前要先清空之前的定时器，保证当前只有一个定时器在执行
        clearInterval(timer);
        timer = setInterval(function() {
            index++;
            var translateX = -index * w;
            // 添加动画效果
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX(' + translateX + 'px)';
        }, 2000);
    });
});
