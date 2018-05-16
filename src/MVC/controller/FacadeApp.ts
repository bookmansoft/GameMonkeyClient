/**
 * MVC门脸。socket连接
 */
class FacadeApp extends puremvc.Facade implements puremvc.IFacade {
    /**
     * 构造函数，此处必须注册所有Reducer
     */
    public constructor() {
        super();

        //初始化Socket连接
        this.SocketInit();

        //this.localStore = redux.createStore(reducers);
        // 生成附加中间件的数据仓库
        const mw_auth = store => next => action => {
            next(action);
        };
        let createStoreWithMiddleware = redux.applyMiddleware(mw_auth)(redux.createStore);
        this.localStore = createStoreWithMiddleware(reducers);
    }

    /**
     * 建立WebSocket连接
     */
    private SocketInit(){
        if(GameConfigOfRuntime.commMode != CommMode.socket){
            return;
        }

        this.socket = io.connect(`${GameConfigOfRuntime.ServerUrl}:${GameConfigOfRuntime.ServerPort}`, {forceNew: true});

        let self = this;
        this.socket.on('connect', function(){
            self.trace("开始登录");
            self.login(); //自动登录

            if(self._currentNetCon){
                self._GetData(self._currentNetCon.ReqSet, self._currentNetCon.CompleteFun, self._currentNetCon.Router);
                self._currentNetCon = null;
            }
        });
        this.socket.on('disconnect', function(){
            self.trace("连接已断开");
            self.socket.connect();//自动重连
        });
        this.socket.on('chat msg', function(msg){//聊天信息
            self.timerOfExpired = 0; //收到业务包，清除超时时钟
            self.trace("receive message: " + msg);
        });
        this.socket.on('active msg', function(msg){//心跳包
            self.timerOfExpired = 0; //收到心跳包，清除超时时钟
        });
        this.socket.on('notify', msg=>{// 服务端发下来的消息
            if(!!this.notifyHandles[msg.type]){
                this.notifyHandles[msg.type](msg);
            }
            else if(!!this.notifyHandles["default"]){
                this.notifyHandles["default"](msg);
            }
        });
        //默认的下行消息处理
        this.watch(msg=>{
        });
    }

    /**
     * 发送下一条
     */
    private _NextSend() {
        this._currentNetCon = null;
        if (this._requestFirstSet.length > 0) {
            this._currentNetCon = this._requestFirstSet.shift();
        }
        else if (this._requestSecondSet.length > 0) {
            this._currentNetCon = this._requestSecondSet.shift();
        }
        if (this._currentNetCon != null) {
            this._GetData(this._currentNetCon.ReqSet, this._currentNetCon.CompleteFun, this._currentNetCon.Router);
        }
    }

