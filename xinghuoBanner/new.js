import Service from './fetch.js'
import { terminal } from './utils/common.js';
/**
 * 轮播组件
 * @param {object} params 配置传参
 * @param {string} params.el 组件节点 class|id|<label>
 * @param {number} params.moveTime 过渡时间（毫秒）默认 300
 * @param {number} params.interval 自动播放间隔（毫秒）默认 3000
 * @param {boolean} params.loop 是否需要回路 到顶不轮询
 * @param {boolean} params.vertical 是否垂直滚动
 * @param {boolean} params.autoPaly 是否需要自动播放
 * @param {boolean} params.pagination 是否需要底部圆点
 * @param {(index: number) => void} params.slideCallback 滑动/切换结束回调
 * @param {boolean} params.projectType 星火请求、上报的地址会根据业务线的不同而改变
 * @param {boolean} params.env 所属环境
 * @param {boolean} params.uid 支付宝uid
 * @param {boolean} params.appId appId
 * @param {boolean} params.channel 埋点渠道
 * @param {boolean} params.width banner宽度
 * @param {boolean} params.height banner高度
 * @param {() => void} params.onBannerClickProps banner点击事件回调
 * @param {() => void} params.onBannerVisitProps banner每帧曝光事件回调
 * @param {() => void} params.onJumpOut banner点击跳转方法，参数url和当前帧item
 */
/**
 * 优化List
 * 1.用class写✅
 * 2.元素用el✅
 * 3.参数就不要加前缀了✅
 * 4.星火统一用拼音把✅
 * 5.再创建一个默认css文件。可覆盖✅
 * 6.参数字段跟插件对齐
 * 7.暴露一个destroy方法出去
 * 8.最后考虑rem的问题，如果是style绑定的px
 * 9.参数尽量多一些，然后给默认值，大部分非必传就行
 * 10.都纯js了，最好再用rollup打包下，umd格式的放到cdn上直接用
 */
export default class XinghuoBanner {
    constructor(el, params) {
        this.$el = document.querySelector(el);
        /** init校验参数 */
        this._params = params;

        /**
         * css class 命名列表
         * @dec ["滑动列表","滑动item","圆点容器","底部圆点","圆点高亮"]
         */
        this.classNames = [
            ".swiper_list",
            ".swiper_item",
            ".swiper_pagination",
            ".swiper_dot",
            ".swiper_dot_active"
        ];
        /** 滑动结束函数 */
        this.slideEnd =
            params.slideCallback ||
            function (index) {
                if (this.banner_maidian_list.indexOf(index) == -1) {
                    console.log("当前索引 >>", index, this.banner_maidian_list);
                    this.banner_maidian_list.push(index)
                }

            };
        /**
         * 组件节点
         * @type {HTMLElement}
         */
        this.node = null;
        /**
         * item列表容器
         * @type {HTMLElement}
         */
        this.nodeItem = null;
        /**
         * item节点列表
         * @type {Array<HTMLElement>}
         */
        this.nodeItems = [];
        /**
         * 圆点容器
         * @type {HTMLElement}
         */
        this.nodePagination = null;
        /**
         * 圆点节点列表
         * @type {Array<HTMLElement>}
         */
        this.nodePaginationItems = [];
        /** 是否需要底部圆点 */
        this.pagination = false;
        /** 是否需要回路 */
        this.isLoop = false;
        /** 方向 `X => true` | `Y => false` */
        this.direction = false;
        /** 是否需要自动播放 */
        this.autoPaly = false;
        /** 自动播放间隔（毫秒）默认 3000 */
        this.interval = 3000;
        /** 过渡时间（毫秒）默认 300 */
        this.moveTime = 300;
        /** 初始曝光数组 */
        this.banner_maidian_list = []
        /** 初始 */

        this.init();
    }

