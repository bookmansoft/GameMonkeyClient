/**
 * 条目背景底图
 */
class ListBgImage extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/comm/ListBgImageSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

	/**
	 * 设置为灰度
	 */
	public setHuiduState(){
		this.skin.currentState = "huidu";
	}

	/**
	 * 设置为高亮
	 */
	public setGaoLiangState(){
		this.skin.currentState = "gaoliang";
	}

	/**
	 * 设置为普通
	 */
	public setNormalState(){
		this.skin.currentState = "normal";
	}

}