    /**
     * 从服务器获取参数到本地
     * @param setFunc       参数方法
     * @param paramSet      参数集合
     */
    private _GetData(paramSet: any[], setFunc: Array<Function>, router: string = 'q') {
        let pid = (router == 'q' ? 'sessionid' : 'id');
        let url_base: string =  pid + "=" + UnitManager.PlayID + "&act=";
        if (paramSet != null){
            for (var i = 0; i < paramSet.length; i++){
                url_base += paramSet[i];
            }
        }

        switch(GameConfigOfRuntime.commMode){
            case CommMode.socket:
                if(this.socket.disconnected){
                    this.socket.connect();
                }
                else{
                    this._currentSendUrl = `${router}?` + url_base;
                    let func = setFunc[0];
                    this.socket.emit('req', {
                        url: this._currentSendUrl,
                    }, (data)=>{
                        this.timerOfExpired = 0; //收到业务包，清除超时时钟
                        let netJson = data;//解析JSON数据
                        if(netJson != null && typeof netJson.code != 'undefined' && netJson.code != null){
                            func(netJson);
                        }
                    });
                    this._currentNetCon = null;
                }
                break;
            default: //创建GET请求
                this._currentSendUrl = `${GameConfigOfRuntime.ServerUrl}:${GameConfigOfRuntime.ServerPort}/public/${router}?` + url_base;
                console.log(this._currentSendUrl);
                let loader: egret.URLLoader = new egret.URLLoader();
                loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                
                //增加了错误捕获处理
                if (setFunc.length > 1 && setFunc[1]) {
                    loader.addEventListener(egret.IOErrorEvent.IO_ERROR, setFunc[1], this);
                }

                let request: egret.URLRequest = new egret.URLRequest(this._currentSendUrl);
                request.method = egret.URLRequestMethod.GET;
                loader._request = request;

                loader.addEventListener(egret.Event.COMPLETE, resp=>{
                    if (resp == null) {
                        this._NextSend();
                        return;
                    }
                    let loader : egret.URLLoader = resp.target;
                    try {
                        let dataJson: Object = JSON.parse(loader.data);
                        if (dataJson["code"] != FacadeApp.SuccessCode){
                            console.log(FacadeApp._errorCodeSet[dataJson["code"].toString()]);
                            console.log("发送链接：" + this._currentSendUrl);
                        }
                        setFunc[0](dataJson);
                        this._NextSend();
                    }
                    catch (e) {
                        console.log("消息处理出错,发送链接：" + this._currentSendUrl);
                        console.log(e);
                        if (setFunc.length > 1 && setFunc[1]) {
                            setFunc[1](e);
                        }
                        this._NextSend();
                    }
                }, this);
                loader.load(loader._request);
                break;
        }
    }

     /**
     * 发送网络请求
     * @param reqSet        网络请求,为URL拼接字
     * @param fun           网络请求方法
     * @param isPriority    优先级（默认优先）
     */
    public SendRequest(reqSet: any, funs: Array<Function>, isPriority: boolean = true, router:string = 'q') {
        if (FacadeApp._errorCodeSet == null){
            FacadeApp._InitErrorCode();
        }

        switch(GameConfigOfRuntime.commMode){
            case CommMode.socket:
                if(this.socket.disconnected){
                    this._currentNetCon = new NetContent(reqSet, funs, router);
                    this.socket.connect();
                }
                else{
                    this._GetData(reqSet, funs, router);
                }
                break;

            default:
                var netContent: NetContent = new NetContent(reqSet, funs, router);
                if (isPriority) {
                    this._requestFirstSet.push(netContent);
                }
                else {
                    this._requestSecondSet.push(netContent);
                }
                if (this._currentNetCon == null) {
                    this._NextSend();
                }

                break;
        }        
    }

    /**
     * 向远程服务器发送获取数据请求
     */
    public static fetchData(reqSet: any, funs: Array<Function>, isPriority: boolean = true, router:string = 'q'){
        FacadeApp.inst.SendRequest(reqSet, funs, isPriority, router);
    }

    /**
     * fetchData的Promise封装
     */
    public static PromisifyFetch(req:any){
        return new Promise( (resolve, reject) => {
            try{
                FacadeApp.fetchData(req, [data=>{resolve(data);}, e=>{reject(e);}], true, 'q');
            }
            catch(e){
                reject(e); 
            }
        });
    }

    /**
     * PromisifyFetch的数组化封装，同时返回多个网络请求的返回
     */
    public static PromisifyFetchList(reqs:Array<any>){
        try{
            return Promise.all(reqs.map(it=>{
                return FacadeApp.PromisifyFetch(it);
            }));
        }catch(e){
            console.log(JSON.stringify(e));
            return null;
        }
    }

    /**
     * 登录
     */
    private login(){
        //提交消息时传入函数，配合服务端实现JSONP模式：
        this.socket.emit('login msg', {'name':'1', 'password':'pwd', 'room': 'Mary'}, (data)=>{
            switch(data.code){
                case '0': //登录成功
                    break;
                case '1': //房间不存在
                    break;
                case '2': //密码不正确
                    break;
                case '3': //用户不存在
                    break;
            }
        });
    }

    /**
     * 显示错误信息
     */
    public static ShowError(errorCode:any){
		UIPage.inst(UIPage).ShowTrottingHorseLampWindow(FacadeApp._errorCodeSet[errorCode]);
    }
    
