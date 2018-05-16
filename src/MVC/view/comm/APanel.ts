/**
 * 界面基类
 */
class APanel extends eui.Component{
    public constructor(skin: string){
        super();
        this.skinName = skin;
        // this._ComponentDidMount();
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._ComponentWillMount, this);
        this.addEventListener(eui.UIEvent.ADDED_TO_STAGE, this._ComponentDidMount, this);
    }
    
    /**
     * 皮肤加载完成
     */
    private _ComponentWillMount(){
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this._ComponentWillMount, this);
        this.ComponentWillMount();
    }
    /**
     * 登录舞台时调用
     */
    private _ComponentDidMount(){
        this.ComponentDidMount();
    }

    /**
     * 由子类覆盖的方法,皮肤加载完成
     */
    public ComponentWillMount(){
    }
    /**
     * 由子类覆盖的方法，登录舞台时调用，就是addChild时
     */
    public ComponentDidMount(){
    }

    /**
     * 注册订阅数据，当数据更新时自动刷新界面
     */
    public RegisterDataSource(source: any){
        source.map((item)=>{
            FacadeApp.AddListener(item, ()=>{
                this.Render(); //订阅和数据仓库相关的事件，当数据更新时自动刷新界面
            });
        });
    }

    /**
     * 自动渲染，一般在初次构造和关联事件发生是被调用
     */
    public async Render(){
    }

    /**
     * 访问
     */
    public onAccess(){
        if(this._stopBattle){
            FacadeApp.dispatchAction(CommandList.M_CMD_Fight_Suspend);//暂停战斗
        }
    }

    /**
     * 注册，显示页面。返回自身，支持链式操作
     * @_parent 父节点
     * @stopBattle 是否暂停战斗动画播放
     * @_close 关闭函数
     */
    public Register(_parent: egret.DisplayObjectContainer, stopBattle = true, _close = null){
        this._stopBattle = stopBattle;
        this.onUnRegister = _close;
        _parent.addChild(this);
        this.onAccess();
        return this;
    }
    
    /**
     * 移除页面
     */
	public UnRegister(){
        if(this._stopBattle){
            FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_CONTINUE);//继续战斗
        }
        if(this.parent != null){
            this.parent.removeChild(this);
        }
	}

    /**
     * 关闭面板
     */
    public CloseWindow(){
        if(this.onUnRegister){
            this.onUnRegister();
        }

        SoundManager.PlayCloseWinMusic();
		egret.Tween.removeTweens(this);
		var tw = egret.Tween.get(this);
        tw.to({y: GameConfigOfRuntime.panelInitY + 6}, 83).to({y: GameConfigOfRuntime.panelInitY}, 83).to(
                {y: GameConfigOfRuntime.panelInitY - 26}, 250).to({y: GameConfigOfRuntime.gameHeight}, 250);

        this.UnRegister();
    }

	/**
	 * 弹出面板
	 */
	public BouncedPanel(isSelected:boolean) {
        SoundManager.PlayOpenWinMusic();
		egret.Tween.removeTweens(this);
		var tw = egret.Tween.get(this);
        if(isSelected){
            tw.to({y: 0 - 26}, 250)
                .to({y: 0}, 83)
                .to({y: 0 + 6}, 83)
        }
        else{
            tw.to({y: GameConfigOfRuntime.panelInitY - 26}, 208).to({y: GameConfigOfRuntime.panelInitY}, 250).to(
                    {y: GameConfigOfRuntime.panelInitY + 6}, 83).to({y: GameConfigOfRuntime.panelInitY}, 83);
        }

        return this;
	}

	/**
	 * 上下弹动
	 */
    protected _UpOrDown(isSelected: boolean, list: eui.Scroller = null,group: eui.Group = null) {
		egret.Tween.removeTweens(this);
		var tw = egret.Tween.get(this);
        // 界面表现
		if (isSelected) {
            tw.to({y: GameConfigOfRuntime.panelInitY + 26}, 250).to({y: GameConfigOfRuntime.panelInitY}, 250).to(
                {y: 0 - 26}, 250).to({y: 0}, 250).to({y: 0 + 6}, 83).to({y: 0}, 83);
		}
		else {
            tw.to({y: 0 + 6}, 83).to({y: 0}, 83).to({y: 0 - 26}, 250).to(
                {y: GameConfigOfRuntime.panelInitY}, 250).to({y: GameConfigOfRuntime.panelInitY + 26}, 250).to(
                    {y: GameConfigOfRuntime.panelInitY}, 250);
		}
        // 列表表现
        if (list != null){
            egret.Tween.removeTweens(list);
            let listTW = egret.Tween.get(list);
            let groupTW = egret.Tween.get(list.viewport);
            var lishInitHeight: number = 250;
            let oriScrollV = list.viewport.scrollV;
            if (isSelected) {
                // 滚动容器拉伸
                listTW.to({height: lishInitHeight - 26}, 250)
                .to({height: lishInitHeight}, 250)
                .to({height: GameConfigOfRuntime.panelListHeight + 26}, 250)
                .to({height: GameConfigOfRuntime.panelListHeight}, 250)
                .to({height: GameConfigOfRuntime.panelListHeight - 6}, 83)
                .to({height: GameConfigOfRuntime.panelListHeight}, 83)

                // 显示容器拉伸
                groupTW.to({scrollV: oriScrollV}, 500)
                .to({scrollV: Math.max(oriScrollV - (GameConfigOfRuntime.panelListHeight - lishInitHeight), 0)}, 350)
            }
            else {
                // 滚动容器拉伸
                listTW.to({height: GameConfigOfRuntime.panelListHeight - 6}, 83)
                .to({height: GameConfigOfRuntime.panelListHeight}, 83)
                .to({height: GameConfigOfRuntime.panelListHeight + 26}, 250)
                .to({height: lishInitHeight}, 250)
                .to({height: lishInitHeight - 26}, 250)
                .to({height: lishInitHeight}, 250)
                list.viewport.scrollV += 1;
            }
        }
    }

    /**
     * 实例
     */
    public static inst(c:{new(): any}): any {
        /**
         * ！注意：Apanel._inst和this._inst含义不同，前者将访问APanel自身的静态属性，所有子类共享；后者将访问子类自身的静态属性，和父类不同，类似PHP中self和static的区别
         * 因此，此处如果使用Apanel._inst，将使得所有子类访问同一个变量，从而造成单态判断的错乱
         * 
         * @note 只能在静态函数内，使用this访问静态属性；在非静态函数中使用this无法访问静态属性
         */
        if(this._inst == null){
            this._inst = new c(); 
        }
        return this._inst;
    }

    private _stopBattle:boolean = true;
    private static _inst:any = null;
    public onUnRegister:Function = null;
}