    async init() {
        //test 获取星火
        const { env, projectType, uid } = this._params
        const params = {
            env,
            channel: 'test',
            projectType,
            sceneGroupCode: 'UVEB4EARVQ2Q',
            userId: uid,
            receiptType: "SERVICE_C_0101",
            terminal: this.terminal
        }
        const data = await Service.QUERY_STAR_FIRE_CONF(params)
        console.log(data);
        this._params.bannerList = data.data['UVEB4EARVQ2Q']
        if (!this._params.bannerList) return console.warn("bannerList为空！");
        if (!this._params.width) return console.warn("参数width异常");
        if (!this._params.height) return console.warn("参数height异常");
        if (!this._params.appId) return console.warn("参数appId异常");
        if (!this._params.env) return console.warn("参数env异常");
        if (!this._params.projectType) return console.warn("参数projectType异常");
        const className = "swiper_" + Date.now().toString();
        this._className = '.' + className
        this.terminal = terminal()
        this.createList(className, this._params);
        this.maidian({
            spm_value: '123'
        })
    }

    /**
     * 动态生成组件html
     * @param {string} className
     */
    createList(className = "", starFire) {
        console.log("=> new banner");
        console.log(starFire);
        /** 页面容器节点 */
        const page = this.$el
        if (!page) return console.warn("没有可执行的DOM！");
        let itemList = "";
        for (let i = 0; i < starFire.bannerList.length; i++) {
            itemList += `<div class="swiper_item"  style="width:${starFire.width};height:${starFire.height};background: url(${starFire.bannerList[i].picUrl})no-repeat center / 100% 100%;float: left;  text-align: center;"></div>`;
        }
        let component = `<div class="swiper ${className}"  style='position: relative; overflow: hidden;'>
                          <div class="swiper_list" style='overflow: hidden; position: relative;  width: 100%;  height: 100%;  transition: 0s all;'>${itemList}</div>
                      </div>`;
        // 在元素之前插入添加节点内容 第一个参数有四种
        /**
             * beforebegin 在元素之前
               afterbegin 在元素的第一个子元素之前
               beforeend 在元素的最后一个子元素之后
               afterend 在元素之后
             */
        // page.insertAdjacentHTML("afterbegin", component);
        page.innerHTML = component;
        // page.style.width = starFire.width
        // page.style.height = starFire.height
        // => 曝光卖点
        console.log('曝光1');

        // =>下一步初始化
        this.initParams(className = "");
    }

    /** 初始化参数 */
    initParams() {
        const params = this._params
        const outputPaginationparams = this._params
        if (typeof params !== "object") return console.warn("传参有误");
        console.log('****123', params.bannerList);
        //pagination，autoPaly，isLoop <= bannerList
        this.pagination = params.bannerList.length == 1 ? false : true;
        this.direction = params.vertical || false;
        this.autoPaly = params.bannerList.length == 1 ? false : true;
        this.isLoop = params.bannerList.length == 1 ? false : true;
        this.moveTime = params.moveTime || 300;
        this.interval = params.interval || 3000;
        this.initLayout();
    }

    /** 初始化动态布局 */
    initLayout() {
        this.node = document.querySelector(this._className);
        const params = this._params
        if (!this.node) return console.warn("没有可执行的节点！");
        // this.node.style.height = '600px'
        //轮播整体长度
        this.nodeItem = this.node.querySelector(this.classNames[0]);
        if (!this.nodeItem) return console.warn(`缺少"${this.classNames[0]}"节点！`);
        //轮播item
        this.nodeItems = [...this.node.querySelectorAll(this.classNames[1])];
        if (this.nodeItems.length == 0) return console.warn("滑动节点个数必须大于0！");
        //获取元素宽高
        console.log(this.node);
        this.node.style.width = params.width
        this.node.style.height = params.height
        const moveWidth = this.node.offsetWidth, moveHeight = this.node.offsetHeight;
        console.log(moveWidth, moveHeight);
        // 添加点击事件
        console.log(`点击事件`, this.node);
        this.node.onclick = (e) => {
            const index = this.index
            const item = this._params.bannerList[index]
            const json = {
                spm_value: item.spm || "",
                action: "1",
                events: {
                    ad_idea_id: item.ideaId,
                    ad_unit_id: item.sceneCode,
                    source_url: item.ideaUrl
                        ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
                        : "",
                    ad_spm_value: item.spm,
                },
                other: {
                    ad_idea_id: item.ideaId,
                    ad_unit_id: item.sceneCode,
                    source_url: item.ideaUrl
                        ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
                        : "",
                    site_id: index + 1,
                },
            };
            this.maidian(json)
        }

        //根据传入bannerlist长度判断是否展示圆点
        if (this.pagination) this.outputPagination();
        //如果多帧滚动的话 需要回路 传入滚动容器宽高
        if (this.isLoop) this.outputLoop(moveWidth, moveHeight);
        this.outputLayout(moveWidth, moveHeight);
        this.main(moveWidth, moveHeight);
    }

