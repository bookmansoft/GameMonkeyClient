/**
 * 排行榜行
 */
class RankList extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/ui/RankListSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

    /**
     * 设置文本文字效果
     */
    // private _SetFilter(){
    //     // this._nameLabel.filters = [FilterManage.AddMiaoBian(2,0xffffff)];
    // }

    /**
     * 设置排行榜显示
     */
    public async SetShow(data:Object,$_pageNum){
        // this._numLabel.textAlign = egret.HorizontalAlign.CENTER;
        if(data["rank"] != undefined) this._numLabel.text = String(data["rank"]);
        if(data["rank"]==1)
            this._maxThreeIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("phb_1_png");
        else if(data["rank"]==2)
            this._maxThreeIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("phb_2_png");
        else if(data["rank"]==3)
            this._maxThreeIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes("phb_3_png");
        else
            this._maxThreeIma.visible = false;
        this._nameLabel.text = data["name"];
        this._guankaLabel.text = "积分：" + data["score"].toString();
        if($_pageNum == 1 && FacadeApp.read(CommandList.Re_RankInfo).list2.length == 0) {
            this._guankaLabel.visible = false;           
        }
        this._data = data;
        this._tiaozhanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this._OnTiaozhanClick, this);

        this._tiaozhanBtn.visible = $_pageNum == "1" ? GameConfigOfRuntime.TestUserId == data["id"]? false : true : false;
    }

    /**
     * 挑战按钮点击响应
     */
    public _OnTiaozhanClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        // 获取敌方信息
        FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=9"], [data => {
            //将网络数据保存到数据仓库，自动触发数据更新
            FacadeApp.dispatchAction(CommandList.M_DAT_MarshallingList, data['data']);
            if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            else FacadeApp.Notify(CommandList.M_CMD_ShowPVPVS, this._data);
        }]);


    }
    // 变量
    private _maxThreeIma : eui.Image;           // 排名前三的图标
    private _nameLabel : eui.Label;             // 玩家名字
    private _numLabel : eui.BitmapLabel;       // 排名
    private _data : Object;
    // private _leveLabel : eui.Label;             // 等级
    private _guankaLabel : eui.Label;          // 排行内容
    private _zhanliLabel : eui.Label;          // 战力内容
    private _tiaozhanBtn : eui.Button;         // 挑战按钮
}