    /**
     * 打印日志
     */
    private trace(msg:string):void {
        console.log(msg);
    }

    /**
     * 发送聊天消息
     */
    public SendChatMsg(msg:string){
        if(GameConfigOfRuntime.commMode == CommMode.socket && this.socket && this.socket.connected){
            this.socket.emit('chat msg', msg);
        }
    }

    /**
     * 定时维护任务
     * @param frameTime     两次调用间隔时间
     */
    public Process(frameTime: number) {
        this.timerOfResent += frameTime;
        if(this.timerOfResent >= 1000*15){
            this.timerOfResent = 0;
            if (FacadeApp.inst._currentNetCon != null) {
                console.log("消息处理超时,链接：" + this._currentSendUrl);
                this._NextSend();
            }
        }

        if(GameConfigOfRuntime.commMode == CommMode.socket){
            this.timerOfExpired += frameTime;
            this.timerOfActive += frameTime;

            if(this.timerOfActive >= 1000*15){ //定时发送心跳包
                this.timerOfActive = 0;
                this.socket.emit('active msg');
            }

            if(this.timerOfExpired >= 1000*60){//一段时间没有收到消息，主动断开重连
                this.timerOfExpired = 0;
                if(this.socket.disconnected){
                    this.socket.connect();
                }
                else{
                    this.socket.disconnect();
                }
            }
        }
    }




    /************************** MVC *****************************/


    /**
     * 启动PureMVC，在应用程序中调用此方法，并传递应用程序本身的引用
     * @param	rootView	-	PureMVC应用程序的根视图root，包含其它所有的View Componet
     */
    public startUp(rootView: egret.DisplayObjectContainer): void {
        this.sendNotification(FacadeApp.STARTUP, rootView);
        this.removeCommand(FacadeApp.STARTUP); //PureMVC初始化完成，注销STARUP命令
    }

    /**
     * 框架-初始化控制器
     */
    public initializeController(): void {
        super.initializeController();
        this.registerCommand(FacadeApp.STARTUP, StartupCommand);
    }

    /**
     * 向数据仓库分发Action，注意该操作在修改数据仓库的同时，也会通过事件通知数据仓库观察者
     * 注1：观察者需事先通过AddListener订阅事件
     */
    public static dispatchAction(actionType: string, data?: any){
        if(data != null){
            let action = null;
            if(Object.keys(FacadeApp.inst.actionList).indexOf(actionType) !=-1){
                action = FacadeApp.inst.actionList[actionType];
            }
            if(action != null){
                //修改数据仓库
                FacadeApp.inst.localStore.dispatch(action(data));
            }
        }

        //通知观察者
        let observers: Observer[] = FacadeApp.listeners[actionType];  
        if (!observers) 
            return;

        let length = observers.length;  
        for (let i = 0; i < length; i++) {  
            let observer = observers[i];  
            observer.notify(actionType, data);  
        } 
    }

    /**
     * 向Mediator发送通知
     * 注：负责接收的Mediator需要在 listNotificationInterests 中罗列所有消息类型
     */
    public static Notify(name: string, body?: any, type?: string): void{
        FacadeApp.inst.sendNotification(name, body, type);
    }

	/**   
	 * 注册事件
	 * @param name 事件名称  
	 * @param callback 回调函数  
	 * @param context 上下文
     *   
     * @note 和dispatchAction函数配套使用  
	 */  
	public static AddListener(name: string, callback: Function, context?: any) {  
		let observers: Observer[] = FacadeApp.listeners[name];  
		if (!observers) {  
			FacadeApp.listeners[name] = [];  
		}  
		FacadeApp.listeners[name].push(new Observer(callback, context));  
	}  

	/**  
	 * 移除事件  
	 * @param name 事件名称  
	 * @param callback 回调函数  
	 * @param context 上下文  
	 */  
	public static RemoveListener(name: string, callback: Function, context?: any) {  
		let observers: Observer[] = FacadeApp.listeners[name];  
		if (!observers) return;  
		let length = observers.length;  
		for (let i = 0; i < length; i++) {  
			let observer = observers[i];  
			if (observer.compar(context)) {  
				observers.splice(i, 1);  
				break;  
			}  
		}  
		if (observers.length == 0) {  
			delete FacadeApp.listeners[name];  
		}  
	}  

