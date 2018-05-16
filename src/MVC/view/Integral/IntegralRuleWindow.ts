/**
 * 积分规则提示框
 */
class IntegralRuleWindow extends APanel{
        /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/IntegralRulePageSkins.exml");
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
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        let data = FacadeApp.read(CommandList.Re_ActivityInfo);
        if(data.type == ActivityType.Money) this._ruleLabel.text = "  本次活动为累计消耗金币，活动持续一周，周六晚9点结算活动排名奖励。 \n \n   结算活动后，本期活动结束，活动信息保留供用所有玩家查看，直至下一期活动开启，周天轮休。";
        if(data.type == ActivityType.Diamond) this._ruleLabel.text = "  本次活动为累计消耗元宝，活动持续一周，周六晚9点结算活动排名奖励。 \n \n   结算活动后，本期活动结束，活动信息保留供用所有玩家查看，直至下一期活动开启，周天轮休。";
    }

	/**
	 * 点击关闭按钮响应
	 */
	private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
	}

	private _ruleLabel: eui.Label;								// 规则内容
	private _closeButton: eui.Button;							// 关闭按钮
    private _bg: eui.Image;                                     // 背景
}