/**
 * 控制动态列表动画的枚举
 */
const aniControlStatus = {
    /**
     * 首次装载波浪开启
     */
    StartWave: 1 << 0,
};

/**
 * 动画面板(APanelList)的条目所必须实现的接口
 */
interface IGroupLine extends egret.DisplayObject{
    getId:number;
    update(object: any):IGroupLine;
}

/**
 * 动态列表类，实现如下特性：
 * 1、一次性添加一组元素，然后调用 BeginShow 方法，此时所有元素波浪式缓动出现
 * 2、删除一个元素，此时该元素翻转消失，下方元素集体向上自动规整
 * 3、在列表末尾添加一个元素，列表自动滚动到尾部
 */
class APanelList<T extends IGroupLine> extends APanel{
    /**
     * 对动态列表进行初始化，在子类的构造函数中调用
     * @param _g 列表项显示容器
     * @param _s 列表滚动控制器
     * @param _fn 列表项类工厂
     * @param _dbAccess 数据项获取回调
     */
    public InitComponent(_g : eui.Group, _s: eui.Scroller, _fn: Function[], _dbAccess: Function[], aniCtrl?){
        this.myGroup = _g;
        this.myScroller =  _s;
        this.genericsInstance = _fn;
        this.GetDataFromDb = _dbAccess;
        if(aniCtrl){
            this.aniControl = aniCtrl;
        }
    }

    /**
     * 持续滚动直到底部
     */
    public ScrollToBottom(){
        setTimeout(()=>{
            if ((this.myScroller.viewport.scrollV + this.myScroller.height) < this.myScroller.viewport.contentHeight) {
                this.myScroller.viewport.scrollV += 10;
                this.ScrollToBottom();
            }        
        }, 20);
    }

    /**
     * 根据特征量删除元素
     */
    public DelItemBySpecial(id){
        return new Promise(resolve=>{
            let idx = this.GetIndexBySpecial(id);
            if(idx>=0){
                let n = this.myGroup.getChildAt(idx);
                //n.anchorOffsetX = n.width/2;
                n.anchorOffsetY = n.height/2;
                if(!n){
                    resolve();
                }
                else{
                    return new Promise(resolve=>{
                        let ani = egret.Tween.get(n);
                        //return ani.to({skewX:90, y:n.y + n.height*2/3},200).to({skewX:180, y:n.y + n.height*2/3},200).to({x:-700},200).call(()=>{
                        return ani.to({skewX: 90, y: n.y + n.height / 2},200).to({skewX: 180, y: n.y + n.height / 2},200).call(()=>{
                            this.myGroup.removeChild(n);
                            
                            let i = 0;
                            return Promise.all(this.myGroup.$children.map(it=>{
                                let item:T = <T>it;
                                if(item.getId == null){
                                    return null;
                                }
                                return new Promise((resolve)=>{
                                    egret.Tween.get(it).to({y: i++ * it.height}, 300).call(()=>{resolve();});
                                });
                            }));
                        });
                    });
                }
            }
        })
    }