    /** 输出底部圆点 */
    outputPagination() {
        let paginations = "";
        this.nodePagination = this.node.querySelector(this.classNames[2]);
        // 如果没有找到对应节点则创建一个
        if (!this.nodePagination) {
            this.nodePagination = document.createElement("div");
            this.nodePagination.className = this.classNames[2].slice(1);
            this.node.appendChild(this.nodePagination);
            this.nodePagination.style.position = 'absolute'
            this.nodePagination.style.width = '100%'
            this.nodePagination.style.height = '10px'
            this.nodePagination.style.textAlign = 'center'
            this.nodePagination.style.bottom = '14px'
            this.nodePagination.style.left = '0'
            this.nodePagination.style.display = 'flex'
            this.nodePagination.style.justifyContent = 'center'
        }
        for (let i = 0; i < this.nodeItems.length; i++) {
            paginations += `<div class="${this.classNames[3].slice(1)}" style="margin-left: 8px; width: 8px;height: 8px;background-color: rgba(0, 0, 0, 0.5);  border-radius: 50%;"></div>`;
        }
        this.nodePagination.innerHTML = paginations;
        this.nodePaginationItems = [...this.nodePagination.querySelectorAll(this.classNames[3])];
        // nodePagination.querySelector(classNames[3]).classList.add(classNames[4].slice(1));
        this.nodePagination.querySelector(this.classNames[3]).style.backgroundColor = '#fff';
    }

    /**
    * 输出回路：如果要回路的话前后增加元素
    * @param {number} width 滚动容器的宽度
    * @param {number} height 滚动容器的高度
    */
    outputLoop(width, height) {
        const first = this.nodeItems[0].cloneNode(true), last = this.nodeItems[this.nodeItems.length - 1].cloneNode(true);
        this.nodeItem.insertBefore(last, this.nodeItems[0]);
        this.nodeItem.appendChild(first);
        this.nodeItems.unshift(last);
        this.nodeItems.push(first);
        if (this.direction) {
            this.nodeItem.style.top = `${-height}px`;
        } else {
            this.nodeItem.style.left = `${-width}px`;
        }
    }

    /**
     * 输出动态布局
     * @param {number} width 滚动容器的宽度
     * @param {number} height 滚动容器的高度
     */
    outputLayout(width, height) {
        if (this.direction) {
            for (let i = 0; i < this.nodeItems.length; i++) {
                this.nodeItems[i].style.height = `${height}px`;
            }
        } else {
            this.nodeItem.style.width = `${width * this.nodeItems.length}px`;
            for (let i = 0; i < this.nodeItems.length; i++) {
                this.nodeItems[i].style.width = `${width}px`;
            }
        }
    }

    /** 设置动画 */
    startAnimation() {
        this.nodeItem.style.transition = `${this.moveTime / 1000}s all`;
    }

    /** 关闭动画 */
    stopAnimation() {
        this.nodeItem.style.transition = "0s all";
    }

    /**
     * 属性样式滑动
     * @param {number} n 移动的距离
     */
    slideStyle(n) {
        let x = 0, y = 0;
        if (this.direction) {
            y = n;
        } else {
            x = n;
        }
        this.nodeItem.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }


    /**
 * 事件开始
 * @param {number} width 滚动容器的宽度
 * @param {number} height 滚动容器的高度
 */
    main(width, height) {
        /**
         * 动画帧
         * @type {requestAnimationFrame}在浏览器下次重绘之前继续更新下一帧动画
         */
        const params = this._params
        this.animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        /** 触摸开始时间 */
        this.startTime = 0;
        /** 触摸结束时间 */
        this.endTime = 0;
        /** 开始的距离 */
        this.startDistance = 0;
        /** 结束的距离 */
        this.endDistance = 0;
        /** 结束距离状态 */
        this.endState = 0;
        /** 移动的距离 */
        this.moveDistance = 0;
        /** 圆点位置 && 当前 item 索引 */
        this.index = 0;
        /** 动画帧计数 */
        this.count = 0;
        /** loop 帧计数 */
        this.loopCount = 0;
        /** 移动范围 */
        this.range = this.direction ? height : width;
        const _this = this
        /** 开始自动播放 */
        function startAuto() {
            const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

            _this.count += 1;
            if (_this.count < _this.interval / 1000 * 60) return animation(startAuto);
            _this.count = 0;
            _this.autoMove();
            startAuto();
        }

        // 判断是否需要开启自动播放
        if (this.autoPaly && this.nodeItems.length > 1) startAuto();

        // 开始触摸
        if (params.bannerList.length > 1) {
            this.nodeItem.addEventListener("touchstart", ev => {
                this.startTime = Date.now();
                this.count = 0;
                // 帧计数
                this.loopCount = this.moveTime / 1000 * 60;
                // nodeItem.style.transition = "0s all";
                this.stopAnimation();
                this.startDistance = this.direction ? ev.touches[0].clientY : ev.touches[0].clientX;
            });

            // 触摸移动
            this.nodeItem.addEventListener("touchmove", ev => {
                // preventDefault事件没有被显式处理 不做位移行为
                ev.preventDefault();
                this.count = 0;
                this.endDistance = this.direction ? ev.touches[0].clientY : ev.touches[0].clientX;
                this.slideStyle(this.getDragDistance());
            });

            // 触摸离开
            this.nodeItem.addEventListener("touchend", () => {
                this.endTime = Date.now();
                // 判断是否点击
                if (this.endState !== this.endDistance) {
                    this.judgeMove();
                } else {
                    this.backLocation();
                }
                // 更新位置 
                this.endState = this.endDistance;
                // 重新打开自动播
                this.count = 0;
            });
        }

    }


    /** 获取拖动距离 */
    getDragDistance() {
        /** 拖动距离 */
        let dragDistance = 0;
        // 默认这个公式
        dragDistance = this.moveDistance + (this.endDistance - this.startDistance);
        // 判断最大正负值
        if ((this.endDistance - this.startDistance) >= this.range) {
            dragDistance = this.moveDistance + this.range;
        } else if ((this.endDistance - this.startDistance) <= -this.range) {
            dragDistance = this.moveDistance - this.range;
        }
        // 没有 loop 的时候惯性拖拽
        if (!this.isLoop) {
            if ((this.endDistance - this.startDistance) > 0 && this.index === 0) {
                // console.log("到达最初");
                dragDistance = this.moveDistance + ((this.endDistance - this.startDistance) - ((this.endDistance - this.startDistance) * 0.6));
            } else if ((this.endDistance - this.startDistance) < 0 && this.index === this.nodeItems.length - 1) {
                // console.log("到达最后");
                dragDistance = this.moveDistance + ((this.endDistance - this.startDistance) - ((this.endDistance - this.startDistance) * 0.6));
            }
        }
        return dragDistance;
    }

    /**
     * 判断触摸处理函数 
     * @param {number} slideDistance 滑动的距离
     */
    judgeTouch(slideDistance) {
        //	这里我设置了200毫秒的有效拖拽间隔
        if ((this.endTime - this.startTime) < 200) return true;
        // 这里判断方向（正值和负值）
        if (slideDistance < 0) {
            if ((this.endDistance - this.startDistance) < (slideDistance / 2)) return true;
            return false;
        } else {
            if ((this.endDistance - this.startDistance) > (slideDistance / 2)) return true;
            return false;
        }
    }

    /** 返回原来位置 */
    backLocation() {
        this.startAnimation();
        this.slideStyle(this.moveDistance);
    }