    /**
     * 注册操作数据仓库的Action
     */
    public registerAction(type: string, action: any){
        this.actionList[type] = action;
    }
    
    /**
     * 读取数据仓库的数据：子仓库名称 数据项名称
     */
    public static read(groupName: string, itemName?: string){
        if(typeof itemName == 'undefined' || itemName == null){
            return this.inst.localStore.getState()[groupName];
        }
        else{
            return this.inst.localStore.getState()[groupName][itemName];
        }
    }

    /**
     * 生成Reducer闭包
     */
    public static cr(initialState, handlers){
        return function reducer(state = initialState, action){
            if(handlers.hasOwnProperty(action.type)){
                return handlers[action.type](state, action);
            }
            else{
                return state;
            }
        }
    }    
    /**
     * 生成Action闭包
     */
    public static ca(type, ...argNames) {
        return function(...args){
            let action = {type};
            argNames.forEach((arg, index) =>{
                action[argNames[index]] = args[index];
            });
            return action;
        }
    }

    /**
     * 对单例的访问
     */
    public static get inst(): FacadeApp {
        if (this.instance == null) this.instance = new FacadeApp();
        return <FacadeApp><any>(this.instance);
    }

    /**
     * 计算原始数值经效果加成后的数值
     */
    public static Calc(etype:number, oriValue:number):number{
        return this.read(CommandList.Re_Status).Calc(etype, oriValue);
    }

