/**
 * 应用入口类，相当于C程序Main函数
 */
class Main extends eui.UILayer {
    public constructor() {
        super();
        this.TopSence = new egret.DisplayObjectContainer();

        //设置单例访问句柄
        Main.Instance = this;
    }

    /**
     * 清单：需要加载的全部配置文件
     */
    private configArrayList: Array<any> = [
        {path:"resource/default.res.json", root: "resource/"},
    ];

    /**
     * 清单：需要加载的全部Group
     */
    private groupArrayList: Array<any> = [
        'loading',
        'game',
        'pvp',
    ];

    /**
     * 系统自调用函数
     */
    protected createChildren(): void {
        super.createChildren();

        //注入自定义的素材解析器
        this.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        //载入configArrayList指定的多个配置文件
        this.onConfigComplete(null);

        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, () => {
            //必须theme和group.loading都加载成功，才能执行_CreateLoading函数体内容
            this.processStatus = Indicator.getInstance(this.processStatus).set(ProcessStatus.ThemeLoadEnd).indecate;
            this.onLoadingEnd();
        }, this);
    }
    
    /**
     * 加载全部配置文件，并自动响应加载成功事件
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        if(event == null){//开始加载资源文件，添加事件监听
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        }

        //从数组中取出一个资源文件名称，开始加载
        if(this.configArrayList.length > 0){
            let item = this.configArrayList[0];
            this.configArrayList.splice(0,1);
            RES.loadConfig(item.path, item.root);
        }
        else{//全部配置文件加载完成，移除事件监听
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

            // ??个人理解： Indicator.getInstance 每次都新创建个？因为避免覆盖？
            this.processStatus = Indicator.getInstance(this.processStatus).set(ProcessStatus.ConfigLoadEnd).indecate;
            this.onLoadingEnd();
        }
    }

    /**
     * 加载资源配置json完毕
     */
    private onLoadingEnd(): void {
        // 加载所需资源组
        if (Indicator.getChecker(this.processStatus)(ProcessStatus.ConfigLoadEnd | ProcessStatus.ThemeLoadEnd) && !Indicator.getChecker(this.processStatus)(ProcessStatus.ResourceLoadEnd)) {
            this.getResGroupList();
        }
        else if(Indicator.getChecker(this.processStatus)(ProcessStatus.ResourceLoadEnd)){// 如果所需资源全部加载完毕
            //初始化MVC框架
            FacadeApp.inst.startUp(this);
            //注册Mediator。原则上每个Viewer都要对应声明并向FacadeApp注册Mediator
            FacadeApp.inst.registerMediator(new MainMediator(this));// 注册mediator后，进行下一步

            egret.Ticker.getInstance().register((dt: number) => {//执行定时刷新和检测任务
                FacadeApp.inst.Process(dt);  // 网络报文重发
                SkillManager.Process(dt);    // 技能施放、冷却倒计时
            }, this);
            
            // 接收推送并保存到数据仓库
            FacadeApp.inst.watch((data)=>{
                FacadeApp.dispatchAction(CommandList.M_AT_ACTIONEXECUTE, data['info']);
            }, '3006');
            //创建登录界面
            LoginPage.Register(this);
        }
    }

    /**
     * 异步方式加载多个Group，为每个Group指定单独的回调函数，并在全部加载结束后，调用统一的回调
     */
    public getResGroupList(){
        //初始化资源配置信息
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);

        this.groupArrayList.map(url=>{
            RES.loadGroup(url);
        })
    }

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        //单个资源加载结束后，额外执行的操作
        if (event.groupName == "loading") {
            LoadingPage.Register(this); //显示游戏加载页面
        }
        
        //资源加载进度监控：
        let result = 0;
        for(let i = 0; i< this.groupArrayList.length; i++){
            result = result | 1<<i;
            if(this.groupArrayList[i] == event.groupName){
                this.groupProcessStatus = Indicator.getInstance(this.groupProcessStatus).set(1<<i).indecate;
            }
        }
        
        // 检测资源是否加载完成 ??什么意思??为什么这样判断??
        if (Indicator.getChecker(this.groupProcessStatus)(result)) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            
            //全部资源加载完毕
            this.processStatus = Indicator.getInstance(this.processStatus).set(ProcessStatus.ResourceLoadEnd).indecate;
            this.onLoadingEnd();
        }
    }

    /**
     * 资源组加载出错
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load");
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "game") {
            LoadingPage.upDateProgress("loading..." + Math.floor(event.itemsLoaded * 100 / event.itemsTotal).toString() + "%");
        }
    }

    /**
     * 资源组加载出错
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 移除登录界面，开始进入开始页面
     */
    public enterStartScreen(): void {
        LoginPage.inst.UnRegister();
        ConfigStaticManager.Init(); //载入本机静态配置信息
        SkillManager.Init();
        TalismanManager.Init();
        AmuletManager.Init();
        CardManager.Init();
        PetManager.Init();
        GoodsManager.Init();
        TaskManager.Init();
        RewardItemManager.Init();
        UnitManager.Init();
        
        SoundManager.PlayBackgroundMusic();//播放背景音乐

    }

    /**
     * 进入游戏页面
     */
    public enterGameScreen(): void {
		//背景
		this.addChild(BG.GetInstance());

		//近景
		this.addChild(Decoration.GetInstance());

		//战斗
		this.addChild(SoldierManage.FightManager.GetInstance());
       
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, SoldierManage.FightManager.GetInstance()._TouchTap, SoldierManage.FightManager.GetInstance());

        //最上层界面
        this.addChild(Main.Instance.TopSence);

		//UI界面
        UIPage.inst(UIPage).Register(this, false);

        // 检测新手引导
        GuideWindow.inst(GuideWindow).Register(this, false).Show(FacadeApp.read(CommandList.Re_Status).guideId);

    }

    // //添加宝箱
    // public AddBaoXiang(dis:egret.DisplayObject){
    //     if (Main.Instance.TopSence == null){
    //         this._baopxiangDisplay = dis;
    //         return;
    //     }
    //     Main.Instance.TopSence.addChild(dis);
    // }

    /**
     * 震屏函数
     */
    public creatZhenPingFun()
    {
        this.ifCanJiXu=false;
        this.zhenPingX = 50;
        this.zhenPingY = 0.8;
        this.y=0;
        this.x=0;

        if(!this.hasEventListener(egret.Event.ENTER_FRAME))
            this.addEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
    }
    /**
     * 震屏幅度
     */
    private onFrame(e:egret.Event) 
    {
        this.zhenPingX *= -this.zhenPingY;
        this.y = this.zhenPingX;
        this.x = this.zhenPingX;
        if(Math.abs(this.zhenPingX)<0.2)
        {
            this.y = 0;
            this.x = 0;
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
            this.ifCanJiXu = true;
        }
    }

    private ifCanJiXu:boolean=true;
    private zhenPingX:number=50;
    private zhenPingY:number=-0.9;

    /**
     * 单例访问句柄
     */
    public static Instance: Main;
    /**
     * 小飞兔层级
     */
    public TopSence : egret.DisplayObjectContainer;
    /**
     * 宝箱显示对象
     */
    // private _baopxiangDisplay: egret.DisplayObject;
    /**
     * 应用加载状态, 联合枚举
     */
    private processStatus: Number;
    /**
     * Group加载状态
     */
    private groupProcessStatus: Number;
}

/**
 * 描述应用运行进度的联合型枚举
 */
const ProcessStatus = {
    /**
     * 主题加载完毕 
     */
    ThemeLoadEnd: 1 << 0,
    /**
     * 资源加载完毕
     */
    ResourceLoadEnd: 1<< 1,
    /**
     * 配置文件加载完毕
     */
    ConfigLoadEnd: 1<< 2,
};
