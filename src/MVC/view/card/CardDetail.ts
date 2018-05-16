/**
 * 神魔详细信息
 */
class CardDetail extends APanel {
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/card/CardDetailSkins.exml");
	}

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this.anchorOffsetX = 640 / 2;
		this.anchorOffsetY = 1136 / 2;
		this.x = 640 / 2;
		this.y = 1136 / 2;

		this._iconImage = new CardImage();
		this._iconImage.x = 27;
		this._iconImage.y = 159;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);

		this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUpClick, this);
		// this._addButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAddClick, this);
		this._strengthenButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStrengthenClick, this);
		this._jhButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStrengthenClick, this);
		this._jjButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAdvanceClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

	/**
	 * 点击关闭按钮响应
	 */
	private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
	}

	/**
	 * 点击升级按钮响应
	 */
	private _OnUpClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
            FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=2&pm=1&id="+this._card.ID], [data => {			
                if(data[`code`]==FacadeApp.SuccessCode){
					//将网络数据保存到数据仓库，自动触发数据更新
                	FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
					this.ShowGhost(this._card,null);	
                }else{
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
            }]);
		console.log("升级");
	}
	
	/**
	 * 点击强化、激活按钮
	 */
	private _OnStrengthenClick(event: egret.TouchEvent){
		SoundManager.PlayButtonMusic();
		 FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=3&id=" + this._card.ID + "&pm=1"], [data => {		 
			 if(data[`code`] ==FacadeApp.SuccessCode){
				FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
			 	this.ShowGhost(this._card,null);	
			 }else{
				 UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
			 }
        }]);
		console.log("解锁,强化");
	}

	/**
	 * 进阶
	 */
	private _OnAdvanceClick(event:egret.TouchEvent){
		SoundManager.PlayButtonMusic();
            FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=4&pm=1&id="+this._card.ID], [data => {	
                if(data[`code`]==FacadeApp.SuccessCode){
					FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
					this.ShowGhost(this._card,null);	
                }else{
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
            }]);
		console.log("进阶");
	}

	/**
	 * 点击添加按钮响应
	 */
	private _OnAddClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
		//this.parent.removeChild(this);
		console.log("添加");
	}
	
	/**
	 * 显示神魔
	 * @param ghost		显示神魔
	 */
	public ShowGhost(card: Card,type = 1){
        //this._iconImage.texture = RES.getRes(ghost.Icon + "_png");
		this._card = card;
		this._iconImage.ShowCard(this._card);
		this.addChild(this._iconImage);
		this._upButton.visible = false;
		this._jjButton.visible = false;
		this._jhButton.visible = false;
		this._strengthenButton.visible = false;
		switch(this._card.ChooseButton){
			case 1: 
			this._upButton.visible = true;
			this._progressLabel.text = "强化碎片:"+this._card.Chip + '/' + this._card.Chip_up;
			this._progressTiaoIma.width = Math.min(this._card.Chip / this._card.Chip_up, 1) * 314;
			break;
			case 2:
			this._strengthenButton.visible = true;
			this._progressLabel.text = "专属碎片:"+this._card.ori.p + '/' + this._card.Chip_en;
			this._progressTiaoIma.width = Math.min(this._card.ori.p / this._card.Chip_en, 1) * 314;
			break;
			case 3:
			this._jjButton.visible = true;
			this._progressLabel.text = "进阶碎片:"+this._card.AdChip + '/' + this._card.Chip_adv;
			this._progressTiaoIma.width = Math.min(this._card.AdChip / this._card.Chip_adv, 1) * 314;
			break;
			case 4:
			this._jhButton.visible = true;
			this._progressLabel.text = "专属碎片:"+this._card.ori.p + '/' + this._card.Chip_en;
			this._progressTiaoIma.width = Math.min(this._card.ori.p / this._card.Chip_en, 1) * 314;
			break;
			default:
			break;
		}
        // this._nameLabel.text = this._card.Name;
		this._gjLabel.text = this._card.Attack.toString();
		this._fyLabel.text = this._card.Defense.toString();
		this._bjLabel.text = this._card.Spirituality.toString();
		this._sbLabel.text = this._card.Hamility.toString();
		this._llLabel.text = this._card.Valor.toString();
		this._hjLabel.text = this._card.Sacrifice.toString();
		this._rxLabel.text = this._card.Honesty.toString();
		this._jzLabel.text = this._card.Honor.toString();
		this._gdLabel.text = this._card.Compassion.toString();
		this._mzLabel.text = this._card.Justice.toString();
        //this._levelLabel.text = "Lv." + ghost.Level.toString();
        //var gj : Digit = ghost.Gongji;
        //this._gjLabel.text = gj.ShowToString;
        //this._nextGJLabel.text = ghost.NextLVGJ.ShowToString;
        //var totalGJ : Digit = GhostManager.GhostTotalGJ;
		//var perDigit: Digit = CalculateMgr.Mul(new Digit([100]), CalculateMgr.Div(gj, totalGJ));
        //this._account.text = perDigit.ShowToString + "%";
		if(type == 1) this._ShowMovie();
	}

	/**
	 * 显示动画
	 */
    private _ShowMovie(){
        this.scaleX = 0;
        this.scaleY = 0;
        var tw = egret.Tween.get(this);
        tw.to({scaleX:1,scaleY:1}, 200);
    }

    // 变量
	private _closeButton: eui.Button;			// 关闭按钮
	private _upButton: eui.Button;				// 升级按钮
	// private _addButton: eui.Button;				// 添加按钮
	private _jjButton: eui.Button;				// 进阶按钮
	private _jhButton: eui.Button;				// 激活按钮
	private _strengthenButton: eui.Button;		// 强化按钮
	
	private _iconImage: CardImage;				// 神魔图标

	// private _nameLabel: eui.Label;				// 名字
	private _gjLabel: eui.Label;				// 攻击
	private _fyLabel: eui.Label;				// 防御
	private _llLabel: eui.Label;				// 力量
	private _bjLabel: eui.Label;				// 暴击
	private _hjLabel: eui.Label;				// 护甲
	private _sbLabel: eui.Label;				// 闪避
	private _rxLabel: eui.Label;				// 韧性
	private _mzLabel: eui.Label;				// 命中
	private _jzLabel: eui.Label;				// 精准
	private _gdLabel: eui.Label;				// 格挡
	private _progressLabel: eui.Label;			// 碎片数量
	private _progressTiaoIma: eui.Image;		// 碎片进度条

	private _card: Card;                      	// 显示的神魔
}