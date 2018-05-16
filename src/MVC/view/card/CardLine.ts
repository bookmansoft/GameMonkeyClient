/**
 * 卡牌
 */
class CardLine extends eui.Component implements IGroupLine{
	/**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/card/CardListSkins.exml";
    }

    //实现接口
    public get getId():number{
        return this.Card ? this.Card.ID : -1;
    };

    /**
     * 更新
     */
    public update(card:any):CardLine{
        this._card = CardManager.fromData(card);
        this.Render();
        return this;
    }


    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._stateButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStateClick, this);
        this._iconIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnImageClick, this);
        this._strengthenButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStrengthenClick, this);
		this._jhButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStrengthenClick, this);
		this._jjButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAdvanceClick, this);
        this._isCreat = true;

        this.Render();
    }

    /**
     * 刷新页面
     */
    public Render(){
        if(!this._isCreat) return;
        // this._stateButton.enabled = this._card.ori.en > 0 || this._card.ori.p >= 200;
        this._stateButton.visible = false;
		this._jjButton.visible = false;
		this._jhButton.visible = false;
		this._strengthenButton.visible = false;
        switch(this._card.ChooseButton){
			case 1: 
			this._stateButton.visible = true;
			this._progressLabel.text = this._card.Chip + '/' + this._card.Chip_up;
			this._progressIma.width = Math.min(this._card.Chip / this._card.Chip_up, 1) * 192;
			break;
			case 2:
			this._strengthenButton.visible = true;
			this._progressLabel.text = this._card.ori.p + '/' + this._card.Chip_en;
			this._progressIma.width = Math.min(this._card.ori.p / this._card.Chip_en, 1) * 192;
			break;
			case 3:
			this._jjButton.visible = true;
			this._progressLabel.text = this._card.AdChip + '/' + this._card.Chip_adv;
			this._progressIma.width = Math.min(this._card.AdChip / this._card.Chip_adv, 1) * 192;
			break;
			case 4:
			this._jhButton.visible = true;
			this._progressLabel.text = this._card.ori.p + '/' + this._card.Chip_en;
			this._progressIma.width = Math.min(this._card.ori.p / this._card.Chip_en, 1) * 192;
			break;
			default:
			break;
		}

        this._iconIma.source = this._card.Prototype.HeadRes;    // <egret.Texture> await MovieManage.PromisifyGetRes(this._card.Prototype.HeadRes);
        this._nameIma.source = this._card.Prototype.NameIcon;   // <egret.Texture> await MovieManage.PromisifyGetRes(this._card.Prototype.NameIcon);


        this._iconIma.filters = this._card.Lv <= 0 ? [FilterManage.HuiDu] : [];

    }


    /**
     * 状态点击响应
     */
	private _OnStateClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
            FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=2&pm=1&id="+this.Card.ID], [data => {
                //将网络数据保存到数据仓库，自动触发数据更新
                if(data[`code`]==FacadeApp.SuccessCode){
                    FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
                    this.Render();       
                }else{
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
            }]);
	}

    /**
	 * 点击强化、激活按钮
	 */
	private _OnStrengthenClick(event: egret.TouchEvent){
	    SoundManager.PlayLvupMusic();
		FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=3&id=" + this._card.ID + "&pm=1"], [data => {
			 if(data[`code`] ==FacadeApp.SuccessCode){
                 FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
			    this.Render();  
			 }else{
				 UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
			 }
        }]);
		// console.log("解锁,强化",this._card.ID);
	}

	/**
	 * 进阶
	 */
	private _OnAdvanceClick(event:egret.TouchEvent){
		SoundManager.PlayLvupMusic();
            FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=4&pm=1&id="+this._card.ID], [data => {         
                if(data[`code`]==FacadeApp.SuccessCode){
                    FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=1"], [data => {  
                       FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
                    }]);
				    this.Render(); 
                }else{
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
            }]);
		// console.log("进阶");
	}


    /**
     * 图标点击响应
     */
    private _OnImageClick(event: egret.TouchEvent){
        FacadeApp.Notify(CommandList.M_CMD_ShowCard, this._card);
    }

    /**
     * 更改状态，灰度，高亮，正常
     */
    // public changeState($state){
    //     if($state == "huidu"){
    //         this._bgIma.setHuiduState();
    //         this._iconIma.filters = [FilterManage.HuiDu];
    //         this._stateButton.enabled = false;
    //         this._stateButton.filters = [FilterManage.HuiDu];
    //     }
    //     else if($state == "gaoliang"){
    //         this._bgIma.setGaoLiangState();
    //         this._iconIma.filters = null;
    //         this._stateButton.enabled = true;
    //         this._stateButton.filters = null;
    //     }
    //     else if($state == "normal"){
    //         this._bgIma.setNormalState();
    //         this._iconIma.filters = null;
    //         this._stateButton.enabled = true;
    //         this._stateButton.filters = null;
    //     }
    // }

    /**
     * 取得显示神魔
     */
    public get Card(): Card{
        return this._card;
    }


    //  变量
    private _bgIma: ListBgImage;                // 可更换背景
    private _iconIma : eui.Image;             	// 神魔图标
    private _nameIma : eui.Image;             	// 神魔名字
	private _shuxingIma : eui.Image;         	// 属性
	private _progressIma : eui.Image;           // 碎片进度条
	private _progressLabel : eui.Label;         // 碎片数量
	private _pinzhiIma : eui.Image;             // 物品图标
    private _stateButton:eui.Button;            // 出战按钮 休息按钮
    private _card: Card;                        // 显示的物品
    private _jjButton: eui.Button;
    private _jhButton: eui.Button;
    private _strengthenButton: eui.Button;
    private _isCreat: boolean = false;          // 是否创建完成
}