    /**
     * 根据特征量返回条目编号
     */
    public GetIndexBySpecial(id){
        for(let i = 0; i < this.myGroup.numChildren; i++){
            let item:T = <T>this.myGroup.getChildAt(i);
            if(item.getId != null && item.getId == id){
                return i;
            }
        }
        return -1;
    }

    /**
     * 根据特征量返回条目信息
     */
    public GetItemBySpecial(id):T{
        for(let i = 0; i < this.myGroup.numChildren; i++){
            let item:T = <T> this.myGroup.getChildAt(i);
            if(item.getId != null && item.getId.toString() == id){
                return item;
            }
        }
        return null;
    }

    /**
     * 移除显示
     */
    public UnRegister(){
        super.UnRegister();
        this.myGroup.$children.map(it=>{
            egret.Tween.get(it).to({x:-700}, 0);
        });
    }

    /**
     * 添加条目
     */
    public AddItem(it: T,i: number){
        let otherCompNum = 0;
        for(let i = 0; i < this.myGroup.numChildren; i++){
            let item:T = <T> this.myGroup.getChildAt(i);
            if(item.getId != null){}
            else{
                otherCompNum += 1;
            }
        }
        
        it.y = (this.myGroup.numChildren - otherCompNum) * it.height;
        this.myGroup.addChild(it);
    }

    /**
     * 当数据更新时自动刷新界面
     */
    public async Render(){
        // 从数据仓库获取数据
        let length = this.GetDataFromDb.length;
        let _wave:boolean = Indicator.getChecker(this.aniControl)(aniControlStatus.StartWave) && this.firstOpen;
        let _delArr: Array<any> = [];
        let indexListSet = [];

        for(let i = 0; i<length; i++){
            let [taskList, indexList] = this.GetDataFromDb[i]();
            indexListSet.push(indexList);
            // End
            
            //分析新增项
            indexList.map(idx=>{
                let ci:T = this.GetItemBySpecial(idx);
                let info = taskList[idx] ? taskList[idx] : taskList;
                if(ci){
                    ci.x = _wave ? -700 : 0;
                    ci.update(info);
                }
                else{
                    ci = this.genericsInstance[i]();
                    ci.x = _wave ? -700 : 0;
                    ci.update(info);
                    this.AddItem(ci,i);
                    if(!this.firstOpen){
                        this.ScrollToBottom();
                    }
                }
            });
            
            // 位置移动
            if(_wave){
                let n = 0;
                this.myGroup.$children.map(it=>{
                    //todo：动态效果需要征求美术意见，做出相应调整，目前只是一个示例
                    egret.Tween.get(it).wait(150*n++).to({x:80+n*10}, 300).to({x:-50-n*10},200).to({x:0},100);
                    //egret.Tween.get(it).wait(150*n++).to({x:0}, 300);
                });
            }

            // 分析已删除项
            this.myGroup.$children.map(item=>{
                let cur:T = <T> item;
                let isHave = false;// 是否存在这个数据

                // 判断所有条中的存在
                if(cur.getId != null){
                    for(let i = 0; i<indexListSet.length; i++){
                        if(indexListSet[i].indexOf(cur.getId + "") >= 0){
                            isHave = true;
                            break;
                        }
                    }
                }else{
                    isHave = true;
                }


                // 需清除
                if(isHave == false && indexListSet.length >= length){
                    // console.log(item,indexListSet);
                    _delArr.push(cur);
                }
            });
        }

        /**
         *  移除条目
         */
        while(_delArr.length > 0){
            // 分析已删除项
            // console.log(_delArr);
            let rm = _delArr.pop();
            await this.DelItemBySpecial(rm.getId); // 利用await避免同时执行多条删除指令而导致的显示异常
        }

        this.firstOpen = false;
    }

    /**
     * 设置数据条目类工厂,条目实例
     */
    protected static genericsFactory<T>(c:{new(): T}): T {
        return <T> new c();
    }

    protected genericsInstance: Function[] = null;     // 条目类
    protected GetDataFromDb:Function[] = null;         // 数据源
    protected myScroller : eui.Scroller;               // 物品列表
    protected myGroup : eui.Group;                     // 滚动容器
    protected aniControl : Number = 0;                 // 动画效果控制
    public firstOpen:boolean = true;                   // 首次打开标志
    public static LineProSet: any[] = [];              // 条目类原型
}