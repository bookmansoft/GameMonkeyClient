/**
 * 佛光图片
 */
class BuddhaLine extends eui.Component{
	/*
	* 构造方法
     */
    public constructor(data:Talisman){
        super();
        this.skinName = "resource/game_skins/buddha/BuddhaLineSkins.exml";

        this.talisman = data;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._chooseBg.visible = false;
        this.UpdateShow();
    }

    /**
     * 更新显示
     */
    public UpdateShow(){
        // console.log(this.talisman);
        this._fgIconIma.source = this.talisman.Icon + "_png";
        // RES.getResAsync(this.talisman.Icon + "_png",icon =>{ this._fgIconIma.texture = icon},this);

        if(this.talisman.ori){
            this._fgBgIma.source = "foguang_youxingk_png";
            // RES.getResAsync("foguang_youxingk_png",icon =>{this._fgBgIma.texture = icon},this);
            this._fgNumText.text = this.talisman.ori.p;
        }
        else{
            this._fgBgIma.source = "foguang_wuxingk_png";
            // RES.getResAsync("foguang_wuxingk_png",icon =>{this._fgBgIma.texture = icon},this);
            this._fgNumText.text = '0';
        }
        
        if(this.talisman.Level < 1){
            this._fgIconIma.filters = [FilterManage.HuiDu];
        }else{
            this._fgIconIma.filters = [];
        }
    }

    /**
     * 取得显示法宝
     */
    public get Talisman(): Talisman{
        return this.talisman;
    }

    /**
     * 取得图片
     */
    public get Icon(): eui.Image{
        return this._fgIconIma;
    }

    /**
     * 取得被选中背景
     */
    public ChooseBg(data:boolean){
        this._chooseBg.visible = data;
    }

	private _fgBgIma : eui.Image;				// 佛光背景
	private _fgIconIma : eui.Image;				// 佛光法宝
	private _fgDiIma : eui.Image;				// 佛光星星底图
	private _fgStarIma : eui.Image;				// 星星
	private _fgNumText : eui.BitmapLabel;		// 佛光数量文本
    private talisman: Talisman;
    private _chooseBg: eui.Image;               // 被选中背景
}
