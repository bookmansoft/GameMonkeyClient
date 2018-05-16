/**
 * 编组界面
 */
class MarshallingWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
		super("resource/game_skins/marshalling/MarshallingWindowSkins.exml");

        FacadeApp.inst.removeMediator(ViewerName.MarshallingWindowMediator);
        FacadeApp.inst.registerMediator(new MarshallingWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._tgtzButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnTGTZClick, this);

        this._firstButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._firstClick,this);
        this._secondButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._secondClick,this);
        this._thirdButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._thirdClick,this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Marshalling);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();

        this._firstButton.selected = this.MarshallingID == 1 ? true : false;
        this._secondButton.selected = this.MarshallingID == 2 ? true : false;
        this._thirdButton.selected = this.MarshallingID == 3 ? true : false;

        let allMarshallingSet = FacadeApp.read(CommandList.Re_CardtInfo).marshallingList;
        let curMarshallingSet = allMarshallingSet[this.MarshallingID];

        // 更新上阵卡牌
        for(let i=0; i<10; i++){
            if(!this._marshaSet[i]){
                let block = new MarshallingLine();
                this._marshallinGroup.addChild(block);
                this._marshaSet[i] = block;
                this._marshaSet[i].x = Math.floor(i % 5) * block.width - 7;
                this._marshaSet[i].y = Math.floor(i / 5) * block.height + 15;
            }
            this._marshaSet[i].UpData(CardManager.GetCardByID(curMarshallingSet[i]),1);
        }


        // 获取所有卡牌
        let card = FacadeApp.read(CommandList.Re_CardtInfo).list;
        let indexList = Object.keys(card).filter(id=>{
            // 悟空不显示
            if(id == "1"){
                return false;
            }
            // 已上阵的不显示
            for(let i=0 ;i<curMarshallingSet.length; i++){
                if(id == curMarshallingSet[i]){
                    return false;
                }
            }
            return true;
        });

        
        // 判断已解锁卡牌
        let canMarshSet = [];
        for(let i = 0; i < indexList.length; i++){
            if(CardManager.fromData(card[indexList[i]]).Lv > 0){
                canMarshSet.push(CardManager.fromData(card[indexList[i]]));
            }
        }


        // 生成未上阵卡牌
        for(let i=0; i<canMarshSet.length; i++){
            if(!this._allCardSet[i]){
                let block = new MarshallingLine();
                this._cardGroup.addChild(block);
                this._allCardSet[i] = block;
                this._allCardSet[i].x = Math.floor(i % 5) * block.width - 7;
                this._allCardSet[i].y = Math.floor(i / 5) * block.height;
            }
            this._allCardSet[i].UpData(canMarshSet[i],0);
        }

        // 超过，移除
        if(this._allCardSet.length > canMarshSet.length){
            for(let i=this._allCardSet.length - 1; i > canMarshSet.length-1; i--){
                this._cardGroup.removeChild(this._allCardSet[i]);
                this._allCardSet.splice(i,1);
            }
        }
    }

    /**
     * 显示，用于判断显示是否需要战斗按钮
     */
    public show(data){
        this._emeyId = data;
        this._tgtzButton.visible = data ? true : false;
    }


	/**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }
    
    /**
     * 第一组按钮响应
     */
    private _firstClick(event:egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        MarshallingWindow._marshallingID = 1;
        FacadeApp.Notify(CommandList.M_CMD_Change_Marshalling);
    }
    /**
     * 第二组按钮响应
     */
    private _secondClick(event:egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        MarshallingWindow._marshallingID = 2;
        FacadeApp.Notify(CommandList.M_CMD_Change_Marshalling);
    }
    /**
     * 第三组按钮响应
     */
    private _thirdClick(event:egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        MarshallingWindow._marshallingID = 3;
        FacadeApp.Notify(CommandList.M_CMD_Change_Marshalling);
    }


	/**
     * 天宫挑战响应
     */
    private _OnTGTZClick(event : egret.TouchEvent){
		SoundManager.PlayCloseWinMusic();

        FacadeApp.fetchData([CommandList.M_NET_Card,"&oper=6&openid=" + this._emeyId + "&gid=" + this.MarshallingID],[data=>{
            if(data["code"] != FacadeApp.SuccessCode){
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }else{
                PVPManager.PVPFightManager.GetInstance()._PVPFightControlSet = data["data"]["operation"];
                // this.CloseWindow();
		        // FacadeApp.Notify(CommandList.M_CMD_ShowPVPFightWindow);
                this.UnRegister();
		        FacadeApp.Notify(CommandList.M_CMD_ShowPVPFightWindow);
            }
        }]);
    }
    

    /**
     * 编组id
     */
    public get MarshallingID():number{
        return MarshallingWindow._marshallingID;
    }

    /**
     * 设置编组id
     */
    public set MarshallingID(gid:number){
        MarshallingWindow._marshallingID = gid;
    }


    /**
     * 获取编组id
     */
    public static GetMarshallingID():number{
        return this._marshallingID;
    }

    // 变量
    private _closeButton : eui.Button;                  // 关闭按钮
    private _cardList : eui.Scroller;                   // 卡牌列表
    private _cardGroup : eui.Group;                     // 滚动容器
	private _tgtzButton : eui.Button;					// 天宫挑战按钮
    private static _marshallingID : number = 1;         // 编组id
    private _firstButton : eui.RadioButton;             //第一组
    private _secondButton : eui.RadioButton;            //第二组
    private _thirdButton : eui.RadioButton;             //第三组
    private _marshaSet: MarshallingLine[] = [];         // 已上阵卡牌
    private _allCardSet : MarshallingLine[] = [];       // 所有已解锁卡牌集合
    private _marshallinGroup: eui.Group;                // 编组容器
    public _kazuNum:number = 0;                         // 卡组页码 0第一组 1第二组 2第三组   

    private _emeyId: number = null;                     // 敌方ID           
}