    /**
     * 滑动
     * @param {number} slideDistance 滑动的距离
     */
    slideMove(slideDistance) {
        this.startAnimation();
        this.slideStyle(slideDistance);
        this.loopCount = 0;
        const _this = this
        const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        // 判断 loop 时回到第一张或最后一张
        if (this.isLoop && this.index < 0) {
            // 我这里是想让滑块过渡完之后再重置位置所以加的延迟 (之前用setTimeout，快速滑动有问题，然后换成 requestAnimationFrame解决了这类问题)
            function loopMoveMin() {
                _this.loopCount += 1;
                if (_this.loopCount < _this.moveTime / 1000 * 60) return animation(loopMoveMin);
                _this.stopAnimation();
                _this.slideStyle(_this.range * -(_this.nodeItems.length - 3));
                // 重置一下位置
                _this.moveDistance = _this.range * -(_this.nodeItems.length - 3);
            }
            loopMoveMin();
            this.index = this.nodeItems.length - 3;
        } else if (this.isLoop && this.index > this.nodeItems.length - 3) {
            function loopMoveMax() {
                _this.loopCount += 1;
                if (_this.loopCount < _this.moveTime / 1000 * 60) return animation(loopMoveMax);
                _this.stopAnimation();
                _this.slideStyle(0);
                _this.moveDistance = 0;
            }
            loopMoveMax();
            this.index = 0;
        }
        // console.log(`第${ index+1 }张`);	// 这里可以做滑动结束回调
        if (this.pagination) {
            // console.log('****', nodePagination.querySelectorAll(classNames[3]));
            // nodePagination.querySelector(classNames[4]).className = classNames[3].slice(1);
            // nodePaginationItems[index].classList.add(classNames[4].slice(1));
            const result = this.nodePagination.querySelectorAll(this.classNames[3])
            if (result.length) {
                result.forEach(e => {
                    e.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                })
            }
            this.nodePaginationItems[this.index].style.backgroundColor = '#fff'
        }
    }

    /** 判断移动 */
    judgeMove() {
        // 判断是否需要执行过渡
        if (this.endDistance < this.startDistance) {
            // 往上滑动 or 向左滑动
            if (this.judgeTouch(-this.range)) {
                // 判断有loop的时候不需要执行下面的事件
                if (!this.isLoop && this.moveDistance === (-(this.nodeItems.length - 1) * this.range)) return backLocation();
                this.index += 1;
                this.slideMove(this.moveDistance - this.range);
                this.moveDistance -= this.range;
                this.slideEnd(this.index);
            } else {
                this.backLocation();
            }
        } else {
            // 往下滑动 or 向右滑动
            if (this.judgeTouch(this.range)) {
                if (!this.isLoop && this.moveDistance === 0) return backLocation();
                this.index -= 1;
                this.slideMove(this.moveDistance + this.range);
                this.moveDistance += this.range;
                this.slideEnd(this.index)
            } else {
                this.backLocation();
            }
        }
    }

    /** 自动播放移动 */
    autoMove() {
        // 这里判断 loop 的自动播放
        if (this.isLoop) {
            this.index += 1;
            this.slideMove(this.moveDistance - this.range);
            this.moveDistance -= this.range;
        } else {
            if (this.index >= this.nodeItems.length - 1) {
                this.index = 0;
                this.slideMove(0);
                this.moveDistance = 0;
            } else {
                this.index += 1;
                this.slideMove(this.moveDistance - this.range);
                this.moveDistance -= this.range;
            }
        }
        // console.log(321);
        this.slideEnd(this.index);
    }
    maidian(data = {}) {
        console.log(this);
        const {
            env,
            projectType,
            appId = '',
            appVerion = '',
            uid,
            channel = 'self',
            channel2 = '',
            tenantCode = '',
            portraitCode = '',
        } = this._params;

        const json = {
            ...data,
            // 必传参数
            env,
            projectType,
            appId,
            appVerion,
            uid,
            channel,
            // 非必填参数
            channel2,
            tenantCode,
            portraitCode,
        };
        console.log("埋点数据*****", json);
        Service.LOG(json);
    }

    destroy() {
        // 系统自动回收
    }
}


