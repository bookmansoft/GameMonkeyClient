/**
 * 排行榜行
 */
class IntegralRankList extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/IntegralRankListSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

    /**
     * 设置排行榜显示
     */
    public async SetShow(data:Object){

        // this._numLabel.textAlign = egret.HorizontalAlign.CENTER;
        this._numLabel.visible = false;
        if(data["rank"]==1)
            this._maxThreeIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("jifendh_mc_1_png");
        else if(data["rank"]==2)
            this._maxThreeIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("jifendh_mc_2_png");
        else if(data["rank"]==3)
            this._maxThreeIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("jifendh_mc_3_png");
        else{
            this._maxThreeIma.visible = false;
            this._numLabel.visible = true;
            this._numLabel.text = String(data["rank"]);
        }
            

        this._nameLabel.text = data["name"];
        this._xiaofeiLabel.text = "消费积分：" + data["score"].toString();
        this._data = data;

    }

    // 变量
    private _maxThreeIma : eui.Image;           // 排名前三的图标
    private _nameLabel : eui.Label;             // 玩家名字
    private _numLabel : eui.BitmapLabel;       // 排名
    private _data : Object;
    private _xiaofeiLabel : eui.Label;          // 排行内容
}