/**
 *  等待页面界面
 */
class WaitPage extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
		super();
        this.skinName = "resource/game_skins/comm/WaitPageSkins.exml";
    }

	 /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

	private _waitIma: eui.Image;				// 等待图标
}