    /**
     * 初始化错误代码
     */
    private static _InitErrorCode(){
        FacadeApp._errorCodeSet = {
            2001: '活动已结束',
            0:'操作成功',
            1:'非法用户',
            101:'非法任务索引',
            102:'任务奖励已领取',
            103:'任务尚未完成',
            201:'建筑等级已达最大',
            202:'建筑物无需修复',
            301:'敌人金币不足',
            302:'指定目标用户不存在',
            303:'打招呼冷却中',
            304:'当前是敌人',
            305:'当前是朋友',
            306:'好友数量超限',
            307:'没有发现合适的偷取对象',
            308:'没有发现合适的攻击对象',
            309:'受限行为达到最大次数',
            310:'自己当前是奴隶',
            311:'奴隶数量超出限制',
            312:'已被他人抓获',
            313:'战斗失利，抓捕失败',
            314:'战斗失利，逃跑失败',
            315:'已被自己抓获',
            401:'宠物尚未开始孵化',
            402:'指定宠物不存在',
            403:'达到宠物数量上限',
            404:'角色达到最大等级',
            501:'指定道具不存在',
            502:'指定道具数量不足',
            503:'指定道具已拥有',
            504:'指定道具当前无法购买',
            601:'关卡：用时太短',
            602:'关卡：用时太长',
            603:'关卡：体力不足',
            604:'关卡：尚未开始',
            605:'关卡：战斗中',
            606:'关卡：扫荡中',
            607:'关卡：领奖中',
            608:'关卡：异常得分',
            609:'关卡：异常关卡号',
            610:'关卡：未注册(抓捕或起义)',
            701:'角色：角色碎片数量不足',
            801:'当日奖励已经领取',
            901:'活动: 奖励已领取',
            902:'活动：没有上榜',
            903:'活动：没有开始',
            9000:'未知错误',
            9001:'非法数据',
            9002:'数据为空',
            9003:'金币不足',
            9004:'体力不足',
            9005:'数据库错误',
            9006:'第三方平台校验失败',
            9007:'由于客户端上行了无法解析的路由信息，导致服务端路由失败',
            9008:'连接数太多',
            9009:'元宝不足',
            2002: '活动未开始',
            2003: '当前关卡编号错误',
            2004: '消灭怪物数量未达标',
            2005: '战斗结果异常',
            2006: '战斗超时',
            2007: '用时太短，有外挂嫌疑',
            2008: '冷却时间未到',
            2009: '商品不存在',
            2010: '达到数量限制',
            2011: '元宝不足',
            2012: '金币不足',
            2013: '专属碎片不足',
            2014: '达到最大等级',
            2015: '通用：数量不足',
            2016: '无法激活图腾：关联魔宠未激活',
            2018: '处于挂机状态',
            2019: '权限不足',
            2020: '成员满',
            2021: '用户不存在',
            2022: '联盟不存在',
            2023: '已经加入了联盟',
            2024: '入盟申请不存在',
            2025: '数据不存在',
            2026: '荣誉会员，不能开除',
            2027: '敌对关系',
            2028: '己方宣战数量满',
            2029: '敌方宣战数量满',
            2030: '入盟CD中',
            2031: '等待批准加入',
            2032: '战力不足',
            2033: '没有加入联盟',
            2034: '数据错误，稍后再试',
            2035: '缓存管理器错误',
            3001: '缺少通用升级碎片',
            3002: '缺少专有升星碎片', 
            3003: '缺少专有升阶碎片'
        };
        // FacadeApp._errorCodeSet["1"] = '非法用户';
        // FacadeApp._errorCodeSet["101"] = "非法任务索引";
        // FacadeApp._errorCodeSet["102"] = "任务奖励已领取";
        // FacadeApp._errorCodeSet["103"] = "任务尚未完成";
        // FacadeApp._errorCodeSet["201"] = "建筑等级已达最大";
        // FacadeApp._errorCodeSet["202"] = "建筑物无需修复";
        // FacadeApp._errorCodeSet["301"] = "敌人金币不足";
        // FacadeApp._errorCodeSet["302"] = "指定目标用户不存在";
        // FacadeApp._errorCodeSet["303"] = "打招呼冷却中";
        // FacadeApp._errorCodeSet["304"] = "当前是敌人";
        // FacadeApp._errorCodeSet["305"] = "当前是朋友";
        // FacadeApp._errorCodeSet["306"] = "好友数量超限";
        // FacadeApp._errorCodeSet["307"] = "没有发现合适的偷取对象";
        // FacadeApp._errorCodeSet["308"] = "没有发现合适的攻击对象";
        // FacadeApp._errorCodeSet["309"] = "受限行为达到最大次数";
        // FacadeApp._errorCodeSet["310"] = "自己当前是奴隶";
        // FacadeApp._errorCodeSet["311"] = "奴隶数量超出限制";
        // FacadeApp._errorCodeSet["312"] = "已被他人抓获";
        //         FacadeApp._errorCodeSet["313"] = '战斗失利，抓捕失败';
        // FacadeApp._errorCodeSet["314"] = "战斗失利，逃跑失败";
        // FacadeApp._errorCodeSet["315"] = "已被自己抓获";
        // FacadeApp._errorCodeSet["401"] = "宠物尚未开始孵化";
        // FacadeApp._errorCodeSet["402"] = "指定宠物不存在";
        // FacadeApp._errorCodeSet["403"] = "达到宠物数量上限";
        // FacadeApp._errorCodeSet["404"] = "角色达到最大等级";
        // FacadeApp._errorCodeSet["501"] = "指定道具不存在";
        // FacadeApp._errorCodeSet["502"] = "指定道具数量不足";
        // FacadeApp._errorCodeSet["503"] = "指定道具已拥有";
        // FacadeApp._errorCodeSet["504"] = "指定道具当前无法购买";
        // FacadeApp._errorCodeSet["601"] = "关卡：用时太短";
        // FacadeApp._errorCodeSet["602"] = "关卡：用时太长";
        // FacadeApp._errorCodeSet["603"] = "关卡：体力不足";
        // FacadeApp._errorCodeSet["604"] = "关卡：尚未开始";
        // FacadeApp._errorCodeSet["605"] = "关卡：战斗中";
        // FacadeApp._errorCodeSet["606"] = "关卡：扫荡中";
        // FacadeApp._errorCodeSet["607"] = "关卡：领奖中";
        //         FacadeApp._errorCodeSet["608"] = "关卡：异常得分";
        // FacadeApp._errorCodeSet["609"] = "关卡：异常关卡号";
        // FacadeApp._errorCodeSet["610"] = "关卡：未注册(抓捕或起义)";
        // FacadeApp._errorCodeSet["701"] = "指定道具已拥有";
        // FacadeApp._errorCodeSet["504"] = "指定道具当前无法购买";
        // FacadeApp._errorCodeSet["601"] = "关卡：用时太短";
        // FacadeApp._errorCodeSet["602"] = "关卡：用时太长";
        // FacadeApp._errorCodeSet["603"] = "关卡：体力不足";
        // FacadeApp._errorCodeSet["604"] = "关卡：尚未开始";
        // FacadeApp._errorCodeSet["605"] = "关卡：战斗中";
        // FacadeApp._errorCodeSet["606"] = "关卡：扫荡中";
        // FacadeApp._errorCodeSet["607"] = "关卡：领奖中";


    }

