/**
 * 走马灯页面
 */
class TrottingHorseLampWindow extends APanel{
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/ui/ZouMaDengWindowSkins.exml");
	}

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

	/**
     * 显示界面
     */
	public ShowContent($der: string) {
		this._derLabel.text = $der;
		this.aniFun();
    }

	/**
	 * 轮播动画
	 */
	private aniFun(){
		this._derLabel.x = 640;
		egret.Tween.get(this._derLabel)
			.to({x:-this._derLabel.width}, 5000)
			.call(() => {
				this.UnRegister();
			});
	}


	// 变量
    private _derLabel: eui.Label;                   // 走马灯内容
}