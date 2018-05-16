const activityBonus = {
    "ActivityScoreBonus": {
        "0":{
            "0": {"score":60, "bonus":[{"type":1000, "id":0, "num":1},{"type":2, "num":2}]},
            "1": {"score":120, "bonus":[{"type":1000, "id":0, "num":1},{"type":2, "num":2}]},
            "2": {"score":360, "bonus":[{"type":1000, "id":0, "num":2},{"type":2, "num":3}]},
            "3": {"score":480, "bonus":[{"type":1000, "id":0, "num":3},{"type":2, "num":3}]},
            "4": {"score":600, "bonus":[{"type":1000, "id":0, "num":4},{"type":2, "num":4}]},
            "5": {"score":720, "bonus":[{"type":1000, "id":0, "num":5},{"type":2, "num":5}]}
        },
        "1":{
            "0": {"score":40, "bonus":[{"type":1000, "id":0, "num":1},{"type":2, "num":1}]},
            "1": {"score":80, "bonus":[{"type":1000, "id":0, "num":1},{"type":2, "num":5}]},
            "2": {"score":200, "bonus":[{"type":1000, "id":0, "num":2},{"type":2, "num":10}]},
            "3": {"score":300, "bonus":[{"type":1000, "id":0, "num":2},{"type":2, "num":10}]},
            "4": {"score":450, "bonus":[{"type":1000, "id":0, "num":3},{"type":2, "num":10}]},
            "5": {"score":600, "bonus":[{"type":1000, "id":0, "num":4},{"type":2, "num":10}]}
        }
    },
    
    "ActivityRankBonus": {
        "0":{
            "1": {"rank":1, "bonus":[{"type":1000, "id":0, "num":10}, {"type":1, "num":150}]},
            "2": {"rank":2, "bonus":[{"type":1000, "id":0, "num":8}, {"type":1, "num":120}]},
            "3": {"rank":3, "bonus":[{"type":1000, "id":0, "num":5}, {"type":1, "num":100}]}
        },
        "1":{
            "1": {"rank":1, "bonus":[{"type":1000, "id":0, "num":10}, {"type":1, "num":150}]},
            "2": {"rank":2, "bonus":[{"type":1000, "id":0, "num":8}, {"type":1, "num":120}]},
            "3": {"rank":3, "bonus":[{"type":1000, "id":0, "num":5}, {"type":1, "num":100}]}
        }
    }    
};
const ActivityType = {
    Money:0,          //累计花费的金币
    Diamond: 1,        //累计花费的钻石    
};


/**
 * 活动界面
 */
class IntegralWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/IntegralWindowSkins.exml");

        //注册界面介质，为避免重复注册，先移除同名介质
        FacadeApp.inst.removeMediator(ViewerName.IntegralWindowMediator);
        FacadeApp.inst.registerMediator(new IntegralWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        let pageGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        pageGroup.addEventListener(egret.Event.CHANGE, this._UpdataPage, this);
        this._integralExchangeRadio.group = pageGroup;
        this._integralExchangeRadio.value = 1;
        this._integralRankRadio.group = pageGroup;
        this._integralRankRadio.value = 2;
        this._UpdataPage(null);
        this.touchEnabled = true;
        this.touchChildren = true;
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._ruleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Integral);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();
        let data = FacadeApp.read(CommandList.Re_ActivityInfo);
        
        this._myRankNumLabel.text = data.rank;
        this._integralTimeLabel.text =  "活动时间："+data.starttime + " 至 " + data.endtime;
        // 移除全部排行行
        if(this._rankArr.length > 0){
            for(var i:number=0; i<this._rankArr.length; i++){
                this._rankGroup.removeChild(this._rankArr[i]);
            }
        }
        this._rankArr = [];
        // 移除全部排行行
        if(this._bonusArr.length > 0){
            for(var i:number=0; i<this._bonusArr.length; i++){
                this._exchangeGroup.removeChild(this._bonusArr[i]);
            }
        }
        this._bonusArr = [];
        if(this._rankGroup.visible){        
            FacadeApp.fetchData([CommandList.M_NET_Activity, "&oper=2"], [data=>{
                if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                else{
                    // 创建排行
                    var lineHeight: number = 0;
                    for (var index in data["data"]["list"]){
                        var itemObject = data["data"]["list"][index];
                        var _rank:IntegralRankList = new IntegralRankList();
                        this._rankGroup.addChild(_rank);
                        _rank.y = lineHeight;
                        lineHeight += _rank.height;
                        this._rankArr.push(_rank);
                        _rank.SetShow(itemObject);
                        this._rankListGroup.stopAnimation();
                        this._rankListGroup.viewport.scrollV=0;

                        this._rankListGroup.bounces=false;
                        this._rankListGroup.verticalScrollBar.autoVisibility = false;
                        this._rankListGroup.verticalScrollBar.visible = false;
                    }
                }
            }]);
        }
        if(this._exchangeGroup.visible){
            var lineHeight: number = 0;
            for (var index in activityBonus.ActivityScoreBonus[data.type]){
                var itemObject = activityBonus.ActivityScoreBonus[data.type][index];
                var _bonus:IntegralExchangeList = new IntegralExchangeList();
                this._exchangeGroup.addChild(_bonus);
                _bonus.y = lineHeight;
                lineHeight += _bonus.height;
                this._bonusArr.push(_bonus);
                _bonus.SetShow(itemObject,index);
                this._exchangeListGroup.stopAnimation();
                this._exchangeListGroup.viewport.scrollV=0;

                this._exchangeListGroup.bounces=false;
                this._exchangeListGroup.verticalScrollBar.autoVisibility = false;
                this._exchangeListGroup.verticalScrollBar.visible = false;
            }
        }
    }
	

	/**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }
    
	/**
     * 打开规则界面
     */
    private onRuleClick(event : egret.TouchEvent){
		FacadeApp.Notify(CommandList.M_CMD_UiOpened_ActivityRule);
    }
    
    /**
     * 更新页面
     */
    private _UpdataPage(evt: egret.Event){
        let value: number = 1;
        if (evt != null){
            let group: eui.RadioButtonGroup = evt.target;
            value = group.selectedValue;
        }
        this._exchangeGroup.visible = value == 1;
        this._rankGroup.visible = value == 2;
        this.Render();
    }


    // 变量
    private _closeButton: eui.Button;
    private _integralExchangeRadio: eui.RadioButton;            // 积分兑换按钮
    private _integralRankRadio: eui.RadioButton;                // 积分排行按钮
    private _ruleButton: eui.Button;                            // 规则按钮
    private _exchangeGroup: eui.Group;                          // 兑换列表容器
    private _exchangeListGroup: eui.Scroller;                      // 兑换列表滚动容器
    private _rankGroup: eui.Group;                              // 排名列表容器
    private _rankListGroup: eui.Scroller;                          // 排名列表滚动容器
    private _myRankNumLabel: eui.BitmapLabel;                   // 我的排名文本
    private _integralTimeLabel: eui.Label;                      // 活动时间
    private _rankArr: any[] = [];                      // 排名列表数据
    private _bonusArr: any[] = [];
}