    /**
     * 注册服务端下行句柄
     */
    public watch(cb, etype = "default"){
        this.notifyHandles[etype] = cb;
        return this;
    }

    /**
     * 服务端下行处理的句柄列表
     */
    private notifyHandles = {}; 


    /**
     * 正确代码
     */
    public static SuccessCode: number = 0;
    // socket变量
    private _requestFirstSet: NetContent[] = [];                     // 网络请求集合(优先级高)
    private _requestSecondSet: NetContent[] = [];                    // 网络请求集合(优先级低)
    private _currentNetCon: NetContent = null;                       // 当前请求内容
    private _currentSendUrl: string;                                 // 当前发送链接
    private timerOfExpired: number = 0;                              // 超时检测时钟
    private timerOfResent:number = 0;                                // 重发时钟
    private timerOfActive:number = 0;                                // 心跳始终
    
    public static _errorCodeSet: any;                     // 错误代码
    private socket: SocketIOClient.Socket;                           // webSocket通讯组件

    /**
     * 自启动事件
     */
    public static STARTUP: string = "STARTUP";
	/** 事件-观察者列表 */  
	private static listeners = {};  
    /**
     * 数据仓库
     */
    private localStore : any = null;
    /**
     * Action列表
     */
    private actionList = {};   
}

/**
 * 基础通讯方式
 */  
enum CommMode{
	web,
	socket,
}

/**
 * 开始命令
 */
class StartupCommand extends puremvc.MacroCommand {

    public constructor() {
        super();
    }
    public initializeMacroCommand(): void {
        this.addSubCommand(ControllerPrepCommand);
    }
}

/**  
 * 观察者  
 */  
class Observer {  
	/** 回调函数 */  
	private callback: Function = null;  
	/** 上下文 */  
	private context: any = null;  

	constructor(callback: Function, context: any) {  
		let self = this;  
		self.callback = callback;  
		self.context = context;  
	}  

	/**  
	 * 发送通知  
	 * @param args 不定参数  
	 */  
	notify(...args: any[]): void {  
		let self = this;  
		self.callback.call(self.context, ...args);  
	}  

	/**  
	 * 上下文比较  
	 * @param context 上下文  
	 */  
	compar(context: any): boolean {  
		return context == this.context;  
	}  
}  

/**
 * 网络请求数据
 */
class NetContent {
    /**
     * 构造方法
     */
    public constructor(reqSet: any, funs: Array<Function>, router:string) {
        this._reqSet = reqSet;
        this._completeFun = funs;
        this._router = router;
    }
    
    /**
     * 请求集合
     */
    public get ReqSet(): any {
        return this._reqSet;
    }
    
    /**
     * 完成回调
     */
    public get CompleteFun(): Array<Function> {
        return this._completeFun;
    }
    public get Router(): string {
        return this._router;
    }


    // 变量
    private _reqSet: any;                       // 请求集合（用于参数拼接）
    private _completeFun: Array<Function>;      // 完成回调
    private _router: string;                    // 路由选择
}