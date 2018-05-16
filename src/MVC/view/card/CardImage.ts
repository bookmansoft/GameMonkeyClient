/**
 * 神魔图片
 */
class CardImage extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/card/CardImageSkins.exml";
    }
    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

    /**
     * 显示卡片
     */
    public async ShowCard(card: Card, ifSanJieFu: boolean = false){
        this._iconIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(card.Prototype.QSRes);

        this._natureIma.source = this.getNatureRes(card.Prototype.Nature);
        this._professionIma.source = this.getProfessionRes(card.Prototype.Profession);
        this._rtypeIma.source = this.getRtypeRes(card.Ad);

        this._starIma1.source = card.En >= 1 ? "shenmo_kapai_xing_png" : "shenmo_kapai_kongxing_png";
        this._starIma2.source = card.En >= 2 ? "shenmo_kapai_xing_png" : "shenmo_kapai_kongxing_png";
        this._starIma3.source = card.En >= 3 ? "shenmo_kapai_xing_png" : "shenmo_kapai_kongxing_png";
        this._starIma4.source = card.En >= 4 ? "shenmo_kapai_xing_png" : "shenmo_kapai_kongxing_png";
        this._starIma5.source = card.En >= 5 ? "shenmo_kapai_xing_png" : "shenmo_kapai_kongxing_png";

        // 是否获得
        if(ifSanJieFu){// 若是三界符抽卡，不根据等级判断
            this._ifGetIma.visible = ifSanJieFu ? false : true;
        }else{
            this._ifGetIma.visible = card.Lv <= 0 ? true : false;
        }
    }

    /**
     * 获取五行属性的图片资源
     */
    public getNatureRes(_natur: number){
        switch(_natur){
            case 1: return "shenmo_shu_jin_png";// 金
            case 2: return "shenmo_shu_mu_png";// 木
            case 3: return "shenmo_shu_shui_png";// 水
            case 4: return "shenmo_shu_huo_png";// 火
            case 5: return "shenmo_shu_tu_png";// 土
        }
    }

    /**
     * 获取职业的图片资源
     */
    public getProfessionRes(_profession: number){
        switch(_profession){
            case 0: return "shenmo_xian_fu_png";// 符，法术牌
            case 1: return "shenmo_xian_mo_png";// 魔？
            case 2: return "shenmo_xian_shen_png";// 神？
            case 3: return "shenmo_xian_xian_png";// 仙？
        }
    }

    /**
     * 获取品阶的图片资源
     */
    public getRtypeRes(_rtype: number){
        switch(_rtype){
            case 1: return "shenmo_kapai_baikuang_png";// 白
            case 2: return "shenmo_kapai_lvkuang_png";// 绿
            case 3: return "shenmo_kapai_lankuang_png";// 蓝
            case 4: return "shenmo_kapai_zikuang_png";// 紫
            case 5: return "shenmo_kapai_jinkuang_png";// 黄
        }
    }

    private _ifGetIma:eui.Image;                    // 是否获得
    private _iconIma:eui.Image;                     // 神魔图像
    private _professionIma:eui.Image;               // 职业
    private _natureIma:eui.Image;                   // 属性
    private _rtypeIma:eui.Image;                    // 边框,品阶

    private _starIma1:eui.Image;                    // 星星
    private _starIma2:eui.Image;
    private _starIma3:eui.Image;
    private _starIma4:eui.Image;
    private _starIma5:eui.Image;
    private _group:eui.Group;                       // 星星布局

    // private _kuangImaArr:any[]=["shenmo_kapai_baikuang","shenmo_kapai_jinkuang","shenmo_kapai_lankuang","shenmo_kapai_lvkuang","shenmo_kapai_zikuang"];     //框资源 无色、金色、蓝色、绿色、紫色
    // private _shuxingImaArr:any[]=["shenmo_shu_huo","shenmo_shu_jin","shenmo_shu_mu","shenmo_shu_shui","shenmo_shu_tu"];     //属性资源 火、金、木、水、土
    // private _pingzhiImaArr:any[]=["shenmo_xian_sanxian","shenmo_xian_dixian","shenmo_xian_tianxian","shenmo_xian_jinxian","shenmo_xian_zhenxian"];      //品质资源 散仙、地仙、天仙、金仙、真仙

}