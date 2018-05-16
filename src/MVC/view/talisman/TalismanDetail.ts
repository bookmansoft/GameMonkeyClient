/**
 * 物品详细界面
 */
class TalismanDetail extends APanel {
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/talisman/TalismanDetailWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this.anchorOffsetX = 640 / 2;
		this.anchorOffsetY = 1136 / 2;
		this.x = 640 / 2;
		this.y = 1136 / 2;

		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._leftButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnLeftClick, this);
        this._rightButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRightClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this._ShowMovie();
    }

    /**
     * 刷新
     */
    public async Render(){
        this.ShowTalisman(this._talisman);
    }

	/**
     * 向左按钮响应
     */
    private _OnLeftClick(event: egret.TouchEvent){
        let newId:number = this._talisman.ID - 1;
        let talismans = FacadeApp.read(CommandList.Re_TalismanInfo).list; 
        let talisman = talismans[newId];
        if (talisman != null){
            this.ShowTalisman(TalismanManager.fromData(talisman));
        }
        else{
            console.log("法宝为空" + this._talisman.ID);
        }
    }

    /**
     * 向右按钮响应
     */
    private _OnRightClick(event: egret.TouchEvent){
        let newId:number = this._talisman.ID - (-1);
        let talismans = FacadeApp.read(CommandList.Re_TalismanInfo).list; 
        let talisman = talismans[newId];
        if (talisman != null){
            this.ShowTalisman(TalismanManager.fromData(talisman));
        }
        else{
            console.log("法宝为空" + this._talisman.ID);
        }
    }

	/**
	 * 点击关闭按钮响应
	 */
	private _OnCloseClick(event: TouchEvent){
        this.UnRegister();
	}

	/**
	 * 显示法宝
	 * @param talisman		显示法宝
	 */
	public ShowTalisman(talisman: Talisman){
		this._talisman = talisman;

		RES.getResAsync(talisman.Icon+"_png",icon =>{ this._talismanImage.texture = icon},this);
        RES.getResAsync(talisman.NameRes + "_png",icon =>{ this._nameIma.texture = icon},this);

        this._levelLabel.text = "Lv." + talisman.Level.toString();
        var gj : Digit = talisman.Gongji;
        this._gjLabel.text = gj.ShowToString;
        this._nextGJLabel.text = talisman.NextLVGJ.ShowToString;
        var totalGJ : Digit = TalismanManager.TalismanTotalGJ;
		var perDigit: Digit = CalculateMgr.Mul(new Digit([100]), CalculateMgr.Div(gj, totalGJ));
        this._account.text = perDigit.ShowToString + "%";
        this.CreatSkill();
        this.setScrollBar();
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


    /**
     * 创建技能条
     */
    private CreatSkill(){
        this._talismanSkillGroup.removeChildren();
        var lineHeight: number = 0;

        for(let i:number=0; i< 10; i++){
            let skillLine: TalismanDetailList = new TalismanDetailList(this._talisman, i);
            skillLine.y = lineHeight;
            lineHeight += skillLine.height;
            this._talismanSkillGroup.addChild(skillLine);
        }
    }

    /**
     * 滚动条设置，初始化
     */
    private setScrollBar(){
        this._talismanSkillList.stopAnimation();
        this._talismanSkillList.viewport.scrollV=0;

        this._talismanSkillList.bounces=false;
        this._talismanSkillList.verticalScrollBar.autoVisibility = false;
        this._talismanSkillList.verticalScrollBar.visible = false;
    }

    // 变量
	private _closeButton: eui.Button;			// 关闭按钮
	private _talisman:Talisman;							// 物品
	private _talismanImage: eui.Image;				// 物品图标
	private _nameIma: eui.Image;				// 名字
	private _levelLabel: eui.Label;				// 等级
	private _gjLabel: eui.Label;				// 攻击力
	private _nextGJLabel: eui.Label;			// 下级攻击力
	private _account: eui.Label;				// 攻击力占比
	
    private _leftButton: eui.Button;            // 向左按钮
    private _rightButton: eui.Button;           // 向右按钮响应

    private _talismanSkillList : eui.Scroller;      // 列表
    private _talismanSkillGroup : eui.Group;        // 滚动容器
}
