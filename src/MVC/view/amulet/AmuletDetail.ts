/**
 * 符咒详细界面
 */
class AmuletDetail extends APanel {
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/amulet/AmuletDetailWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this.anchorOffsetX = 640 / 2;
		this.anchorOffsetY = 1136 / 2;
		this.x = 640 / 2;
		this.y = 1136 / 2;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
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
	private _OnCloseClick(event: TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
	}

	/**
	 * 显示符咒
     * @param amulet    符咒
	 */
	public async ShowAmulet(amulet: Amulet){
        if (amulet == null) return;

        this._iconIma.source = amulet.Icon + "_png";
        this._nameIma.source = amulet.NameIma + "_png";

        this._curLevelLabel.text = "Lv." + amulet.Level.toString();
        // this._maxLevelLabel.text = "Lv." + amulet.MaxLevel;

        this._descriptionLabel.text = amulet.Description;

        // var lineHeight: number = 0;
        // for (var i = 0; i < 2; i++) {
        //     var amuletDetailList: AmuletDetailList = new AmuletDetailList();
        //     amuletDetailList.ShowAmulet(amulet);
            
        //     amuletDetailList.y = lineHeight;
        //     lineHeight += amuletDetailList.height+15;
        //     this._group.addChild(amuletDetailList);
        // }
        this._ShowMovie();
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
	// private _closeButton: eui.Button;			// 关闭按钮
	private _iconIma: eui.Image;				// 物品图标
	private _nameIma: eui.Image;				// 名字
	private _curLevelLabel: eui.Label;			// 当前等级
    // private _maxLevelLabel: eui.Label;		    // 等级上限
    private _descriptionLabel: eui.Label;		// 描述

    // private _internaldanUpButton: eui.Button;	// 内丹升级按钮
    // private _tokenUpButton: eui.Button;			// 元宝升级按钮
    
	// private _internaldanBuyLabel: eui.Label;	// 升级花费的内丹
	// private _tokenBuyLabel: eui.Label;			// 升级花费的元宝

    // private _group:eui.Group;                   //列表
}